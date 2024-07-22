/* eslint-disable @next/next/no-img-element */
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
// import { Inter } from 'next/font/google'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { motion } from "framer-motion";

// const inter = Inter({ subsets: ['latin'] })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] })

type CostPerMetricProps = {
  heading: string;
  sigla: string;
  metric: string;
  costPerMetric: string;
};

const CostPerMetric = ({ heading, sigla, metric, costPerMetric }: CostPerMetricProps) => {
  const [siglaActive, setSiglaActive] = useState(false);

  return (
    <motion.div 
      className="box-border w-full h-min flex flex-col justify-start items-start p-6 shadow-metrics hover:shadow-metrics-hover bg-white overflow-visible content-start flex-nowrap gap-6 rounded-xl border-black border"
      initial={false}
      whileHover={{ boxShadow: '2px 2px 0px 0px #000000' }}
      animate={{ boxShadow: '2px 2px 2px 0px rgba(16, 24, 40, 0.06)' }}
      transition={{ duration: 0.3, ease: 'linear' }}
    >
      <div className="flex-shrink-0 w-full h-min flex flex-col justify-center items-start overflow-visible relative p-0 content-start flex-nowrap gap-5 rounded-none">
        <div className="flex-shrink-0 w-full h-min flex justify-start items-center overflow-visible relative p-0 content-center flex-nowrap gap-4 rounded-none">
          <div className="flex-shrink-0 flex-grow w-auto h-full flex flex-col justify-center items-start overflow-visible relative p-0 content-start flex-nowrap gap-1 rounded-none">
            <p className={`flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-semibold ${jakarta.className} text-[#0f1728] text-lg`}>{heading}</p>
          </div>
          <div className="box-border flex-shrink-0 w-min h-min flex justify-start items-start shadow-cost-per-metrics overflow-hidden relative p-0 content-start flex-nowrap gap-0 rounded-lg border border-[#00000040]">
            <div onClick={(e) => setSiglaActive(false)} className={`cursor-pointer box-border flex-shrink-0 w-min h-min flex justify-center items-center py-[10px] px-4 ${!siglaActive ? 'bg-white' : 'bg-[#f0f0f0]'} overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none border-solid border-r border-[#00000040]`}>
              <p className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-semibold ${jakarta.className} text-[#1d2838] text-sm`}>
                Total
              </p>
            </div>
            <div onClick={(e) => setSiglaActive(true)} className={`cursor-pointer box-border flex-shrink-0 w-min h-min flex justify-center items-center py-[10px] px-4 ${!siglaActive ? 'bg-[#f0f0f0]' : 'bg-white'} overflow-visible relative p-0 content-center flex-nowrap gap-2 rounded-none border-solid border-r border-[#00000040]`}>
              <p className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-semibold ${jakarta.className} text-[#1d2838] text-sm`}>
                {sigla}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 w-full h-min flex justify-start items-end overflow-visible relative p-0 content-end flex-nowrap gap-4 rounded-none">
        <div className="flex-shrink-0 flex-grow w-auto h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-4 rounded-none">
          <p className="flex-shrink-0 w-full h-auto whitespace-pre-wrap break-words relative font-Balgin-Display font-bold text-[#0f1728] text-3xl leading-[38px]">
            { !siglaActive ? metric : costPerMetric}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CostPerMetric;
