import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import {
  AdminField,
  AdminFilter,
  getAdminResourceConfig,
  resolveSpecialPatchValues,
} from "@/lib/admin/resourceConfig";
import { isUserAdmin } from "@/lib/adminUtils";
import { writeClient } from "@/sanity/lib/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const clerk = await clerkClient();
  const currentUser = await clerk.users.getUser(userId);
  const userEmail = currentUser.primaryEmailAddress?.emailAddress;

  if (!userEmail || !isUserAdmin(userEmail)) {
    return {
      ok: false as const,
      response: NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { ok: true as const, userId, userEmail };
}

function normalizeSlug(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "object" && value && "current" in value) {
    return value;
  }

  return {
    _type: "slug",
    current: String(value)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, ""),
  };
}

function slugify(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function getSlugSource(input: Record<string, unknown>) {
  return (
    input.name ||
    input.title ||
    input.code ||
    input.email ||
    input.subject ||
    "item"
  );
}

async function createUniqueSlug(
  documentType: string,
  source: unknown,
  excludeId?: string
) {
  const baseSlug = slugify(source) || "item";
  let slug = baseSlug;
  let suffix = 2;
  const excludeIds = excludeId
    ? Array.from(
        new Set([
          excludeId,
          excludeId.startsWith("drafts.")
            ? excludeId.replace(/^drafts\./, "")
            : `drafts.${excludeId}`,
        ])
      )
    : [];

  while (true) {
    const existing = await writeClient.fetch(
      `count(*[_type == $type && slug.current == $slug && !(_id in $excludeIds)])`,
      { type: documentType, slug, excludeIds },
      { cache: "no-store", next: { revalidate: 0 } }
    );

    if (!existing) {
      return {
        _type: "slug",
        current: slug,
      };
    }

    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

function createReference(id: string) {
  return {
    _type: "reference",
    _ref: id,
    _key: crypto.randomUUID(),
  };
}

function normalizeReference(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "object" && value && "_ref" in value) return value;
  if (typeof value === "object" && value && "_id" in value) {
    return { _type: "reference", _ref: String((value as { _id: string })._id) };
  }
  return { _type: "reference", _ref: String(value) };
}

function normalizeReferenceArray(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item) return null;
      if (typeof item === "object" && "_ref" in item) return item;
      if (typeof item === "object" && "_id" in item) {
        return createReference(String((item as { _id: string })._id));
      }
      return createReference(String(item));
    })
    .filter(Boolean);
}

function normalizeImage(value: unknown) {
  if (!value) return undefined;
  if (typeof value === "string") {
    return {
      _type: "image",
      asset: {
        _type: "reference",
        _ref: value,
      },
    };
  }
  if (typeof value === "object" && value) {
    const image = value as Record<string, unknown>;
    const asset = image.asset as Record<string, unknown> | undefined;
    const { asset: _asset, url: _url, ...imageFields } = image;
    const assetRef =
      typeof asset?._ref === "string"
        ? asset._ref
        : typeof asset?._id === "string"
          ? asset._id
          : "";

    if (assetRef) {
      return {
        ...imageFields,
        _type: String(imageFields._type || "image"),
        asset: {
          _type: "reference",
          _ref: assetRef,
        },
      };
    }
  }
  return value;
}

function normalizeImageArray(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      const normalized = normalizeImage(item);
      if (!normalized || typeof normalized !== "object") return null;
      return {
        _key:
          "_key" in normalized
            ? (normalized as { _key?: string })._key
            : crypto.randomUUID(),
        ...(normalized as Record<string, unknown>),
      };
    })
    .filter(Boolean);
}

function normalizeStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function normalizeFieldValue(field: AdminField, value: unknown) {
  if (value === undefined) return undefined;
  if (value === "" && !["string", "text"].includes(field.type)) return undefined;

  if (field.name === "slug") return normalizeSlug(value);

  switch (field.type) {
    case "number":
      if (value === null || value === "") return undefined;
      return Number(value);
    case "boolean":
      return Boolean(value);
    case "reference":
      return normalizeReference(value);
    case "referenceArray":
      return normalizeReferenceArray(value);
    case "image":
      return normalizeImage(value);
    case "imageArray":
      return normalizeImageArray(value);
    case "stringArray":
      return normalizeStringArray(value);
    default:
      return value;
  }
}

