import React from "react";
import { Plus_Jakarta_Sans } from "next/font/google";
import LineGraph from "./LineGraph";
import DoughnutGraph from "./DoughnutGraph";
import { motion } from "framer-motion";

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
    <motion.div 
      className="box-border w-full h-min flex flex-col justify-start items-start shadow-metrics hover:shadow-metrics-hover bg-white overflow-hidden p-0 content-start flex-nowrap gap-0 rounded-xl border-black border"
      initial={false}
      whileHover={{ boxShadow: '2px 2px 0px 0px #000000' }}
      animate={{ boxShadow: '2px 2px 2px 0px rgba(16, 24, 40, 0.06)' }}
      transition={{ duration: 0.3, ease: 'linear' }}
    >
      <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-center p-6 overflow-visible relative content-start flex-nowrap gap-5 rounded-none">
        <div className="flex-shrink-0 w-full h-min flex flex-col justify-center items-center overflow-visible relative p-0 content-center flex-nowrap gap-3 rounded-none">
          <div className="flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-5 rounded-none">
            <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-4 rounded-none">
              <div className="flex-shrink-0 flex-grow w-auto h-full flex flex-col justify-center items-start overflow-visible relative p-0 content-start flex-nowrap gap-1 rounded-none">
                <p
                  className={`flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-semibold ${jakarta.className} text-[#0f1728] text-lg`}
                >
                  {heading}
                </p>
              </div>
              <div className="bg-transparent box-border flex-shrink-0 w-min h-min flex justify-start items-start overflow-hidden relative p-0 content-start flex-nowrap gap-0">
                <div
                  className={`cursor-pointer box-border flex-shrink-0 w-min h-min flex justify-center items-center bg-white overflow-visible relative content-center flex-nowrap gap-2 rounded-none`}
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
          <div className="flex-shrink-0 w-full h-min flex justify-start items-end overflow-visible relative p-0 content-end flex-nowrap gap-4 rounded-none">
            <p className="flex-shrink-0 w-auto h-auto whitespace-pre relative font-Balgin-Display font-bold text-[#0f1728] text-3xl leading-[38px]">
              {metric}
            </p>
          </div>
        </div>
        <DoughnutGraph />
      </div>
    </motion.div>
  );
};

export default MetricsDoughnutGraph;
