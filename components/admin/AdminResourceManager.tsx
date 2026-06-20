"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit,
  Eye,
  FileText,
  ImageIcon,
  Loader2,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  AdminField,
  AdminQuickAction,
  AdminResourceConfig,
  adminResourceConfigs,
} from "@/lib/admin/resourceConfig";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type SanityDoc = Record<string, any> & {
  _id: string;
  _createdAt?: string;
  _updatedAt?: string;
};

type ReferenceOption = {
  _id: string;
  label: string;
  _type: string;
};

type ReferenceMap = Record<string, ReferenceOption[]>;

type AdminResourceManagerProps = {
  resourceKey: string;
};

const emptyPagination = {
  limit: 25,
  offset: 0,
  total: 0,
  hasNextPage: false,
  currentPage: 1,
  totalPages: 1,
};

function getValue(document: SanityDoc | null, path: string | undefined) {
  if (!document || !path) return undefined;
  return path.split(".").reduce<any>((value, key) => {
    if (Array.isArray(value)) return value[Number(key)];
    return value?.[key];
  }, document);
}

function getColumnValue(document: SanityDoc, key: string, path?: string) {
  return getValue(document, path || key);
}

function getImageUrl(value: any) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value.url) return value.url;
  if (value.asset?.url) return value.asset.url;
  return "";
}

function formatCurrency(amount: number | null | undefined) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
}

function formatDate(value: string | null | undefined) {
  if (!value) return "Not set";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not set";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatLabel(value: unknown) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === null || value === undefined || value === "") return "Not set";
  return String(value)
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function badgeClass(value: unknown) {
  const normalized = String(value).toLowerCase();

  if (["active", "approved", "paid", "delivered", "published", "yes", "true"].includes(normalized)) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (["pending", "processing", "medium", "new"].includes(normalized)) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (["cancelled", "rejected", "failed", "inactive", "false", "no", "urgent"].includes(normalized)) {
    return "border-red-200 bg-red-50 text-red-700";
  }
  if (["hot", "sale", "high", "promo", "business", "premium"].includes(normalized)) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function toInputDateTime(value: unknown) {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
}

function fromInputDateTime(value: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function getReferenceIds(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => item?._ref || item?._id)
    .filter(Boolean)
    .map(String);
}

function portableTextToPlainText(value: unknown) {
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => {
      if (!block || block._type !== "block" || !Array.isArray(block.children)) {
        return "";
      }
      return block.children.map((child: any) => child?.text || "").join("");
    })
    .join("\n\n")
    .trim();
}

function plainTextToPortableText(value: unknown) {
  if (Array.isArray(value)) return value;
  const text = String(value || "").trim();
  if (!text) return [];

  return text.split(/\n{2,}/).map((paragraph) => ({
    _type: "block",
    _key: crypto.randomUUID(),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: crypto.randomUUID(),
        text: paragraph.trim(),
        marks: [],
      },
    ],
  }));
}

function createInitialForm(config: AdminResourceConfig, document?: SanityDoc | null) {
  const form: Record<string, any> = {};

  for (const field of config.fields) {
    const value = document?.[field.name];

    if (field.name === "slug") {
      form[field.name] = value?.current || "";
    } else if (field.type === "reference") {
      form[field.name] = value?._ref || value?._id || "";
    } else if (field.type === "referenceArray") {
      form[field.name] = getReferenceIds(value);
    } else if (field.type === "datetime") {
      form[field.name] = toInputDateTime(value);
    } else if (field.type === "date") {
      form[field.name] = value || "";
    } else if (field.type === "stringArray") {
      form[field.name] = Array.isArray(value) ? value.join("\n") : "";
    } else if (field.type === "portableText") {
      form[field.name] = portableTextToPlainText(value);
    } else if (field.type === "imageArray") {
      form[field.name] = Array.isArray(value) ? value : [];
    } else if (field.type === "image") {
      form[field.name] = value || null;
    } else if (field.type === "boolean") {
      form[field.name] = Boolean(value);
    } else {
      form[field.name] = value ?? "";
    }
  }

  return form;
}

