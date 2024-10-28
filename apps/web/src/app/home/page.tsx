/* eslint-disable @next/next/no-img-element */
"use client";

import { Inter } from "next/font/google";

import useDataStore, { Influencer, PostsPack, baseApiUrl } from "@/store";

import BreadcrumbComponent from "@/components/Breadcrumb";
import WelcomeTitle from "@/components/WelcomeTitle";
import TitleWithoutFilters from "@/components/TitleWithoutFilters";
import CampaingCard from "@/components/CampaignCard";
import CreatorCard from "@/components/CreatorsCard";
import FirstSectionHome from "@/components/FirstSectionHome";
import SecondSectionHome from "@/components/SecondSectionHome";
import React from "react";
// import { Plus_Jakarta_Sans } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] });
// const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export default function Home() {
  const session = useDataStore((state) => state.session);
  const campaigns = session.user.campaigns;
  const creators = session.user.creators;
  const postsData = useDataStore((state) => state.postsData);
  const { data } = useDataStore((state) => state.data);

  return (
    <>
      <div className="w-full h-full flex xl:flex-row flex-col justify-start items-start z-20 p-0 xl:pl-[82px] content-start flex-nowrap gap-0 rounded-none relative">
        <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-center xl:pt-8 xl:pb-8 py-[15px] overflow-visible content-center flex-nowrap xl:gap-6 gap-[15px] rounded-none">
          <div className="box-border flex-shrink-0 w-full xl:h-auto h-min flex flex-col justify-center items-start xl:px-8 px-[15px] overflow-visible relative content-start flex-nowrap gap-6 rounded-none">
            {/* <div className="flex justify-between items-center self-stretch">
              <BreadcrumbComponent route={"home"} />
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
            <WelcomeTitle showFilters={false} />
          </div>
          <div className="box-border flex-shrink-0 w-full h-min flex flex-col xl:justify-center justify-start items-start xl:px-8 px-[15px] overflow-visible relative content-start flex-nowrap xl:gap-[22px] gap-6 rounded-none">
            <FirstSectionHome />
          </div>
          <div className="w-full flex-shrink-0 h-min flex flex-col justify-start items-start overflow-visible relative xl:px-8 p-0 content-start flex-nowrap gap-6 rounded-none pb-4">
            <SecondSectionHome />
          </div>

          <div className="w-full xl:px-8 px-[15px]">
            <TitleWithoutFilters title="Top 3 Campanhas" />
          </div>
          <div className="w-full h-full xl:px-8 px-[15px] relative z-20 grid grid-cols-1 sm:grid-cols-2 pb-4 lg:grid-cols-3 gap-4 xl:pr-8 p-0">
            {campaigns
              .sort((a, b) => {
                return b.mediumEngagement - a.mediumEngagement;
              })
              .slice(0, 3)
              .map((item) => {
                const postsQuantity = item.postsPack.reduce(
                  (acc: number, postPack: PostsPack) => {
                    return acc + postPack.posts.length;
                  },
                  0
                );

                return (
                  <CampaingCard
                    key={item.id}
                    campaign={item}
                    name={item.name}
                    posts={postsQuantity}
                  />
                );
              })}
          </div>

          <div className="w-full xl:px-8 px-[15px]">
            <TitleWithoutFilters title="Top 3 Creators" />
          </div>
          <div className="w-full h-full xl:px-8 px-[15px] relative z-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 xl:pr-8 p-0">
            {Object.entries(creators)
              .sort(([, creatorA], [, creatorB]) => {
                return creatorB.mediumEngagement - creatorA.mediumEngagement;
              })
              .slice(0, 3)
              .map(([creatorId, creator]) => {
                const postsQuantity = creator.posts.length;
                const name =
                  creator.posts[0].socialNetwork.creator?.name ??
                  creator.posts[0].socialNetwork.username;
                const creatorObj = creator.posts[0].socialNetwork.creator!;

                return (
                  <CreatorCard
                    key={creatorId}
                    creator={creatorObj}
                    name={name}
                    posts={postsQuantity}
                    mediumEngagement={creator.mediumEngagement}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}
