import React, { useState } from "react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Attachment, baseApiUrl } from "@/store";
import Image from "next/image";
import fileIcon from "@/../public/fileIcon.svg";
import Link from "next/link";
import { addAlphaToHex, parseUpdatedAt } from "../../../utils/utils";
import { File } from "lucide-react";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

type AttachmentsTableRowProps = {
  data: Attachment;
};

function formatFileSize(fileSize: number): string {
  const KB = 1024;
  const MB = KB * KB;

  if (fileSize >= MB) {
    return `${(fileSize / MB).toFixed(2)} MB`;
  } else if (fileSize >= KB) {
    return `${(fileSize / KB).toFixed(2)} KB`;
  } else {
    return `${fileSize} bytes`;
  }
}

const AttachmentsTableRow = ({ data }: AttachmentsTableRowProps) => {
  return (
    <tr>
      <td>
        <div className="flex-shrink-0 flex justify-start items-center overflow-visible content-center flex-nowrap p-0 gap-[6px]">
          <div
            className="flex items-center justify-center w-[38px] h-[38px] rounded-full"
            style={{
              backgroundColor: addAlphaToHex("#FF8C00", 0.15),
            }}
          >
            <File color="#FF8C00" strokeWidth="1.66px" />
          </div>
          <div className="flex-shrink-0 w-min h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-0 rounded-none">
            <h5
              className={`flex-shrink-0 w-auto h-auto whitespace-nowrap relative font-medium ${inter.className} text-[#0f1728] text-sm`}
            >
              {data.originalFilename}
            </h5>
            <p
              className={`flex-shrink-0 w-auto h-auto whitespace-nowrap relative ${inter.className} text-[#475466] text-sm`}
            >
              {formatFileSize(data.fileSize)}
            </p>
          </div>
        </div>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-pre-wrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {formatFileSize(data.fileSize)}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {parseUpdatedAt(data.updatedAt)}
        </p>
      </td>
      <th>
        <button className="btn btn-ghost p-0 text-xs h-6 min-h-[24px] !bg-transparent">
          <Link
            href={`${baseApiUrl}/public/${data.uniqueFilename}`}
            target="_blank"
            download={data.originalFilename}
          >
            <p
              className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-semibold ${jakarta.className} text-[#FF5100] text-sm`}
            >
              Download
            </p>
          </Link>
        </button>
      </th>
    </tr>
  );
};

export default AttachmentsTableRow;
