import React, { useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import { motion } from "framer-motion";
import { Influencer } from "@/store";
import { total } from "../../utils/utils";
import BarGraph from "./BarGraph";
import Badge from "./Badge";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

type MetricsGraphProps = {
  data: Influencer[];
};

export type GraphTypes = "Impressoes" | "Interacoes";

const MetricsGraph = ({ data }: MetricsGraphProps) => {
  const [heading, setHeading] = useState<string>("Impressões (Views)");
  const [metric, setMetric] = useState<string>(total(data, "Impressoes"));
  const [typeOfGraph, setTypeOfGraph] = useState<GraphTypes>("Impressoes");

  useEffect(() => {
    const graphTypes = {
      Interacoes: {
        heading: "Interações",
        computeMetric: (data: Influencer[]) => total(data, ["Interacoes"]),
      },
      Impressoes: {
        heading: "Impressões (Views)",
        computeMetric: (data: Influencer[]) => total(data, ["Impressoes"]),
      },
      // Total: {
      //   heading: "Interações + Views",
      //   computeMetric: (data: Influencer[]) =>
      //     total(data, ["Interacoes", "Video Views"]),
      // },
    };

    if (typeOfGraph in graphTypes) {
      const { heading, computeMetric } = graphTypes[typeOfGraph];
      setHeading(heading);
      setMetric(computeMetric(data));
    }
  }, [typeOfGraph, data]);

  return (
    <div
      className="box-border xl:w-[calc(100%-384px)] w-full h-min flex flex-col justify-start items-start shadow-metrics hover:shadow-metrics-hover bg-white xl:overflow-hidden overflow-visible p-0 content-start flex-nowrap xl:gap-0 gap-5 rounded-xl border-[#D4D4D4] border"
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
                    Impressoes
                  </TabsTrigger>
                  <TabsTrigger value={"Interacoes"}>Interacoes</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="flex items-center gap-4 self-stretch">
            <p className="flex-shrink-0 w-auto h-auto whitespace-pre relative font-bold font-nexa-bold text-[#101828] text-3xl leading-[38px]">
              {metric}
            </p>
            <Badge number={20.1} />
          </div>
        </div>

        <BarGraph typeOfGraph={typeOfGraph} />
      </div>
    </div>
  );
};

export default MetricsGraph;
