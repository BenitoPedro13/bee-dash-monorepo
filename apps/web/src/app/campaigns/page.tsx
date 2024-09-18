/* eslint-disable @next/next/no-img-element */
"use client";

import useDataStore, { baseApiUrl } from "@/store";

import BreadcrumbComponent from "@/components/Breadcrumb";
import TitleWithoutFilters from "@/components/TitleWithoutFilters";
import CampaingCard from "@/components/CampaignCard";

export default function Home() {
  const color = useDataStore((state) => state.session.user.color);
  const campaigns = useDataStore((state) => state.session.user.campaigns);
  const session = useDataStore((state) => state.session);

  const hexColor =
    color === undefined ? "#FF8C00" : color.length !== 7 ? "#FF8C00" : color;

  return (
    <div>
      <div className="w-full h-full flex xl:flex-row flex-col justify-start items-start z-20 p-0 xl:pl-[82px] content-start flex-nowrap gap-0 rounded-none relative">
        <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-center xl:pt-8 xl:pb-8 py-[15px] overflow-visible content-center flex-nowrap xl:gap-6 gap-[15px] rounded-none">
          <div className="box-border flex-shrink-0 w-full xl:h-auto h-min flex flex-col justify-center items-start xl:px-8 px-[15px] overflow-visible relative content-start flex-nowrap gap-6 rounded-none">
            <div className="flex justify-between items-center self-stretch">
              <BreadcrumbComponent route="campaigns" />
              <div className="w-fit flex items-start gap-4">
                {!session?.user?.urlProfilePicture ? (
                  <div className="mask mask-squircle w-12 h-12 aspect-square block rounded-full border-black border-[1px] border-solid bg-[url('/bg-contact-cta.webp')] bg-cover bg-no-repeat bg-center relative">
                    <img
                      src="/juicy-artwork-limo.svg"
                      alt="Default Bee Company Avatar"
                      className="absolute right-[3px]"
                    />
                  </div>
                ) : (
                  <img
                    src={`${baseApiUrl}${session.user.urlProfilePicture}`}
                    width="40"
                    height="40"
                    alt={`${session.user.name} Logo`}
                    className="border-black border-[1px] border-solid rounded-full"
                  />
                )}
              </div>
            </div>

            <TitleWithoutFilters title="Suas Campanhas" />
          </div>
        </div>
      </div>

      <div className="w-full h-full xl:pl-[114px] relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6 gap-4 pb-6 xl:pr-8 p-0 px-[15px]">
        {campaigns.map((item) => (
          <CampaingCard key={item.id} campaign={item} />
        ))}
      </div>

      <div className="h-full w-full flex items-center justify-center xl:pl-[114px] relative z-20 gap-4 pb-6 xl:pr-8 p-0 px-[15px]">
        <div className="h-[400px] bg-white w-full rounded-xl border-[#D4D4D4] border flex flex-col items-center justify-center">
          <svg
            width="58"
            height="57"
            viewBox="0 0 58 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="0.5" width="57" height="57" rx="28.5" fill={hexColor} />
            <path
              d="M41.75 29C41.75 29.2818 41.6381 29.552 41.4388 29.7513C41.2395 29.9506 40.9693 30.0625 40.6875 30.0625H30.0625V40.6875C30.0625 40.9693 29.9506 41.2395 29.7513 41.4388C29.552 41.6381 29.2818 41.75 29 41.75C28.7182 41.75 28.448 41.6381 28.2487 41.4388C28.0494 41.2395 27.9375 40.9693 27.9375 40.6875V30.0625H17.3125C17.0307 30.0625 16.7605 29.9506 16.5612 29.7513C16.3619 29.552 16.25 29.2818 16.25 29C16.25 28.7182 16.3619 28.448 16.5612 28.2487C16.7605 28.0494 17.0307 27.9375 17.3125 27.9375H27.9375V17.3125C27.9375 17.0307 28.0494 16.7605 28.2487 16.5612C28.448 16.3619 28.7182 16.25 29 16.25C29.2818 16.25 29.552 16.3619 29.7513 16.5612C29.9506 16.7605 30.0625 17.0307 30.0625 17.3125V27.9375H40.6875C40.9693 27.9375 41.2395 28.0494 41.4388 28.2487C41.6381 28.448 41.75 28.7182 41.75 29Z"
              fill="white"
            />
          </svg>

          <p className="text-[#101828] font-nexa font-bold text-[32px]">
            Criar nova campanha
          </p>
        </div>
      </div>
    </div>
  );
}
