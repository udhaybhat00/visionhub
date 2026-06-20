import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { getAdminResourceConfig } from "@/lib/admin/resourceConfig";
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

  return { ok: true as const };
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

  const formData = await request.formData();
  const files = formData.getAll("files").filter((file): file is File => file instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files supplied" }, { status: 400 });
  }

  const images = [];

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    images.push({
      _type: "image",
      _key: crypto.randomUUID(),
      asset: {
        _type: "reference",
        _ref: asset._id,
      },
      url: asset.url,
    });
  }

  return NextResponse.json({ images });
}
