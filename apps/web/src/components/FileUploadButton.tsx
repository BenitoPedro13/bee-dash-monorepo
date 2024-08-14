import useDataStore, { Attachment, baseApiUrl } from "@/store";
import React, { useRef } from "react";
import { parseCookies } from "nookies";

type FileUploadButtonProps = {
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
};

const FileUploadButton = ({
  attachments,
  setAttachments,
}: FileUploadButtonProps) => {
  const { "bee-dash-token": access_token } = parseCookies();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const newAttachments = [...attachments];

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const uploadFile = (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    fetch(`${baseApiUrl}/attachments`, {
      headers: {
        Authorization: `Bearer ${access_token}`, // Set the token in the Authorization header
      },
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        const res: Attachment = await response.json();
        newAttachments.unshift(res);
        setAttachments(newAttachments);
      })
      .catch((error) => {
        console.log("upload error:", error);
      });
  };

  return (
    <div>
      <button
        className="flex py-2 px-4 justify-center items-center gap-[10px] rounded-lg bg-[#FF8C00]"
        onClick={handleButtonClick}
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
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </button>
      {/* <div className="btn btn-ghost box-border flex-shrink-0 w-min h-auto flex justify-center items-center py-[10px] px-[8px] shadow-cost-per-metrics bg-white overflow-hidden self-stretch relative content-center flex-nowrap gap-2 rounded-lg border border-solid border-[#cfd4dc]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.25}
          stroke="#2d3442"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      /> */}
    </div>
  );
};

export default FileUploadButton;
