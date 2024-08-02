import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import DoughnutGraph from "./DoughnutGraph";
import { motion } from "framer-motion";
import Badge from "./Badge";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

type MetricsDoughnutGraphProps = {
  heading: string;
  metric?: string;
};

const MetricsDoughnutGraph = ({
  heading,
  metric,
}: MetricsDoughnutGraphProps) => {
  return (
    <div
      className="box-border xl:w-[360px] w-full max-h-[428px] h-full flex flex-col justify-start items-start shadow-metrics   bg-white overflow-hidden p-0 content-start flex-nowrap gap-0 rounded-xl border-[#D4D4D4] border"
      // initial={false}
      // whileHover={{ boxShadow: "2px 2px 0px 0px #898989" }}
      // animate={{ boxShadow: "2px 2px 2px 0px rgba(16, 24, 40, 0.06)" }}
      // transition={{ duration: 0.3, ease: "linear" }}
    >
      <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-center p-5 overflow-visible relative content-start flex-nowrap gap-5 rounded-none">
        <div className="flex-shrink-0 w-full h-min flex flex-col justify-center items-center overflow-visible relative p-0 content-center flex-nowrap gap-3 rounded-none">
          <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-5 rounded-none">
            <div className="flex-shrink-0 w-full h-10 flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-4 rounded-none">
              <div className="flex-shrink-0 flex-grow w-auto h-full flex flex-col justify-center items-start overflow-visible relative p-0 content-start flex-nowrap gap-1 rounded-none">
                <p
                  className={`flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-medium font-nexa text-[#475467] text-sm`}
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
              {metric}
            </p>
            <Badge number={20.1} />
          </div>
        </div>
        <DoughnutGraph />
      </div>
    </div>
  );
};

export default MetricsDoughnutGraph;
