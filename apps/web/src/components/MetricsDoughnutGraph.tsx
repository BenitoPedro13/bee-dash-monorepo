"use client";

import React, { useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import DoughnutGraph from "./DoughnutGraph";
import { motion } from "framer-motion";
import Badge from "./Badge";
import useDataStore, {
  DashboardMode,
  DashbordDateRange,
  Influencer,
} from "@/store";
import { calculateVariations, total, totalCount } from "../../utils/utils";
import Investment from "./MetricsIcons/Investment";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

type MetricsDoughnutGraphProps = {
  heading: string;
  metric: string;
  mobile?: boolean;
};

const MetricsDoughnutGraph = ({
  heading,
  metric,
  mobile,
}: MetricsDoughnutGraphProps) => {
  const { data } = useDataStore((state) => state.data);

  const mode = useDataStore((store) => store.mode);

  const [metricValue, setMetricValue] = useState<string>(metric);

  const graphTypes: Record<
    DashboardMode,
    Record<
      "Impacto",
      {
        computeMetric: (data: Influencer[]) => string;
      }
    >
  > = {
    tiktok: {
      Impacto: {
        computeMetric: (data: Influencer[]) =>
          total(data, "Impacto Bruto Tiktok"),
      },
    },
    instagram: {
      Impacto: {
        computeMetric: (data: Influencer[]) => total(data, "Impacto Bruto"),
      },
    },
    all: {
      Impacto: {
        computeMetric: (data: Influencer[]) =>
          total(data, ["Impacto Bruto", "Impacto Bruto Tiktok"]),
      },
    },
  };

  useEffect(() => {
    const { computeMetric } = graphTypes[mode]["Impacto"];

    setMetricValue(computeMetric(data));
  }, [data, mode]);

  return (
    <div
      className={`box-border lg:w-[360px] w-full max-h-[428px] h-full lg:flex ${
        mobile ? "lg:hidden" : "hidden"
      } flex-col justify-start items-start shadow-metrics   bg-white overflow-hidden p-0 content-start flex-nowrap gap-0 rounded-xl border-[#D4D4D4] border`}
    >
      <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-center p-5 overflow-visible relative content-start flex-nowrap gap-5 rounded-none">
        <div className="flex-shrink-0 w-full h-min flex flex-col justify-center items-center overflow-visible relative p-0 content-center flex-nowrap gap-3 rounded-none">
          <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-5 rounded-none">
            <div className="flex-shrink-0 w-full h-10 flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-4 rounded-none">
              <div className="flex-shrink-0 flex-grow w-auto h-full flex flex-row justify-start items-center overflow-visible relative p-0 content-start flex-nowrap gap-2 rounded-none">
                <div className="flex w-9 h-9 flex-col items-center justify-center gap-3 rounded-full bg-[#EEEDEC]">
                  <Investment />
                </div>
                <p
                  className={` w-full h-auto whitespace-pre-wrap break-words relative font-bold font-nexa text-[#475467] text-sm`}
                >
                  {heading}
                </p>
              </div>
              <div className="bg-transparent box-border flex-shrink-0 w-min h-min flex justify-start items-start overflow-hidden relative p-0 content-start flex-nowrap gap-0">
                <div
                  className={`cursor-not-allowed opacity-40 box-border flex-shrink-0 w-min h-min flex justify-center items-center bg-white overflow-visible relative content-center flex-nowrap gap-2 rounded-none`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 self-stretch">
            <p className="flex-shrink-0 w-auto h-auto whitespace-pre relative font-bold font-nexa-bold text-[#101828] text-3xl leading-[38px]">
              {metricValue}
            </p>
            {/* {typeof metricVariation === "number" && (
              <div>
                <Badge number={metricVariation} />
              </div>
            )} */}
          </div>
        </div>
        <DoughnutGraph />
      </div>
    </div>
  );
};

export default MetricsDoughnutGraph;
