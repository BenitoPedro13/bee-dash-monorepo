/* eslint-disable @next/next/no-img-element */
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
// import { Inter } from 'next/font/google'
import { Plus_Jakarta_Sans } from "next/font/google";
import { motion } from "framer-motion";
import Badge from "./Badge";
// import { Tabs } from "@radix-ui/react-tabs";
import useDataStore, { DashboardMode } from "@/store";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

// const inter = Inter({ subsets: ['latin'] })
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

type CostPerMetricProps = {
  heading: string;
  sigla?: string[];
  metric: string;
  costPerMetric?: string;
  variation?: number;
};

const CostPerMetric = ({
  heading,
  sigla,
  metric,
  costPerMetric,
  variation,
}: CostPerMetricProps) => {
  // const setMode = useDataStore((state) => state.setMode);
  const [siglaActive, setSiglaActive] = useState(sigla?.at(0) ?? "");

  return (
    <div
      className="box-border w-full sm:min-w-[200px] h-min flex flex-col items-start p-4 py-5 bg-white overflow-visible content-center flex-nowrap gap-2 rounded-xl border-[#D4D4D4] border"
      // initial={false}
      // whileHover={{ boxShadow: "2px 2px 0px 0px #898989" }}
      // animate={{ boxShadow: "2px 2px 2px 0px rgba(16, 24, 40, 0.06)" }}
      // transition={{ duration: 0.3, ease: "linear" }}
    >
      <div className="flex items-center justify-between self-stretch">
        <p className="text-sm font-nexa font-medium text-[#475467]">
          {heading}
        </p>

        <Tabs
          defaultValue={sigla ? sigla[0] : ""}
          onValueChange={(value) => setSiglaActive(value)}
          className="flex p-[5px] items-center rounded-lg border border-[#E2E8F0] h-[42px]"
          style={{
            visibility: sigla && costPerMetric ? "visible" : "hidden",
          }}
        >
          <TabsList>
            <TabsTrigger value={sigla ? sigla[0] : ""} className="text-black">
              {sigla ? sigla[0] : ""}
            </TabsTrigger>
            <TabsTrigger value={sigla ? sigla[1] : ""}>
              {sigla ? sigla[1] : ""}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col items-start justify-center gap-[2px]">
        <p className="flex-shrink-0 w-auto h-auto whitespace-pre relative font-bold font-nexa-bold text-[#101828] text-3xl leading-[38px]">
          {sigla && costPerMetric
            ? siglaActive === sigla?.at(0)
              ? metric
              : costPerMetric
            : metric}
        </p>
        {typeof variation === "number" ? (
          <Badge number={variation} />
        ) : (
          <Badge number={10} className=" invisible" />
        )}
      </div>
    </div>
  );
};

export default CostPerMetric;
