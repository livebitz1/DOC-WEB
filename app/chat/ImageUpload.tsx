import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ImageUpload({ chatId, sender, onUpload }: { chatId: number, sender: string, onUpload: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { // 3MB
      alert("Please upload an image under 3MB.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("chatId", String(chatId));
    formData.append("sender", sender);
    formData.append("file", file);
    const res = await fetch("/api/message/image-upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (data.imageUrl) {
      onUpload(data.imageUrl);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept="image/jpeg,image/png"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="px-2 py-1 text-xs"
      >
        {uploading ? "Uploading..." : "Send Image"}
      </Button>
    </div>
  );
}
