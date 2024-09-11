"use client";

import React, { useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import useDataStore, {
  DashboardMode,
  DashbordDateRange,
  Influencer,
  Posts,
} from "@/store";
import {
  calculatePostsPropertiesVariationsBySocialNetworksType,
  calculateVariations,
  countPostsPropertiesBySocialNetworksType,
  total,
} from "../../utils/utils";
import BarGraph from "./BarGraph";
import Badge from "./Badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import PostsBarGraph from "./PostsBarGraph";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

type MetricsGraphProps = {
  data: Posts[];
};

export type GraphTypes = "Impressoes" | "Interacoes";

const PostsMetricsGraph = ({ data }: MetricsGraphProps) => {
  const mode = useDataStore((store) => store.mode);
  const dateRange = useDataStore((store) => store.dateRange);
  const [heading, setHeading] = useState<string>("Impressões (Views)");
  const [metric, setMetric] = useState<string>(
    `${countPostsPropertiesBySocialNetworksType(
      data,
      ["impressions"],
      ["TIKTOK"]
    )}`
  );
  const [metricVariation, setMetricVariation] = useState<number | null>(null);
  const [typeOfGraph, setTypeOfGraph] = useState<GraphTypes>("Impressoes");

  const windowIsUndefined = typeof window === "undefined";

  const graphTypes: Record<
    DashboardMode,
    Record<
      "Interacoes" | "Impressoes",
      {
        heading: string;
        computeMetric: (
          data: Posts[]
        ) => Record<
          DashbordDateRange,
          { total: string; variation: number | null }
        >;
      }
    >
  > = {
    tiktok: {
      Interacoes: {
        heading: "Interações",
        computeMetric: (data: Posts[]) =>
          calculatePostsPropertiesVariationsBySocialNetworksType(
            data,
            ["interactions"],
            ["TIKTOK"]
          ),
      },
      Impressoes: {
        heading: "Impressões (Views)",
        computeMetric: (data: Posts[]) =>
          calculatePostsPropertiesVariationsBySocialNetworksType(
            data,
            ["impressions"],
            ["TIKTOK"]
          ),
      },
    },
    instagram: {
      Interacoes: {
        heading: "Interações",
        computeMetric: (data: Posts[]) =>
          calculatePostsPropertiesVariationsBySocialNetworksType(
            data,
            ["interactions"],
            ["INSTAGRAM"]
          ),
      },
      Impressoes: {
        heading: "Impressões (Views)",
        computeMetric: (data: Posts[]) =>
          calculatePostsPropertiesVariationsBySocialNetworksType(
            data,
            ["impressions"],
            ["INSTAGRAM"]
          ),
      },
    },
    all: {
      Interacoes: {
        heading: "Interações",
        computeMetric: (data: Posts[]) =>
          calculatePostsPropertiesVariationsBySocialNetworksType(
            data,
            ["interactions"],
            ["INSTAGRAM", "TIKTOK"]
          ),
      },
      Impressoes: {
        heading: "Impressões (Views)",
        computeMetric: (data: Posts[]) =>
          calculatePostsPropertiesVariationsBySocialNetworksType(
            data,
            ["impressions"],
            ["INSTAGRAM", "TIKTOK"]
          ),
      },
    },
  };

  useEffect(() => {
    if (typeOfGraph in graphTypes[mode]) {
      const { heading, computeMetric } = graphTypes[mode][typeOfGraph];

      setHeading(heading);
      setMetric(computeMetric(data)[dateRange].total);
      setMetricVariation(computeMetric(data)[dateRange].variation);

      if (
        !windowIsUndefined &&
        window.innerWidth < 425 &&
        heading === "Impressões (Views)"
      ) {
        setHeading("Impressões");
      }
    }
  }, [typeOfGraph, data, mode, dateRange]);

  return (
    <div
      className="box-border lg:w-[calc(100%)] w-full h-min flex flex-col justify-start items-start shadow-metrics   bg-white xl:overflow-hidden overflow-visible p-0 content-start flex-nowrap xl:gap-0 gap-5 rounded-xl border-[#D4D4D4] border"
      // initial={false}
      // whileHover={{ boxShadow: "2px 2px 0px 0px #898989" }}
      // animate={{ boxShadow: "2px 2px 2px 0px rgba(16, 24, 40, 0.06)" }}
      // transition={{ duration: 0.3, ease: "linear" }}
    >
      <div className="box-border w-full h-min flex flex-col justify-start items-start p-5 overflow-visible relative content-start flex-nowrap gap-2 rounded-none">
        <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-2 rounded-none">
          <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-5 rounded-none">
            <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-4 rounded-none">
              <div className="flex-shrink-0 flex-grow w-auto h-full flex flex-col justify-center items-start overflow-visible relative p-0 content-start flex-nowrap gap-1 rounded-none">
                <p
                  className={`flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-medium font-nexa text-[#475467] text-sm`}
                >
                  {heading}
                </p>
              </div>
              <Tabs
                defaultValue={typeOfGraph}
                onValueChange={(value) => setTypeOfGraph(value as GraphTypes)}
                className="flex p-[5px] items-center rounded-lg border border-[#E2E8F0] h-[42px]"
              >
                <TabsList>
                  <TabsTrigger value={"Impressoes"} className="text-black">
                    Impressões
                  </TabsTrigger>
                  <TabsTrigger value={"Interacoes"}>Interações</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex items-center gap-4 self-stretch">
            <p className="flex-shrink-0 w-auto h-auto whitespace-pre relative font-bold font-nexa-bold text-[#101828] text-3xl leading-[38px]">
              {metric}
            </p>
            {typeof metricVariation === "number" && (
              <div>
                <Badge number={metricVariation} />
              </div>
            )}
          </div>
        </div>

        <PostsBarGraph typeOfGraph={typeOfGraph} data={data} />
      </div>
    </div>
  );
};

export default PostsMetricsGraph;
