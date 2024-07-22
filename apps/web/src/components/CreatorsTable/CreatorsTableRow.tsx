import React from "react";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { Influencer, baseApiUrl } from "@/store";
import Image from "next/image";
import juicyLimoArt from "@/../public/juicy-artwork-limo.svg";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

type CreatorsTableRowProps = {
  data: Influencer;
};

const CreatorsTableRow = ({ data }: CreatorsTableRowProps) => {
  return (
    <tr>
      <td>
        <div className="flex-shrink-0 flex justify-start items-center overflow-visible content-center flex-nowrap p-0 gap-[6px]">
          <div className="avatar">
            <div className="mask mask-squircle w-[38px] h-[38px] aspect-square block rounded-full border-black border-[1px] border-solid bg-[url('/bg-contact-cta.webp')] bg-cover bg-no-repeat bg-center relative">
              {!data["Url Foto Perfil"] ? (
                <div className="">
                  <Image src={juicyLimoArt} alt="Creator Avatar" width={38} height={38} className="absolute right-[2px]"/>
                </div>
              ) : (
                <img
                  src={`${data["Url Foto Perfil"]}`}
                  width="38"
                  height="38"
                  alt='Creator Avatar'
                  className=""
                />
              )}
            </div>
          </div>
          <div className="flex-shrink-0 w-min h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-0 rounded-none">
            <h5
              className={`flex-shrink-0 w-auto h-auto whitespace-nowrap relative font-medium ${inter.className} text-[#0f1728] text-sm`}
            >
              {data.Influencer}
            </h5>
            <p
              className={`flex-shrink-0 w-auto h-auto whitespace-nowrap relative ${inter.className} text-[#475466] text-sm`}
            >
              @{data.Username}
            </p>
          </div>
        </div>
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
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {Number.parseInt(data["Video Views"]).toLocaleString("pt-BR")}
        </p>
      </td>
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
          {data["Engajamento Tiktok"]}
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
          {Number.parseInt(data["Impressoes Tiktok"]).toLocaleString("pt-BR")}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CPE}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CPC}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CPV}
        </p>
      </td>
      <td>
        <p
          className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-nowrap break-words relative ${inter.className} text-[#475466] text-sm`}
        >
          {data.CTR}
        </p>
      </td>
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
