/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import useDataStore, { Influencer, Posts, baseApiUrl } from "@/store";
import Image from "next/image";
import juicyLimoArt from "@/../public/juicy-artwork-limo.svg";
import { UserCircle, UserIcon } from "lucide-react";
import { addAlphaToHex, parseDateToPtBr } from "../../../utils/utils";
import Link from "next/link";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

type CreatorsTableRowProps = {
  data: Posts;
};

const PostsCreatorsTableRow = ({ data }: CreatorsTableRowProps) => {
  return (
    <tr className="!border-b-[#EAECF0]">
      <td className="h-[65px]">
        <h5
          className={`flex-shrink-0 w-auto h-auto whitespace-nowrap relative font-medium ${inter.className} text-[#0f1728] text-sm`}
        >
          Post nº {data.id}
        </h5>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.type}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.impressions.toLocaleString("pt-BR")}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.likes.toLocaleString("pt-BR")}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.shares.toLocaleString("pt-BR")}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.comments.toLocaleString("pt-BR")}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.saves.toLocaleString("pt-BR")}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.stickerClicks.toLocaleString("pt-BR")}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.linkClicks.toLocaleString("pt-BR")}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {parseDateToPtBr(data.postDate)}
        </p>
      </td>
      {/* <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Video Views"]).toLocaleString("pt-BR")}
        </p>
      </td> */}
      {/* <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.Engajamento}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Impacto Bruto Tiktok"]).toLocaleString(
            "pt-BR"
          )}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Impressoes Tiktok"]).toLocaleString("pt-BR")}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Interacoes Tiktok"]).toLocaleString("pt-BR")}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Cliques Tiktok"]).toLocaleString("pt-BR")}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data["Engajamento Tiktok"]}
        </p>
      </td> */}
      {/* <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CPE}
        </p>
      </td> */}
      {/* <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CTR}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CPV}
        </p>
      </td> */}
      {/* <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data["CPE Tiktok"]}
        </p>
      </td> */}
      {/* <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data["CTR Tiktok"]}
        </p>
      </td>
      <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data["CPV Tiktok"]}
        </p>
      </td> */}
      {/* <td className="h-[65px]">
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-keep relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CTR}
        </p>
      </td> */}
      {/* <th>
        <button className="btn btn-ghost p-0 text-xs h-6 min-h-[24px] !bg-transparent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#475466"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </th> */}
    </tr>
  );
};

export default PostsCreatorsTableRow;
