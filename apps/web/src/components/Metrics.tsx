/* eslint-disable @next/next/no-img-element */
import Image, { StaticImageData } from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { Plus_Jakarta_Sans } from "next/font/google";
import Badge from "./Badge";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

type MetricsProps = {
  children?: React.ReactNode;
  heading: string;
  metric: string;
  variation?: number;
};

const Metrics = ({ children, heading, metric, variation }: MetricsProps) => {
  return (
    <motion.div
      className="box-border w-full sm:min-w-[200px] h-min flex flex-col items-start p-4 bg-white overflow-visible content-center flex-nowrap gap-2 rounded-xl border-[#D4D4D4] border"
      initial={false}
      whileHover={{ boxShadow: "2px 2px 0px 0px #898989" }}
      animate={{ boxShadow: "2px 2px 2px 0px rgba(16, 24, 40, 0.06)" }}
      transition={{ duration: 0.3, ease: "linear" }}
    >
      <div className="flex justify-between items-center self-stretch">
        <h5
          className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-medium font-nexa text-[#475467] text-sm`}
        >
          {heading}
        </h5>

        {children}
      </div>
      <div className="flex flex-col items-start self-stretch gap-[2px]">
        <p className="flex-shrink-0 w-auto h-auto whitespace-pre relative font-bold font-nexa-bold text-[#101828] text-3xl leading-[38px]">
          {metric}
        </p>
        {typeof variation === "number" && <Badge number={variation} />}
      </div>
    </motion.div>
  );
};

export default Metrics;
