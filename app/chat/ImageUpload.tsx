import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ImageUpload({ chatId, sender, onUpload, triggerButton }: { chatId: number, sender: string, onUpload: (url: string) => void, triggerButton?: React.ReactNode }) {
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
    <>
      <input
        type="file"
        accept="image/jpeg,image/png"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {triggerButton ? (
        React.isValidElement(triggerButton)
          ? React.cloneElement(triggerButton as React.ReactElement<any>, {
              ...((triggerButton.props || {}) as object),
              onClick: (e: any) => {
                const btn = triggerButton as React.ReactElement<any>;
                if (typeof btn.props?.onClick === 'function') btn.props.onClick(e);
                fileInputRef.current?.click();
              },
              disabled: uploading,
            })
          : triggerButton
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="px-2 py-1 text-xs"
        >
          {uploading ? "Uploading..." : "Send Image"}
        </Button>
      )}
    </>
  );
}