function serializeForm(config: AdminResourceConfig, form: Record<string, any>) {
  const payload: Record<string, any> = {};

  for (const field of config.fields) {
    if (field.readOnly || field.hidden) continue;

    const value = form[field.name];
    if (field.type === "datetime") {
      payload[field.name] = fromInputDateTime(value);
    } else if (field.type === "number") {
      payload[field.name] = value === "" || value === null ? "" : Number(value);
    } else if (field.type === "stringArray") {
      payload[field.name] = value;
    } else if (field.type === "portableText") {
      payload[field.name] = plainTextToPortableText(value);
    } else {
      payload[field.name] = value;
    }
  }

  return payload;
}

function getActionIcon(action: AdminQuickAction) {
  if (action.type === "delete") return Trash2;
  if (action.type === "invoice") return FileText;
  if (action.type === "email") return Send;
  if (action.key.includes("archive")) return Archive;
  if (action.key.includes("approve") || action.key.includes("activate")) return Check;
  return Edit;
}

function ResourceStatCards({
  config,
  documents,
  total,
}: {
  config: AdminResourceConfig;
  documents: SanityDoc[];
  total: number;
}) {
  const statItems = useMemo(() => {
    if (config.key === "coupons") {
      const used = documents.reduce((sum, doc) => sum + Number(doc.timesUsed || 0), 0);
      const revenue = documents.reduce((sum, doc) => sum + Number(doc.revenueGenerated || 0), 0);
      return [
        { label: "Coupons", value: total },
        { label: "Times Used", value: used },
        { label: "Revenue", value: formatCurrency(revenue) },
      ];
    }

    if (config.key === "reviews") {
      const approved = documents.filter((doc) => doc.status === "approved").length;
      const average =
        documents.length > 0
          ? (
              documents.reduce((sum, doc) => sum + Number(doc.rating || 0), 0) /
              documents.length
            ).toFixed(1)
          : "0.0";
      return [
        { label: "Reviews", value: total },
        { label: "Approved Here", value: approved },
        { label: "Average Rating", value: average },
      ];
    }

    if (config.key === "products") {
      const lowStock = documents.filter((doc) => Number(doc.stock || 0) <= 5).length;
      return [
        { label: "Products", value: total },
        { label: "Low Stock Here", value: lowStock },
        { label: "Archived Here", value: documents.filter((doc) => doc.status === "archived").length },
      ];
    }

    return [
      { label: config.title, value: total },
      { label: "Loaded", value: documents.length },
      { label: "Editable Fields", value: config.fields.filter((field) => !field.readOnly).length },
    ];
  }, [config, documents, total]);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {statItems.map((stat) => (
        <Card key={stat.label} className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">
              {stat.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function AdminResourceManager({ resourceKey }: AdminResourceManagerProps) {
  const config = adminResourceConfigs[resourceKey];

  if (!config) {
    return (
      <div className="p-6">
        <Card className="border-red-200">
          <CardContent className="p-6 text-sm text-red-700">
            Unknown admin resource: {resourceKey}
          </CardContent>
        </Card>
      </div>
    );
  }

  const [documents, setDocuments] = useState<SanityDoc[]>([]);
  const [references, setReferences] = useState<ReferenceMap>({});
  const [pagination, setPagination] = useState(emptyPagination);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [detailsDoc, setDetailsDoc] = useState<SanityDoc | null>(null);
  const [editingDoc, setEditingDoc] = useState<SanityDoc | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargetIds, setDeleteTargetIds] = useState<string[]>([]);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const Icon = config.icon;
  const limit = 25;

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => window.clearTimeout(timer);
  }, [searchTerm]);

  const fetchDocuments = useCallback(
    async (requestedPage = page) => {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams({
          limit: String(limit),
          offset: String(requestedPage * limit),
          includeReferences: "true",
        });

        if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
        for (const [key, value] of Object.entries(filters)) {
          if (value && value !== "all") params.set(key, value);
        }

        const response = await fetch(
          `/api/admin/resources/${config.key}?${params.toString()}`,
          { cache: "no-store" }
        );
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result?.error || "Failed to load resource");
        }

        setDocuments(result.documents || []);
        setReferences(result.references || {});
        setPagination(result.pagination || emptyPagination);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load resource");
      } finally {
        setLoading(false);
      }
    },
    [config.key, debouncedSearchTerm, filters, page]
  );

  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm, filters, config.key]);

  useEffect(() => {
    fetchDocuments(page);
  }, [fetchDocuments, page]);

  const selectedAll = selectedIds.length === documents.length && documents.length > 0;

  const toggleSelectAll = () => {
    setSelectedIds(selectedAll ? [] : documents.map((document) => document._id));
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  const openCreate = () => {
    setEditingDoc(null);
    setForm(createInitialForm(config, null));
    setIsEditorOpen(true);
  };

  const openEdit = (document: SanityDoc) => {
    setEditingDoc(document);
    setForm(createInitialForm(config, document));
    setIsEditorOpen(true);
  };

  const updateForm = (field: AdminField, value: any) => {
    setForm((current) => ({
      ...current,
      [field.name]: value,
    }));
  };

  const saveDocument = async () => {
    setSaving(true);

    try {
      const payload = serializeForm(config, form);
      const response = await fetch(`/api/admin/resources/${config.key}`, {
        method: editingDoc ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingDoc
            ? {
                id: editingDoc._id,
                data: payload,
              }
            : payload
        ),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Failed to save document");
      }

      toast.success(`${config.singularTitle} saved`);
      setIsEditorOpen(false);
      setEditingDoc(null);
      await fetchDocuments(page);
    } catch (saveError) {
      toast.error(saveError instanceof Error ? saveError.message : "Failed to save document");
    } finally {
      setSaving(false);
    }
  };

  const runPatch = async (ids: string[], patch: Record<string, unknown>, label: string) => {
    if (ids.length === 0) return;

    try {
      const response = await fetch(`/api/admin/resources/${config.key}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, patch }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Action failed");
      }

      toast.success(label);
      setSelectedIds([]);
      await fetchDocuments(page);
    } catch (actionError) {
      toast.error(actionError instanceof Error ? actionError.message : "Action failed");
    }
  };

  const deleteDocuments = async () => {
    if (deleteTargetIds.length === 0) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/admin/resources/${config.key}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: deleteTargetIds }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Delete failed");
      }

      toast.success(`${deleteTargetIds.length} item${deleteTargetIds.length === 1 ? "" : "s"} deleted`);
      setSelectedIds([]);
      setDeleteTargetIds([]);
      setIsDeleteOpen(false);
      await fetchDocuments(page);
    } catch (deleteError) {
      toast.error(deleteError instanceof Error ? deleteError.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const requestDelete = (ids: string[]) => {
    setDeleteTargetIds(ids);
    setIsDeleteOpen(true);
  };

  const runQuickAction = async (document: SanityDoc, action: AdminQuickAction) => {
    if (action.type === "delete") {
      requestDelete([document._id]);
      return;
    }

    if (action.type === "invoice") {
      window.open(`/invoice/${document._id}`, "_blank", "noopener,noreferrer");
      return;
    }

    if (action.type === "email") {
      toast.info("Resend email action uses the existing order email flow when full order email data is available.");
      return;
    }

    if (action.type === "external" && action.href) {
      window.open(action.href, "_blank", "noopener,noreferrer");
      return;
    }

    if (action.type === "patch") {
      await runPatch([document._id], action.patch, `${action.label} complete`);
    }
  };

  const runBulkAction = async (action: AdminQuickAction) => {
    if (selectedIds.length === 0) return;
    if (action.type === "delete") {
      requestDelete(selectedIds);
      return;
    }
    if (action.type === "patch") {
      await runPatch(selectedIds, action.patch, `${action.label} complete`);
    }
  };

  const uploadImages = async (field: AdminField, files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingField(field.name);
    try {
      const data = new FormData();
      Array.from(files).forEach((file) => data.append("files", file));

      const response = await fetch(`/api/admin/resources/${config.key}/upload`, {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Upload failed");
      }

      const uploadedImages = result.images || [];
      updateForm(
        field,
        field.type === "imageArray"
          ? [...(Array.isArray(form[field.name]) ? form[field.name] : []), ...uploadedImages]
          : uploadedImages[0] || null
      );
      toast.success(`${uploadedImages.length} image${uploadedImages.length === 1 ? "" : "s"} uploaded`);
    } catch (uploadError) {
      toast.error(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setUploadingField(null);
    }
  };

  const exportCsv = () => {
    const visibleColumns = config.columns.filter((column) => column.type !== "image");
    const csv = [
      visibleColumns.map((column) => column.label).join(","),
      ...documents.map((document) =>
        visibleColumns
          .map((column) => {
            const value = getColumnValue(document, column.key, column.path);
            const text = Array.isArray(value) ? value.join(" | ") : formatLabel(value);
            return `"${String(text).replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${config.key}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderColumn = (document: SanityDoc, column: (typeof config.columns)[number]) => {
    const value = getColumnValue(document, column.key, column.path);

    if (column.type === "image") {
      const url = getImageUrl(value);
      return (
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-md border bg-slate-50">
          {url ? (
            <Image src={url} alt="" width={44} height={44} className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-4 w-4 text-slate-400" />
          )}
        </div>
      );
    }

    if (column.type === "currency") {
      return <span className="font-medium">{formatCurrency(Number(value || 0))}</span>;
    }

    if (column.type === "date") {
      return <span className="text-slate-600">{formatDate(value)}</span>;
    }

    if (column.type === "badge") {
      return (
        <Badge variant="outline" className={cn("font-medium", badgeClass(value))}>
          {formatLabel(value)}
        </Badge>
      );
    }

    if (Array.isArray(value)) {
      return <span>{value.filter(Boolean).join(", ") || "Not set"}</span>;
    }

    return <span className="line-clamp-2">{formatLabel(value)}</span>;
  };

  const renderField = (field: AdminField) => {
    const value = form[field.name];

    if (field.hidden) return null;

    if (field.type === "boolean") {
      return (
        <div key={field.name} className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <Label>{field.label}</Label>
            {field.description && (
              <p className="mt-1 text-xs text-slate-500">{field.description}</p>
            )}
          </div>
          <Switch
            checked={Boolean(value)}
            disabled={field.readOnly}
            onCheckedChange={(checked) => updateForm(field, checked)}
          />
        </div>
      );
    }

    if (
      field.type === "text" ||
      field.type === "stringArray" ||
      field.type === "portableText"
    ) {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Textarea
            id={field.name}
            value={value || ""}
            disabled={field.readOnly}
            placeholder={field.placeholder}
            rows={field.type === "stringArray" ? 5 : 4}
            className={field.type === "portableText" ? "min-h-48" : undefined}
            onChange={(event) => updateForm(field, event.target.value)}
          />
          {field.type === "stringArray" && (
            <p className="text-xs text-slate-500">One value per line.</p>
          )}
          {field.type === "portableText" && (
            <p className="text-xs text-slate-500">
              Separate paragraphs with a blank line. Saved as Sanity block content.
            </p>
          )}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Select
            value={value || ""}
            disabled={field.readOnly}
            onValueChange={(nextValue) => updateForm(field, nextValue)}
          >
            <SelectTrigger id={field.name}>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (field.type === "reference") {
      const options = field.referenceTo ? references[field.referenceTo] || [] : [];
      return (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Select
            value={value || ""}
            disabled={field.readOnly}
            onValueChange={(nextValue) => updateForm(field, nextValue)}
          >
            <SelectTrigger id={field.name}>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option._id} value={option._id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (field.type === "referenceArray") {
      const options = field.referenceTo ? references[field.referenceTo] || [] : [];
      const selected = Array.isArray(value) ? value : [];
      return (
        <div key={field.name} className="space-y-2">
          <Label>{field.label}</Label>
          <div className="max-h-48 space-y-2 overflow-y-auto rounded-lg border p-3">
            {options.length === 0 ? (
              <p className="text-sm text-slate-500">No options found.</p>
            ) : (
              options.map((option) => (
                <label key={option._id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={selected.includes(option._id)}
                    onCheckedChange={(checked) => {
                      updateForm(
                        field,
                        checked
                          ? [...selected, option._id]
                          : selected.filter((id: string) => id !== option._id)
                      );
                    }}
                  />
                  <span>{option.label}</span>
                </label>
              ))
            )}
          </div>
        </div>
      );
    }

    if (field.type === "image" || field.type === "imageArray") {
      const images = field.type === "imageArray" ? (Array.isArray(value) ? value : []) : value ? [value] : [];
      return (
        <div key={field.name} className="space-y-3">
          <Label>{field.label}</Label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {images.map((image: any, index: number) => {
              const url = getImageUrl(image);
              return (
                <div key={image?._key || index} className="relative aspect-square overflow-hidden rounded-lg border bg-slate-50">
                  {url ? (
                    <Image src={url} alt="" fill className="object-cover" />
                  ) : (
                    <ImageIcon className="m-auto mt-8 h-6 w-6 text-slate-400" />
                  )}
                  {!field.readOnly && (
                    <button
                      type="button"
                      className="absolute right-1 top-1 rounded-full bg-white p-1 shadow"
                      onClick={() => {
                        if (field.type === "imageArray") {
                          updateForm(
                            field,
                            images.filter((_: any, imageIndex: number) => imageIndex !== index)
                          );
                        } else {
                          updateForm(field, null);
                        }
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {!field.readOnly && (
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 py-2 text-sm font-medium hover:bg-slate-50">
              {uploadingField === field.name ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload
              <input
                className="sr-only"
                type="file"
                accept="image/*"
                multiple={field.type === "imageArray"}
                disabled={uploadingField === field.name}
                onChange={(event) => uploadImages(field, event.target.files)}
              />
            </label>
          )}
        </div>
      );
    }

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={field.name}>{field.label}</Label>
        <Input
          id={field.name}
          type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "datetime" ? "datetime-local" : "text"}
          value={value || ""}
          disabled={field.readOnly}
          placeholder={field.placeholder}
          onChange={(event) => updateForm(field, event.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6 bg-slate-50 p-4 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-white p-3 text-slate-700 shadow-sm ring-1 ring-slate-200">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Sanity Schema Module
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              {config.title}
            </h1>
            <p className="mt-1 max-w-3xl text-sm text-slate-500">
              {config.description}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="bg-white" onClick={exportCsv}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" className="bg-white" onClick={() => fetchDocuments(page)}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          {config.createEnabled && (
            <Button onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              New {config.singularTitle}
            </Button>
          )}
        </div>
      </div>

      <ResourceStatCards config={config} documents={documents} total={pagination.total} />

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={`Search ${config.title.toLowerCase()}...`}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(config.filters || []).map((filter) => (
                <Select
                  key={filter.key}
                  value={filters[filter.key] || "all"}
                  onValueChange={(value) =>
                    setFilters((current) => ({ ...current, [filter.key]: value }))
                  }
                >
                  <SelectTrigger className="w-[160px] bg-white">
                    <SelectValue placeholder={filter.label} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {filter.label}</SelectItem>
                    {filter.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm font-medium text-blue-900">
                  {selectedIds.length} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {(config.bulkActions || []).map((action) => {
                    const ActionIcon = getActionIcon(action);
                    return (
                      <Button
                        key={action.key}
                        size="sm"
                        variant={action.tone === "destructive" ? "destructive" : "outline"}
                        onClick={() => runBulkAction(action)}
                      >
                        <ActionIcon className="mr-2 h-4 w-4" />
                        {action.label}
                      </Button>
                    );
                  })}
                  {config.deleteEnabled && (
                    <Button size="sm" variant="destructive" onClick={() => requestDelete(selectedIds)}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete selected
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="hidden overflow-hidden rounded-lg border md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-12">
                    <Checkbox checked={selectedAll} onCheckedChange={toggleSelectAll} />
                  </TableHead>
                  {config.columns.map((column) => (
                    <TableHead key={column.key}>{column.label}</TableHead>
                  ))}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell colSpan={config.columns.length + 2}>
                        <div className="h-10 animate-pulse rounded bg-slate-100" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : documents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={config.columns.length + 2} className="py-12 text-center text-slate-500">
                      No {config.title.toLowerCase()} found.
                    </TableCell>
                  </TableRow>
                ) : (
                  documents.map((document) => (
                    <TableRow key={document._id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(document._id)}
                          onCheckedChange={() => toggleSelect(document._id)}
                        />
                      </TableCell>
                      {config.columns.map((column) => (
                        <TableCell key={column.key} className="max-w-[260px]">
                          {renderColumn(document, column)}
                        </TableCell>
                      ))}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setDetailsDoc(document)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => openEdit(document)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {(config.quickActions || []).map((action) => {
                                const ActionIcon = getActionIcon(action);
                                return (
                                  <DropdownMenuItem
                                    key={action.key}
                                    onClick={() => runQuickAction(document, action)}
                                    className={action.tone === "destructive" ? "text-red-600" : ""}
                                  >
                                    <ActionIcon className="mr-2 h-4 w-4" />
                                    {action.label}
                                  </DropdownMenuItem>
                                );
                              })}
                              {config.quickActions?.length ? <DropdownMenuSeparator /> : null}
                              {config.deleteEnabled && (
                                <DropdownMenuItem className="text-red-600" onClick={() => requestDelete([document._id])}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-3 md:hidden">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 animate-pulse rounded-lg bg-slate-100" />
              ))
            ) : documents.length === 0 ? (
              <div className="rounded-lg border p-8 text-center text-sm text-slate-500">
                No {config.title.toLowerCase()} found.
              </div>
            ) : (
              documents.map((document) => (
                <Card key={document._id} className="border-slate-200">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Checkbox
                          checked={selectedIds.includes(document._id)}
                          onCheckedChange={() => toggleSelect(document._id)}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-950">
                            {formatLabel(document.name || document.title || document.code || document.email || document.orderNumber || document._id)}
                          </p>
                          <p className="text-xs text-slate-500">
                            Updated {formatDate(document._updatedAt)}
                          </p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" onClick={() => setDetailsDoc(document)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {config.columns
                        .filter((column) => column.type !== "image")
                        .slice(0, 4)
                        .map((column) => (
                          <div key={column.key} className="rounded-md bg-slate-50 p-2">
                            <p className="text-xs text-slate-500">{column.label}</p>
                            <div className="mt-1 font-medium">{renderColumn(document, column)}</div>
                          </div>
                        ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(document)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      {config.deleteEnabled && (
                        <Button size="sm" variant="destructive" onClick={() => requestDelete([document._id])}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing {documents.length} of {pagination.total} records
            </p>
            <div className="flex gap-2">
              <Button variant="outline" disabled={page === 0} onClick={() => setPage(Math.max(0, page - 1))}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button variant="outline" disabled={!pagination.hasNextPage} onClick={() => setPage(page + 1)}>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Sheet open={Boolean(detailsDoc)} onOpenChange={(open) => !open && setDetailsDoc(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{config.singularTitle} Details</SheetTitle>
            <SheetDescription>
              Live Sanity document fields for this record.
            </SheetDescription>
          </SheetHeader>
          {detailsDoc && (
            <div className="space-y-4 p-4">
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => openEdit(detailsDoc)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                {config.key === "orders" && (
                  <Button asChild variant="outline">
                    <Link href={`/invoice/${detailsDoc._id}`} target="_blank">
                      <FileText className="mr-2 h-4 w-4" />
                      Invoice
                    </Link>
                  </Button>
                )}
              </div>
              {config.columns.map((column) => (
                <div key={column.key} className="rounded-lg border bg-white p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {column.label || column.key}
                  </p>
                  <div className="mt-2 text-sm text-slate-950">
                    {renderColumn(detailsDoc, column)}
                  </div>
                </div>
              ))}
              <details className="rounded-lg border bg-slate-50 p-3">
                <summary className="cursor-pointer text-sm font-medium text-slate-700">
                  Raw schema data
                </summary>
                <pre className="mt-3 max-h-80 overflow-auto rounded bg-white p-3 text-xs">
                  {JSON.stringify(detailsDoc, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingDoc ? "Edit" : "Create"} {config.singularTitle}
            </DialogTitle>
            <DialogDescription>
              Fields map directly to the Sanity `{config.documentType}` schema.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 sm:grid-cols-2">
            {config.fields.map((field) => (
              <div
                key={field.name}
                className={cn(
                  ["text", "imageArray", "stringArray", "portableText"].includes(field.type) && "sm:col-span-2",
                  field.type === "image" && "sm:col-span-2"
                )}
              >
                {renderField(field)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditorOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={saveDocument} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {config.singularTitle}</DialogTitle>
            <DialogDescription>
              This deletes {deleteTargetIds.length} Sanity document
              {deleteTargetIds.length === 1 ? "" : "s"}. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteDocuments} disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
