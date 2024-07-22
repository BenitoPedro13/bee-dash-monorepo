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
import { parseUpdatedAt, total } from "../../../utils/utils";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import WelcomeTitle from "@/components/WelcomeTitle";
import TotalCreatorsIcon from "@/components/MetricsIcons/TotalCreatorsIcon";
import TotalPostsIcon from "@/components/MetricsIcons/TotalPostsIcon";
import TotalFeedIcon from "@/components/MetricsIcons/TotalFeedIcon";
import TotalStoriesIcon from "@/components/MetricsIcons/TotalStoriesIcon";
import Header from "@/components/Header";
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
    const { "juicy-admin-token": access_token } = parseCookies();
    fetchData(access_token);
    fetchAttachment(access_token);
  }, [fetchData, fetchAttachment]);

  const totalInfluencers = (data: Influencer[]) => `${data.length}`;
  const totalCount = (data: Influencer[], dataKey: keyof Influencer) => {
    let count = 0;

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      count += Number.parseInt(
        (element[`${dataKey}`] as string).replaceAll(".", "")
      );
    }

    return count;
  };

  const totalPercentage = (data: Influencer[], dataKey: keyof Influencer) => {
    let count = 0;

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      count += Number.parseFloat(
        (element[`${dataKey}`] as string)
          .replaceAll(",", ".")
          .replaceAll("%", "")
      );
    }

    const formattedCount = new Intl.NumberFormat("pt-BR").format(
      +(count / +totalInfluencers(data)).toFixed(2)
    ); // Divide by number of influencers

    return `${formattedCount}%`;
  };
  const totalCPE = (data: Influencer[], dataKey: keyof Influencer) => {
    let count = 0;

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      count += Number.parseFloat(
        (element[`${dataKey}`] as string)
          .replaceAll("R$", "")
          .replaceAll(",", ".")
      );
    }

    const formattedCount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(+(count / +totalInfluencers(data)).toFixed(2));

    return formattedCount;
  };

  const costPerMetric = (
    data: Influencer[],
    dataKey: keyof Influencer,
    cost: number
  ) => {
    let count = 0;

    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      count += Number.parseInt(
        (element[`${dataKey}`] as string).replaceAll(".", "")
      );
    }

    return (cost / count).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <>
      <Header />
      <main>
        <SidenavDesktop />
        <div className="w-full h-full flex xl:flex-row flex-col justify-start items-start bg-white overflow-hidden p-0 xl:pl-[82px] content-start flex-nowrap gap-0 rounded-none">
          <div className="box-border flex-shrink-0 xl:w-[calc(100%-379px)] w-full h-min flex flex-col justify-start items-center xl:pt-8 xl:pb-12 py-[15px] overflow-visible content-center flex-nowrap xl:gap-[28px] gap-[15px] rounded-none">
            <div className="box-border flex-shrink-0 w-full xl:h-auto h-min flex flex-col justify-center items-start xl:px-8 px-[15px] overflow-visible relative content-start flex-nowrap gap-3 rounded-none">
              <Breadcrumb />
              <WelcomeTitle />
            </div>
            <div className="box-border flex-shrink-0 w-full xl:h-[97px] h-min flex flex-col xl:justify-center justify-start items-start xl:px-[22px] px-[15px] overflow-visible relative content-start flex-nowrap xl:gap-[22px] gap-6 rounded-none">
              <div className="flex-shrink-0 w-full xl:h-auto h-min xl:flex grid xl:justify-start xl:items-center grid-cols-metric auto-rows-fr grid-rows-2 p-0 overflow-visible relative content-center flex-nowrap xl:gap-5 gap-[10px] rounded-none">
                <Metrics
                  heading="Total Creators"
                  metric={totalInfluencers(data)}
                >
                  <TotalCreatorsIcon />
                </Metrics>
                <Metrics
                  heading="Total Publicações"
                  metric={total(data, "Posts")}
                >
                  <TotalPostsIcon />
                </Metrics>
                <Metrics
                  heading="Total Feed"
                  metric={total(data, ["Feed", "Tiktok"])}
                >
                  <TotalFeedIcon />
                </Metrics>
                <Metrics
                  heading="Total Stories"
                  metric={total(data, "Stories")}
                >
                  <TotalStoriesIcon />
                </Metrics>
              </div>
            </div>
            <div className="w-full flex-shrink-0 h-min flex flex-col justify-start items-start overflow-visible relative xl:px-[22px] p-0 content-start flex-nowrap gap-6 rounded-none">
              <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-start xl:p-0 px-[15px] overflow-visible relative content-start flex-nowrap xl:gap-[22px] gap-6 rounded-none">
                <div className="flex-shrink-0 flex-grow xl:flex-grow-0 w-full h-min flex xl:flex-row flex-col justify-start items-center overflow-visible relative p-0 content-center flex-nowrap xl:gap-5 gap-[15px] rounded-none">
                  <CostPerMetric
                    sigla="CPE"
                    heading="Engajamento"
                    metric={totalPercentage(data, "Engajamento")}
                    costPerMetric={totalCPE(data, "CPE")}
                  />
                  <CostPerMetric
                    sigla="CPV"
                    heading="Views"
                    metric={total(data, "Video Views")}
                    costPerMetric={costPerMetric(
                      data,
                      "Video Views",
                      totalCount(data, "Investimento")
                    )}
                  />
                  <CostPerMetric
                    sigla="CPC"
                    heading="Cliques"
                    metric={total(data, "Cliques")}
                    costPerMetric={costPerMetric(
                      data,
                      "Cliques",
                      totalCount(data, "Investimento")
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex-shrink-0 h-min flex flex-col justify-start items-start overflow-visible relative xl:px-[22px] px-[15px] content-start flex-nowrap xl:gap-0 gap-6 rounded-none">
              <MetricsLineGraph
                // heading="Interações + Views"
                // metric={
                //   total(data, ["Interacoes", "Video Views"])
                // }
                data={data}
              />
            </div>
            <div className="w-full flex-shrink-0 h-min flex flex-col justify-start items-start overflow-visible relative xl:px-[22px] p-0 content-start flex-nowrap gap-6 rounded-none">
              <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-start xl:p-0 px-[15px] overflow-visible relative content-start flex-nowrap xl:gap-[22px] gap-6 rounded-none">
                <div className="flex-shrink-0 w-full h-min flex xl:flex-row flex-col justify-start items-center overflow-visible relative p-0 content-center flex-nowrap xl:gap-5 gap-[15px] rounded-none">
                  <Metrics
                    heading="Engajamento Tik Tok"
                    metric={totalPercentage(data, "Engajamento Tiktok")}
                  />
                  <Metrics
                    heading="Cliques no Link Tik Tok"
                    metric={total(data, "Cliques Tiktok")}
                  />
                  <Metrics
                    heading="Impressoes Tik Tok"
                    metric={total(data, "Impressoes Tiktok")}
                  />
                </div>
              </div>
            </div>
            <div className="w-full flex-shrink-0 h-min flex flex-col justify-start items-start overflow-visible relative xl:px-[22px] px-[15px] content-start flex-nowrap gap-6 rounded-none">
              <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative content-start flex-nowrap gap-6 rounded-none">
                <CreatorsTable />
              </div>
            </div>
            <div className="w-full flex-shrink-0 h-min flex flex-col justify-start items-start overflow-visible relative xl:px-[22px] px-[15px] content-start flex-nowrap gap-6 rounded-none">
              <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative content-start flex-nowrap gap-6 rounded-none">
                <AttachmentsTable />
              </div>
            </div>
            <div className="xl:hidden box-border flex-shrink-0 xl:w-[379px] w-full flex-grow h-min flex flex-col justify-start items-center xl:pt-8 xl:pr-8 pb-10 px-[15px] bg-transparent overflow-visible content-center flex-nowrap xl:gap-[28px] gap-[15px] rounded-none z-10">
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
            </div>
            <Footer />
          </div>
          <div className="hidden box-border flex-shrink-0 xl:w-[379px] w-auto flex-grow h-min xl:flex flex-col justify-start items-center pt-8 pr-8 pb-12 bg-transparent overflow-visible content-center flex-nowrap gap-[28px] rounded-none z-10">
            <div className="flex-shrink-0 w-full h-[68px] mb-[48px] flex justify-end items-center overflow-visible relative p-0 content-center flex-nowrap gap-3 rounded-none">
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
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-[38px] h-[38px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg> */}
                  <img
                    src="/juicy-artwork-limo.svg"
                    alt="Default Juicy Avatar"
                    className="absolute right-[3px]"
                  />
                </div>
              ) : (
                <img
                  src={`${baseApiUrl}${session.user.urlProfilePicture}`}
                  width="67"
                  height="67"
                  alt={`${session.user.name} Logo`}
                  className="btn btn-circle btn-outline border-black border-[1px] border-solid"
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
          </div>
        </div>
      </main>
    </>
  );
}
