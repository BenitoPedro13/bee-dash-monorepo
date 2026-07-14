"use client";
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import useDataStore, { Influencer, baseApiUrl } from "@/store";
import Image from "next/image";
import juicyLimoArt from "@/../public/juicy-artwork-limo.svg";
import { UserCircle, UserIcon } from "lucide-react";
import { addAlphaToHex } from "../../../utils/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getParam } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

type CreatorsTableRowProps = {
  data: Influencer;
  userEmail: string;
};

const CreatorsTableRow = ({ data, userEmail }: CreatorsTableRowProps) => {
  const params = useParams(); // Extract dynamic route parameters

  const campaignId = getParam(params.campaignId);
  return (
    <tr className="!border-b-[#EAECF0]">
      <td>
        <Link href={`/campaigns/${campaignId}/creators/${data.id}`}>
          <div className="flex-shrink-0 flex justify-start items-center overflow-visible content-center flex-nowrap p-0 gap-[6px]">
            <div
              className="flex items-center justify-center w-[38px] h-[38px] rounded-full"
              style={{
                backgroundColor: addAlphaToHex("#FF8C00", 0.15),
              }}
            >
              {!data["Url Foto Perfil"] ? (
                <UserIcon color="#FF8C00" strokeWidth="1.66px" />
              ) : (
                <img
                  crossOrigin="anonymous"
                  src={`${baseApiUrl}${data["Url Foto Perfil"]}`}
                  width="38"
                  height="38"
                  alt="Creator Avatar"
                  className="rounded-full w-[38px] h-[38px]"
                />
              )}
            </div>

            <div className="flex-shrink-0 w-min h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-0 rounded-none">
              <h5
                className={`flex-shrink-0 w-auto h-auto whitespace-nowrap relative font-medium ${inter.className} text-[#0f1728] text-sm`}
              >
                {data.Influencer}
              </h5>
              <p
                className={`flex-shrink-0 w-auto h-auto whitespace-nowrap relative  hover:underline ${inter.className} text-[#475466] text-sm`}
              >
                @{data.Username}
              </p>
            </div>
          </div>
        </Link>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-pre-wrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.Cidade}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-pre-wrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseFloat(data.Investimento).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
      </td>
      {userEmail === "bitybank1@thatsbee.co" && (
        <td>
          <p
            className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-pre-wrap break-words relative ${inter.className} text-[#475466] text-sm`}
          >
            {Number.parseFloat(data.Cadastros).toLocaleString("pt-BR")}
          </p>
        </td>
      )}
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data.Posts).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data.Reels).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data.Stories).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data.Feed).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data.Tiktok).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Impacto Bruto"]).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data.Impressoes).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data.Interacoes).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data.Cliques).toLocaleString("pt-BR")}
        </p>
      </td>
      {/* <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Video Views"]).toLocaleString("pt-BR")}
        </p>
      </td> */}
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.Engajamento}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Impacto Bruto Tiktok"]).toLocaleString(
            "pt-BR"
          )}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Impressoes Tiktok"]).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Interacoes Tiktok"]).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Cliques Tiktok"]).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data["Engajamento Tiktok"]}
        </p>
      </td>
      {/* <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CPE}
        </p>
      </td> */}
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CTR}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CPV}
        </p>
      </td>
      {/* <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data["CPE Tiktok"]}
        </p>
      </td> */}
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data["CTR Tiktok"]}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data["CPV Tiktok"]}
        </p>
      </td>
      {/* <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CTR}
        </p>
      </td> */}
      <th>
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
      </th>
    </tr>
  );
};

export default CreatorsTableRow;
