/* eslint-disable @next/next/no-img-element */
"use client";

import useDataStore, { baseApiUrl, PostsPack } from "@/store";

import BreadcrumbComponent from "@/components/Breadcrumb";
import TitleWithoutFilters from "@/components/TitleWithoutFilters";
import CampaingCard from "@/components/CampaignCard";
import CreatorCard from "@/components/CreatorsCard";

export default function Home() {
  const color = useDataStore((state) => state.session.user.color);
  const session = useDataStore((state) => state.session);
  const creators = session.user.creators;

  const hexColor =
    color === undefined ? "#FF8C00" : color.length !== 7 ? "#FF8C00" : color;

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const creatorsIds = Object.keys(creators);

  return (
    <div>
      <div className="w-full h-full flex xl:flex-row flex-col justify-start items-start z-20 p-0 xl:pl-[82px] content-start flex-nowrap gap-0 rounded-none relative">
        <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-center xl:pt-8 pt-8 pb-6 overflow-visible content-center flex-nowrap xl:gap-6 gap-[15px] rounded-none">
          <div className="box-border flex-shrink-0 w-full xl:h-auto h-min flex flex-col justify-center items-start xl:px-8 px-[15px] overflow-visible relative content-start flex-nowrap gap-6 rounded-none">
            {/* <div className="flex justify-between items-center self-stretch">
              <BreadcrumbComponent route="creators" />
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
            </div> */}

            <TitleWithoutFilters title="Seus Creators" />
          </div>
        </div>
      </div>

      <div className="w-full h-full xl:pl-[114px] relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-6 xl:pr-8 p-0 px-[15px]">
        {creatorsIds.map((id: string) => {
          const posts = creators[id].posts;
          const mediumEngagement = creators[id].mediumEngagement;

          const postsQuantity = posts.length;
          const name =
            posts[0].socialNetwork.creator?.name ??
            posts[0].socialNetwork.username;
          const creator = posts[0].socialNetwork.creator!;

          return (
            <CreatorCard
              key={id}
              creator={creator}
              name={name}
              posts={postsQuantity}
              mediumEngagement={mediumEngagement}
            />
          );
        })}
      </div>
    </div>
  );
}
