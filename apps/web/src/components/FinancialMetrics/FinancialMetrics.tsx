import { motion } from "framer-motion";
import performanceIcon from "@/../public/performanceIcon.png";
import Image from "next/image";
import { Plus_Jakarta_Sans } from "next/font/google";
import React from "react";
import FinancialMetric from "./FinancialMetric";
import PerformanceIcon from "../MetricsIcons/PerformanceIcon";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

const FinancialMetrics = () => {
  return (
    <motion.div
      className="box-border w-full h-min flex flex-col justify-center items-center bg-white shadow-metrics hover:shadow-metrics-hover overflow-hidden p-0 content-center flex-nowrap gap-0 rounded-xl border border-solid border-[#222]"
      initial={false}
      whileHover={{ boxShadow: "2px 2px 0px 0px #000000" }}
      animate={{ boxShadow: "2px 2px 2px 0px rgba(16, 24, 40, 0.06)" }}
      transition={{ duration: 0.3, ease: "linear" }}
    >
      <div className="box-border flex-shrink-0 flex-grow w-full h-fit flex justify-start items-center p-4 overflow-visible relative content-center flex-nowrap gap-[10px] rounded-none border-b border-solid border-[#222]">
        {/* <Image
          src={performanceIcon}
          alt="Performance Icon"
          width={40}
          height={40}
          className="block"
        /> */}
        <PerformanceIcon className='block w-10 h-10 max-h-[40px] max-w-[40px] flex-grow flex-shrink-0' />
        <div className="flex-shrink-0 flex-grow w-full h-min flex flex-col justify-center items-start overflow-visible relative p-0 content-start flex-nowrap gap-1 rounded-none">
          <p
            className={`flex-shrink-0 flex-grow w-auto h-auto whitespace-pre-wrap break-words relative font-semibold ${jakarta.className} text-[#0f1728] text-lg`}
          >
            Métricas Financeiras
          </p>
          <p className="flex-shrink-0 flex-grow w-auto h-auto whitespace-pre-wrap break-words relative text-[#475466] text-sm">
            Acompanhe os dados financeiros de sua campanha
          </p>
        </div>
      </div>
      <FinancialMetric heading="Numero de Vendas" metric="0" />
      <FinancialMetric heading="Taxa de Conversao" metric="0.00%" />
      <FinancialMetric heading="Faturamento" metric="R$ 0,00" />
      <FinancialMetric heading="Numero de Vendas" metric="R$ 0,00" />
    </motion.div>
  );
};

export default FinancialMetrics;
