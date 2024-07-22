import React, { useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import LineGraph from "./LineGraph";
import { motion } from "framer-motion";
import { Influencer } from "@/store";
import { total } from "../../utils/utils";
import BarGraph from "./BarGraph";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

type MetricsGraphProps = {
  data: Influencer[];
};

export type GraphTypes = "Video Views" | "Interacoes" | "Total";

const MetricsGraph = ({ data }: MetricsGraphProps) => {
  const [heading, setHeading] = useState<string>("Interações + Views");
  const [metric, setMetric] = useState<string>(total(data, ["Interacoes", "Video Views"]));
  const [typeOfGraph, setTypeOfGraph] = useState<GraphTypes>("Total");

  useEffect(() => {
    const graphTypes = {
      Interacoes: {
        heading: "Interações",
        computeMetric: (data: Influencer[]) => total(data, ["Interacoes"]),
      },
      "Video Views": {
        heading: "Views",
        computeMetric: (data: Influencer[]) => total(data, ["Video Views"]),
      },
      Total: {
        heading: "Interações + Views",
        computeMetric: (data: Influencer[]) =>
          total(data, ["Interacoes", "Video Views"]),
      },
    };

    if (typeOfGraph in graphTypes) {
      const { heading, computeMetric } = graphTypes[typeOfGraph];
      setHeading(heading);
      setMetric(computeMetric(data));
    }
  }, [typeOfGraph, data]);

  return (
    <motion.div
      className="box-border w-full h-min flex flex-col justify-start items-start shadow-metrics hover:shadow-metrics-hover bg-white xl:overflow-hidden overflow-visible p-0 content-start flex-nowrap xl:gap-0 gap-6 rounded-xl border-black border"
      initial={false}
      whileHover={{ boxShadow: "2px 2px 0px 0px #000000" }}
      animate={{ boxShadow: "2px 2px 2px 0px rgba(16, 24, 40, 0.06)" }}
      transition={{ duration: 0.3, ease: "linear" }}
    >
      <div className="box-border w-full h-min flex flex-col justify-start items-start p-6 overflow-visible relative content-start flex-nowrap gap-5 rounded-none">
        <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-2 rounded-none">
          <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-5 rounded-none">
            <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-4 rounded-none">
            <div className="flex-shrink-0 flex-grow w-auto h-full flex flex-col justify-center items-start overflow-visible relative p-0 content-start flex-nowrap gap-1 rounded-none">
                  <p
                    className={`flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-semibold ${jakarta.className} text-[#0f1728] text-lg`}
                  >
                    {heading}
                  </p>
                </div>
              <div className="box-border flex-shrink-0 w-min h-min flex justify-start items-start shadow-cost-per-metrics overflow-hidden relative p-0 content-start flex-nowrap gap-0 rounded-lg border border-solid border-[#cfd4dc]">
                <div
                  onClick={(e) => setTypeOfGraph("Interacoes")}
                  className={`cursor-pointer box-border flex-shrink-0 w-min h-min flex justify-center items-center py-[10px] px-4 ${
                    typeOfGraph === "Interacoes" ? "bg-white" : "bg-[#f0f0f0]"
                  } overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none border-solid border-r border-[#00000040]`}
                >
                  <p
                    className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-semibold ${jakarta.className} text-[#1d2838] text-sm`}
                  >
                    Interações
                  </p>
                </div>
                <div
                  onClick={(e) => setTypeOfGraph("Video Views")}
                  className={`cursor-pointer box-border flex-shrink-0 w-min h-min flex justify-center items-center py-[10px] px-4 ${
                    typeOfGraph === "Video Views" ?  "bg-white" : "bg-[#f0f0f0]"
                  } overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none border-solid border-r border-[#00000040]`}
                >
                  <p
                    className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-semibold ${jakarta.className} text-[#1d2838] text-sm`}
                  >
                    Views
                  </p>
                </div>
                <div
                  onClick={(e) => setTypeOfGraph("Total")}
                  className={`cursor-pointer box-border flex-shrink-0 w-min h-min flex justify-center items-center py-[10px] px-4 ${
                    typeOfGraph === "Total" ?  "bg-white" : "bg-[#f0f0f0]"
                  } overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none border-solid border-r border-[#00000040]`}
                >
                  <p
                    className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-semibold ${jakarta.className} text-[#1d2838] text-sm`}
                  >
                    Total
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 w-full h-min flex justify-start items-end overflow-visible relative p-0 content-end flex-nowrap gap-4 rounded-none">
            <p className="flex-shrink-0 w-auto h-auto whitespace-pre relative font-Balgin-Display font-bold text-[#0f1728] text-3xl leading-[38px]">
              {metric}
            </p>
          </div>
        </div>
        <BarGraph typeOfGraph={typeOfGraph}/>
      </div>
    </motion.div>
  );
};

export default MetricsGraph;
