"use client";

import useDataStore, { Attachment, baseApiUrl } from "@/store";
import React, { useRef, useState } from "react";
import { parseCookies } from "nookies";
import { useParams } from "next/navigation";
import { getParam } from "@/lib/utils";

const FileUploadButton = () => {
  const { color } = useDataStore((state) => state.session.user);
  const addAttachments = useDataStore((state) => state.addAttachments);
  const hexColor =
    color === undefined ? "#FF8C00" : color.length !== 7 ? "#FF8C00" : color;
  const { "bee-dash-token": access_token } = parseCookies();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const params = useParams();
  const campaignId = getParam(params.campaignId);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length > 0) {
      uploadFiles(files);
    }
    event.target.value = "";
  };

  const uploadFile = async (file: File): Promise<Attachment> => {
    const formData = new FormData();
    formData.append("file", file);
    if (campaignId) {
      formData.append("campaignId", campaignId);
    }

    const response = await fetch(`${baseApiUrl}/attachments`, {
      headers: {
        Authorization: `Bearer ${access_token}`, // Set the token in the Authorization header
      },
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let message = `Falha ao enviar "${file.name}"`;
      try {
        const errorBody = await response.json();
        message = errorBody?.message ?? message;
      } catch {
        // response body wasn't JSON, keep default message
      }
      throw new Error(message);
    }

    return (await response.json()) as Attachment;
  };

  const uploadFiles = async (files: File[]) => {
    setUploadError(null);

    const results = await Promise.allSettled(files.map(uploadFile));

    const successful: Attachment[] = [];
    const failures: string[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled") {
        successful.push(result.value);
      } else {
        failures.push(
          result.reason instanceof Error
            ? result.reason.message
            : "Falha ao enviar arquivo"
        );
      }
    });

    if (successful.length > 0) {
      addAttachments(successful);
    }

    if (failures.length > 0) {
      console.error("Erro ao enviar anexos:", failures);
      setUploadError(failures.join(", "));
    }
  };

  return (
    <div>
      <button
        className="flex py-2 px-4 justify-center items-center gap-[10px] rounded-lg bg-[#FF8C00]"
        onClick={handleButtonClick}
        style={{
          backgroundColor: hexColor,
        }}
      >
        <p className="flex items-center gap-2 text-white opacity-95 font-nexa-bold text-sm font-semibold">
          Enviar Anexo
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M14 10V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V10"
              stroke="white"
              strokeOpacity="0.95"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.3332 5.33333L7.99984 2L4.6665 5.33333"
              stroke="white"
              strokeOpacity="0.95"
              strokeWidth="1.33"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 2V10"
              stroke="white"
              strokeOpacity="0.95"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </p>
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </button>
      {uploadError && (
        <p className="text-red-500 text-xs mt-1 max-w-[240px]">
          {uploadError}
        </p>
      )}
    </div>
  );
};

export default FileUploadButton;
