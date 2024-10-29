/* eslint-disable @next/next/no-img-element */
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
// import { Inter } from 'next/font/google'
import { Plus_Jakarta_Sans } from "next/font/google";
import { motion } from "framer-motion";
import Badge from "./Badge";
// import { Tabs } from "@radix-ui/react-tabs";
import useDataStore, { DashboardMode, DashbordDateRange } from "@/store";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

// const inter = Inter({ subsets: ['latin'] })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

type CostPerMetricProps = {
  children?: React.ReactNode;
  classname: string;
  heading: string[];
  sigla?: string[];
  metric?: string[];
  variation: Record<
    DashbordDateRange,
    { total: number | string; variation: number | null }
  >[];
};

const CostPerMetric = ({
  children,
  heading,
  sigla,
  metric,
  variation,
  classname,
}: CostPerMetricProps) => {
  const dateRange = useDataStore((store) => store.dateRange);

  const [siglaActive, setSiglaActive] = useState<0 | 1>(0);
  const { variation: variationValue, total } =
    variation[siglaActive][dateRange];

  // console.log(variation);

  const hasOptions = sigla && sigla?.length > 1;

  return (
    <div
      className={
        "box-border w-full sm:min-w-[200px] h-min flex flex-col items-start p-4 py-5 bg-white overflow-visible content-center flex-nowrap gap-2 border-[#D4D4D4] border " +
        classname
      }
      // initial={false}
      // whileHover={{ boxShadow: "2px 2px 0px 0px #898989" }}
      // animate={{ boxShadow: "2px 2px 2px 0px rgba(16, 24, 40, 0.06)" }}
      // transition={{ duration: 0.3, ease: "linear" }}
    >
      {/* <div className="flex items-center justify-between self-stretch">
        <p className="text-sm font-nexa font-medium text-[#475467]">
          {heading[siglaActive]}
        </p>

        <Tabs
          defaultValue="0"
          onValueChange={(value) => setSiglaActive(+value as 0 | 1)}
          className="flex p-[5px] items-center rounded-lg border border-[#E2E8F0] h-[42px]"
          style={{
            visibility: hasOptions ? "visible" : "hidden",
          }}
        >
          <TabsList>
            <TabsTrigger value="0" className="text-black">
              {sigla ? sigla[0] : ""}
            </TabsTrigger>
            <TabsTrigger value="1">{sigla ? sigla[1] : ""}</TabsTrigger>
            {sigla?.length === 3 ? (
              <TabsTrigger value="2">{sigla ? sigla[2] : ""}</TabsTrigger>
            ) : null}
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col items-start justify-center gap-[2px]">
        <p className="flex-shrink-0 w-auto h-auto whitespace-pre relative font-bold font-nexa-bold text-[#101828] text-3xl leading-[38px]">
          {heading[siglaActive].includes("Investimento ")
            ? new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(
                +Number.parseFloat(
                  (total as string).replaceAll(".", "").replaceAll(",", ".")
                ).toFixed(2)
              )
            : total}
        </p>
        {typeof variationValue === "number" && (
          <div>
            <Badge number={variationValue} />
          </div>
        )}
      </div> */}
      <div className="flex justify-between items-center self-stretch">
        <div className="flex w-9 h-9 flex-col items-center justify-center gap-3 rounded-full bg-[#EEEDEC]">
          {children}
        </div>

        {typeof variationValue === "number" && (
          <div>
            <Badge number={variationValue} />
          </div>
        )}
      </div>
      <div className="flex justify-between items-center self-stretch">
        <div className="flex flex-col items-start">
          <p className="flex-shrink-0 w-auto h-auto whitespace-pre relative font-bold font-nexa-bold text-[#101828] text-3xl leading-[38px]">
            {heading[siglaActive].includes("Investimento ")
              ? new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(
                  +Number.parseFloat(
                    (total as string).replaceAll(".", "").replaceAll(",", ".")
                  ).toFixed(2)
                )
              : total}
          </p>
          <p className="text-sm font-nexa font-medium text-[#475467]">
            {heading[siglaActive]}
          </p>
        </div>
        <Tabs
          defaultValue="0"
          onValueChange={(value) => setSiglaActive(+value as 0 | 1)}
          className="flex p-[5px] items-center border border-[#E2E8F0] h-[42px] rounded-full"
          style={{
            visibility: hasOptions ? "visible" : "hidden",
          }}
        >
          <TabsList>
            <TabsTrigger value="0" className="rounded-full">
              {sigla ? sigla[0] : ""}
            </TabsTrigger>
            <TabsTrigger value="1" className="rounded-full">
              {sigla ? sigla[1] : ""}
            </TabsTrigger>
            {sigla?.length === 3 ? (
              <TabsTrigger value="2" className="rounded-full">
                {sigla ? sigla[2] : ""}
              </TabsTrigger>
            ) : null}
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
};

export default CostPerMetric;
