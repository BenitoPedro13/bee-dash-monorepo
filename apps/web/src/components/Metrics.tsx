/* eslint-disable @next/next/no-img-element */
import Image, { StaticImageData } from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

type MetricsProps = {
  children?: React.ReactNode;
  heading: string;
  metric: string;
};

const Metrics = ({ children, heading, metric }: MetricsProps) => {
  return (
    <motion.div
      className="box-border w-full sm:min-w-[200px] h-min flex justify-start items-center p-4 bg-white overflow-visible content-center flex-nowrap gap-[10px] rounded-xl border-black border"
      initial={false}
      whileHover={{ boxShadow: "2px 2px 0px 0px #000000" }}
      animate={{ boxShadow: "2px 2px 2px 0px rgba(16, 24, 40, 0.06)" }}
      transition={{ duration: 0.3, ease: "linear" }}
    >
      {children}
      <div className="box-border flex-shrink-0 flex-grow w-auto h-auto flex justify-start items-end overflow-visible relative p-0 content-end flex-nowrap gap-4 rounded-lg border border-transparent">
        <div className="flex-shrink-0 flex-grow w-auto h-auto flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-1 rounded-none">
          <h5
            className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-medium ${jakarta.className} text-[#475466] text-sm`}
          >
            {heading}
          </h5>
          <p className="flex-shrink-0 w-auto h-auto whitespace-pre relative font-Balgin-Display font-bold text-[#0f1728] text-3xl leading-[38px]">
            {metric}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default Metrics;
