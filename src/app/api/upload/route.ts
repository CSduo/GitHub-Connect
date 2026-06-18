import { NextRequest, NextResponse } from "next/server";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { getUserAuth, getAdminAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ALLOWED_TYPES: Record<string, string[]> = {
  manuscript: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  image: ["image/jpeg", "image/png", "image/webp"],
};

const MAX_SIZE = {
  manuscript: 50 * 1024 * 1024, // 50MB
  image: 20 * 1024 * 1024, // 20MB
};

export async function POST(req: NextRequest) {
  try {
    // Check auth
    const [userAuth, adminAuth] = await Promise.all([getUserAuth(), getAdminAuth()]);
    if (!userAuth && !adminAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const category = (formData.get("category") as string) || "image";
    const submissionId = (formData.get("submissionId") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = category === "manuscript" ? ALLOWED_TYPES.manuscript : [...ALLOWED_TYPES.manuscript, ...ALLOWED_TYPES.image];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: PDF, DOC, DOCX, JPG, PNG, WEBP` },
        { status: 400 }
      );
    }

    // Validate file size
    const maxSize = category === "manuscript" ? MAX_SIZE.manuscript : MAX_SIZE.image;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Max: ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Generate safe filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `${category}/${timestamp}-${safeName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);
      return NextResponse.json(
        { error: "Upload failed: " + uploadError.message },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path);

    const url = urlData.publicUrl;

    // Save to media assets
    const asset = await prisma.mediaAsset.create({
      data: {
        url,
        storageKey: path,
        mimeType: file.type,
        extension: safeName.split(".").pop() || "",
        sizeBytes: file.size,
        context: category,
      },
    });

    // If linked to submission, create submission file
    if (submissionId) {
      await prisma.submissionFile.create({
        data: {
          submissionId,
          originalName: file.name,
          storedName: safeName,
          url,
          storageKey: path,
          mimeType: file.type,
          extension: safeName.split(".").pop() || "",
          sizeBytes: file.size,
          fileCategory: category === "manuscript" ? "MANUSCRIPT" : category === "cover" ? "COVER" : "SUPPORTING",
        },
      });
    }

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.id,
        url,
        name: file.name,
        size: file.size,
        mimeType: file.type,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
