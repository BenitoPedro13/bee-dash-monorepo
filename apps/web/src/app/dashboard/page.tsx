/* eslint-disable @next/next/no-img-element */
"use client";

import metricsIcon from "@/../public/metricsIcon.png";
import buserLogo from "@/../public/buser-logo.webp";
import Link from "next/link";
import Image from "next/image";
import { parseCookies } from "nookies";

import Metrics from "@/components/Metrics";

import { Inter } from "next/font/google";
import CostPerMetric from "@/components/CostPerMetric";
import MetricsLineGraph from "@/components/MetricsLineGraph";
import SidenavDesktop from "@/components/SidenavDesktop";
import MetricsDoughnutGraph from "@/components/MetricsDoughnutGraph";
import CreatorsTable from "@/components/CreatorsTable/CreatorsTable";
import useDataStore, { Influencer, baseApiUrl } from "@/store";
import { useEffect } from "react";
import Footer from "@/components/Footer";
import FinancialMetrics from "@/components/FinancialMetrics/FinancialMetrics";
import ContactCTA from "@/components/CTA/ContactCTA";
import AttachmentsTable from "@/components/AttachmentsTable/AttachmentsTable";
import {
  costPerMetric,
  parseUpdatedAt,
  total,
  totalCount,
  totalCPE,
  totalPercentage,
} from "../../../utils/utils";
import { useRouter } from "next/navigation";
import BreadcrumbComponent from "@/components/Breadcrumb";
import WelcomeTitle from "@/components/WelcomeTitle";
import TotalCreatorsIcon from "@/components/MetricsIcons/TotalCreatorsIcon";
import TotalPostsIcon from "@/components/MetricsIcons/TotalPostsIcon";
import TotalFeedIcon from "@/components/MetricsIcons/TotalFeedIcon";
import TotalStoriesIcon from "@/components/MetricsIcons/TotalStoriesIcon";
import Header from "@/components/Header";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import FirstSection from "@/components/FirstSection";
import SecondSection from "@/components/SecondSection";
import { Component } from "@/components/PieChartDonut";
import MetricsBarStackGraph from "@/components/MetricsBarStackGraph";
// import { Plus_Jakarta_Sans } from 'next/font/google'

const inter = Inter({ subsets: ["latin"] });
// const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