function normalizeDocumentData(fields: AdminField[], input: Record<string, unknown>) {
  const data: Record<string, unknown> = {};

  for (const field of fields) {
    if (field.readOnly || field.hidden) continue;
    if (!(field.name in input)) continue;

    const normalized = normalizeFieldValue(field, input[field.name]);
    if (normalized !== undefined) {
      data[field.name] = normalized;
    }
  }

  return data;
}

function normalizePatchValues(values: Record<string, unknown>) {
  return resolveSpecialPatchValues(values) as Record<string, unknown>;
}

function buildFilterValue(field: AdminField | undefined, value: string) {
  if (!field) return value;
  if (field.type === "boolean") return value === "true";
  if (field.type === "number") return Number(value);
  return value;
}

function addFilterCondition({
  filter,
  value,
  field,
  paramName,
  filterConditions,
  queryParams,
}: {
  filter: AdminFilter;
  value: string;
  field: AdminField | undefined;
  paramName: string;
  filterConditions: string[];
  queryParams: Record<string, unknown>;
}) {
  if (filter.key === "stockStatus") {
    if (value === "inStock") filterConditions.push("stock > 5");
    if (value === "lowStock") {
      filterConditions.push("defined(stock) && stock > 0 && stock <= 5");
    }
    if (value === "outOfStock") {
      filterConditions.push("defined(stock) && stock <= 0");
    }
    return;
  }

  if (filter.key === "priceRange") {
    const [min, max] = value.split("-");
    if (min) {
      const minParam = `${paramName}_min`;
      filterConditions.push(`${filter.field} >= $${minParam}`);
      queryParams[minParam] = Number(min);
    }
    if (max) {
      const maxParam = `${paramName}_max`;
      filterConditions.push(`${filter.field} <= $${maxParam}`);
      queryParams[maxParam] = Number(max);
    }
    return;
  }

  if (filter.key === "discount") {
    if (value === "none") filterConditions.push("coalesce(discount, 0) <= 0");
    if (value === "active") filterConditions.push("coalesce(discount, 0) > 0");
    if (value === "high") filterConditions.push("coalesce(discount, 0) >= 30");
    return;
  }

  if (field?.type === "referenceArray") {
    filterConditions.push(`references($${paramName})`);
    queryParams[paramName] = value;
    return;
  }

  if (field?.type === "reference") {
    filterConditions.push(`${filter.field}._ref == $${paramName}`);
    queryParams[paramName] = value;
    return;
  }

  filterConditions.push(`${filter.field} == $${paramName}`);
  queryParams[paramName] = buildFilterValue(field, value);
}

