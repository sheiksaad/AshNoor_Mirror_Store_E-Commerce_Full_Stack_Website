import { cloudinary } from "../config/cloudinary.js";

export interface CloudinaryUploadResult {
    url: string;
    publicId: string;
}

export function uploadBufferToCloudinary(
    buffer: Buffer,
    folder: string,
): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: "image" },
            (error, result) => {
                if (error || !result) {
                    console.error("❌ Cloudinary error details:", error);
                    reject(new Error(error?.message ?? "Cloudinary upload failed"));
                    return;
                }
                resolve({ url: result.secure_url, publicId: result.public_id });
            },
        );
        stream.end(buffer);
    });
}