export default function Home() {
  const session = useDataStore((state) => state.session);
  const fetchData = useDataStore((state) => state.fetchData);
  const fetchAttachment = useDataStore((state) => state.fetchAttachment);
  const { data, updatedAt } = useDataStore((state) => state.data);
  const router = useRouter();

  useEffect(() => {
    if (!session.isAuthenticated) {
      router.push("/");
    }
  }, [router, session.isAuthenticated]);

  useEffect(() => {
    const { "bee-dash-token": access_token } = parseCookies();
    fetchData(access_token);
    fetchAttachment(access_token);
  }, [fetchData, fetchAttachment]);

  return (
    <>
      <Header />
      <main>
        <SidenavDesktop />
        <div className="w-full h-full flex xl:flex-row flex-col justify-start items-start bg-white overflow-hidden p-0 xl:pl-[82px] content-start flex-nowrap gap-0 rounded-none">
          <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-center xl:pt-8 xl:pb-12 py-[15px] overflow-visible content-center flex-nowrap xl:gap-6 gap-[15px] rounded-none">
            <div className="box-border flex-shrink-0 w-full xl:h-auto h-min flex flex-col justify-center items-start xl:px-8 px-[15px] overflow-visible relative content-start flex-nowrap gap-6 rounded-none">
              <div className="flex justify-between items-center self-stretch">
                <BreadcrumbComponent />
                <div className="w-fit flex items-start gap-4">
                  <div className="w-fit flex flex-col items-start gap-[6px]">
                    <div className="w-full min-w-[384px] flex items-center gap-2">
                      <div className="w-full flex flex-col items-start gap-[6px] flex-grow flex-shrink-0">
                        <div className="w-full flex py-2 pr-14 pl-3 items-center gap-1 self-stretch rounded-lg border border-[#E2E8F0]">
                          <SearchIcon className="w-5 h-5 text-[#64748B]" />
                          <input
                            placeholder="Procure por creators..."
                            className="w-full outline-none text-sm leading-6 font-nexa bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
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
              <WelcomeTitle />
            </div>
            <FirstSection />
            <SecondSection />
            <div className="w-full flex-shrink-0 h-min flex justify-start items-start overflow-visible relative xl:px-[22px] px-[15px] content-start flex-nowrap xl:gap-6 gap-6 rounded-none">
              <MetricsLineGraph data={data} />

              <MetricsDoughnutGraph
                heading="Impacto Bruto"
                metric={total(data, ["Interacoes", "Impressoes"])}
              />
              {/* <Component /> */}
            </div>

            <div className="w-full flex-shrink-0 h-min flex flex-col justify-start items-start overflow-visible relative xl:px-[22px] px-[15px] content-start flex-nowrap gap-6 rounded-none">
              <div className="box-border flex-shrink-0 w-full h-min flex justify-start items-start overflow-visible relative content-start flex-nowrap gap-6 rounded-none">
                <CreatorsTable />
                <MetricsBarStackGraph heading="Audiência" metric="2438" />
              </div>
            </div>
            <div className="w-full flex-shrink-0 h-min flex flex-col justify-start items-start overflow-visible relative xl:px-[22px] px-[15px] content-start flex-nowrap gap-6 rounded-none">
              <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative content-start flex-nowrap gap-6 rounded-none">
                <AttachmentsTable />
              </div>
            </div>
            {/* <div className="xl:hidden box-border flex-shrink-0 xl:w-[379px] w-full flex-grow h-min flex flex-col justify-start items-center xl:pt-8 xl:pr-8 pb-10 px-[15px] bg-transparent overflow-visible content-center flex-nowrap xl:gap-[28px] gap-[15px] rounded-none z-10">
              <MetricsDoughnutGraph
                heading="Impressoes"
                metric={total(data, "Impressoes")}
              />
              <Metrics
                heading="Investimento Total Inicial"
                metric={(
                  session.user.totalInitialInvestment ?? 0
                )?.toLocaleString("pt-BR", {
                  currency: "BRL",
                  style: "currency",
                })}
              />
              <Metrics
                heading="Investimento Executado Estimado"
                metric={total(data, "Investimento", true)}
              />
              <FinancialMetrics />
              <ContactCTA />
            </div> */}
            {/* <Footer /> */}
          </div>
          {/* <div className="hidden box-border flex-shrink-0 xl:w-[379px] w-auto flex-grow h-min xl:flex flex-col justify-start items-center pt-8 pr-8 pb-12 bg-transparent overflow-visible content-center flex-nowrap gap-[28px] rounded-none z-10">
            <div className="flex-shrink-0 w-full h-fit mb-[48px] flex justify-end items-center overflow-visible relative p-0 content-center flex-nowrap gap-3 rounded-none">
              <div className="flex-shrink-0 w-min h-min flex justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-3 rounded-none">
                <div className="flex-shrink-0 w-[338px] h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-2 rounded-none">
                  <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-[6px] rounded-none">
                    <div className="box-border flex-shrink-0 w-full h-min flex justify-start items-center py-[10px] px-[14px] shadow-cost-per-metrics bg-white overflow-hidden relative content-center flex-nowrap gap-2 rounded-lg border border-black">
                      <div className="flex-shrink-0 flex-grow w-auto h-min flex justify-start items-center overflow-visible releative p-0 content-center flex-nowrap gap-2 rounded-none">
                        <div className="flex-shrink-0 w-5 h-5 block overflow-hidden relative aspect-square rounded-none"></div>
                        <p
                          className={`flex-shrink-0 w-auto h-auto whitespace-pre relative ${inter.className} text-[#101828] text-base text-center`}
                        >
                          Atualizado em {parseUpdatedAt(updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                  width="57"
                  height="57"
                  alt={`${session.user.name} Logo`}
                  className="border-black border-[1px] border-solid rounded-full"
                />
              )}
            </div>
            
            <Metrics
              heading="Investimento Total Inicial"
              metric={(
                session.user.totalInitialInvestment ?? 0
              )?.toLocaleString("pt-BR", {
                currency: "BRL",
                style: "currency",
              })}
            />
            <Metrics
              heading="Investimento Executado Estimado"
              metric={total(data, "Investimento", true)}
            />
            <MetricsDoughnutGraph
              heading="Impressoes"
              metric={total(data, "Impressoes")}
            />
            <FinancialMetrics />
            <ContactCTA />
          </div> */}
        </div>
      </main>
    </>
  );
}