async function getReferenceOptions(referenceTypes: string[]) {
  if (referenceTypes.length === 0) return {};

  const queries = referenceTypes.map((type) =>
    writeClient.fetch(
      `*[_type == $type] | order(coalesce(title, name, email, code) asc)[0...500]{
        _id,
        _type,
        "label": coalesce(title, name, email, code, _id),
        slug
      }`,
      { type }
    )
  );

  const results = await Promise.all(queries);
  return Object.fromEntries(referenceTypes.map((type, index) => [type, results[index]]));
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { resource } = await params;
  const config = getAdminResourceConfig(resource);

  if (!config) {
    return NextResponse.json({ error: "Unknown admin resource" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const limit = Math.min(Number(searchParams.get("limit") || 25), 100);
  const offset = Math.max(Number(searchParams.get("offset") || 0), 0);
  const search = searchParams.get("search")?.trim();
  const includeReferences = searchParams.get("includeReferences") === "true";
  const projection = config.projection || "{...}";
  const slugSource = searchParams.get("slugSource");
  const excludeId = searchParams.get("excludeId") || undefined;

  if (slugSource !== null) {
    const slug = await createUniqueSlug(
      config.documentType,
      slugSource,
      excludeId
    );

    return NextResponse.json(
      {
        slug,
        current: slug.current,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  }

  if (id) {
    const [document, references] = await Promise.all([
      writeClient.fetch(
        `*[_type == $type && _id == $id][0]${projection}`,
        { type: config.documentType, id },
        { cache: "no-store", next: { revalidate: 0 } }
      ),
      includeReferences
        ? getReferenceOptions(
            Array.from(
              new Set(
                config.fields
                  .map((field) => field.referenceTo)
                  .filter(Boolean) as string[]
              )
            )
          )
        : Promise.resolve({}),
    ]);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ document, references });
  }

  const filterConditions: string[] = [`_type == $type`];
  const queryParams: Record<string, unknown> = {
    type: config.documentType,
    search: search ? `${search}*` : "",
  };

  if (search) {
    filterConditions.push(
      `(${config.searchFields.map((field) => `${field} match $search`).join(" || ")})`
    );
  }

  for (const filter of config.filters || []) {
    const value = searchParams.get(filter.key);
    if (!value || value === "all") continue;

    const field = config.fields.find((item) => item.name === filter.field);
    const paramName = `filter_${filter.key}`;
    addFilterCondition({
      filter,
      value,
      field,
      paramName,
      filterConditions,
      queryParams,
    });
  }

  const filterQuery = filterConditions.join(" && ");
  const query = `*[${filterQuery}] | order(${config.listOrder}) [${offset}...$end]${projection}`;
  const countQuery = `count(*[${filterQuery}])`;

  queryParams.end = offset + limit;

  const referenceTypes = Array.from(
    new Set(
      config.fields
        .map((field) => field.referenceTo)
        .filter(Boolean) as string[]
    )
  );

  const [documents, totalCount, references] = await Promise.all([
    writeClient.fetch(query, queryParams, {
      cache: "no-store",
      next: { revalidate: 0 },
    }),
    writeClient.fetch(countQuery, queryParams, {
      cache: "no-store",
      next: { revalidate: 0 },
    }),
    includeReferences ? getReferenceOptions(referenceTypes) : Promise.resolve({}),
  ]);

  return NextResponse.json(
    {
      documents,
      totalCount,
      references,
      pagination: {
        limit,
        offset,
        total: totalCount,
        hasNextPage: offset + limit < totalCount,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(totalCount / limit),
      },
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { resource } = await params;
  const config = getAdminResourceConfig(resource);

  if (!config) {
    return NextResponse.json({ error: "Unknown admin resource" }, { status: 404 });
  }

  if (!config.createEnabled) {
    return NextResponse.json({ error: "Create is disabled for this resource" }, { status: 405 });
  }

  const body = await request.json();
  const data = normalizeDocumentData(config.fields, body);
  const hasSlugField = config.fields.some((field) => field.name === "slug");

  if (hasSlugField) {
    const slug = data.slug as { current?: string } | undefined;
    data.slug = await createUniqueSlug(
      config.documentType,
      slug?.current || getSlugSource(body)
    );
  }

  const created = await writeClient.create({
    _type: config.documentType,
    ...data,
  });

  revalidatePath(`/admin/${resource}`);

  return NextResponse.json({ document: created }, { status: 201 });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { resource } = await params;
  const config = getAdminResourceConfig(resource);

  if (!config) {
    return NextResponse.json({ error: "Unknown admin resource" }, { status: 404 });
  }

  const body = await request.json();
  const ids: string[] = body.ids || (body.id ? [body.id] : []);

  if (ids.length === 0) {
    return NextResponse.json({ error: "Document id is required" }, { status: 400 });
  }

  const data =
    body.patch && typeof body.patch === "object"
      ? normalizePatchValues(body.patch)
      : normalizeDocumentData(config.fields, body.data || body);

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No writable fields supplied" }, { status: 400 });
  }

  const hasSlugField = config.fields.some((field) => field.name === "slug");
  const documents = [];
  for (const id of ids) {
    const documentData = { ...data };

    if (hasSlugField && "slug" in documentData) {
      const slug = documentData.slug as { current?: string } | undefined;
      documentData.slug = await createUniqueSlug(
        config.documentType,
        slug?.current || getSlugSource(body.data || body),
        id
      );
    }

    const document = await writeClient.patch(id).set(documentData).commit();
    documents.push(document);
  }

  revalidatePath(`/admin/${resource}`);

  return NextResponse.json({
    success: true,
    documents,
    count: documents.length,
  });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ resource: string }> }
) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const { resource } = await params;
  const config = getAdminResourceConfig(resource);

  if (!config) {
    return NextResponse.json({ error: "Unknown admin resource" }, { status: 404 });
  }

  if (!config.deleteEnabled) {
    return NextResponse.json({ error: "Delete is disabled for this resource" }, { status: 405 });
  }

  const body = await request.json();
  const ids: string[] = body.ids || (body.id ? [body.id] : []);

  if (ids.length === 0) {
    return NextResponse.json({ error: "Document id is required" }, { status: 400 });
  }

  for (const id of ids) {
    await writeClient.delete(id);
  }

  revalidatePath(`/admin/${resource}`);

  return NextResponse.json({
    success: true,
    count: ids.length,
  });
}
