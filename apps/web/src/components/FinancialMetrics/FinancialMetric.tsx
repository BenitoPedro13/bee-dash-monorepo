import { motion } from 'framer-motion'
import React from 'react'

import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({subsets: ['latin']});

type FinancialMetricProps = {
    heading: string,
    metric: string,
}

const FinancialMetric = ({ heading, metric }: FinancialMetricProps) => {
    return (
        <motion.div 
            className='box-border w-full h-fit flex justify-start items-center p-4 shadow-financial-metrics hover:shadow-metrics-hover bg-white overflow-visible content-center flex-nowrap gap-[10px] rounded-none border-b border-solid border-[#222]'
            initial={false}
            whileHover={{ boxShadow: "2px 2px 0px 0px #000000" }}
            animate={{ boxShadow: "0px 1px 2px 0px rgba(0, 0, 0, 0.25)" }}
            transition={{ duration: 0.3, ease: "linear" }}
        >
            <div className="box-border flex-shrink-0 flex-grow w-auto h-min flex justify-start items-end overflow-visible relative p-o content-end flex-nowrap gap-4 rounded-lg border border-solid border-transparent">
                <div className="flex-shrink-0 flex-grow w-auto h-min flex flex-col justify-start items-start overflow-visible relative p-0 content-start flex-nowrap gap-1 rounded-none">
                    <p className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-medium ${jakarta.className} text-[#475466] text-sm`}>
                        {heading}
                    </p>
                    <p className={`flex-shrink-0 w-auto h-auto whitespace-pre relative font-medium font-Balgin-Display text-[#0f1728] text-3xl leading-[38px]`}>
                        {metric}
                    </p>
                </div>
            </div>
        </motion.div>
    )
}

export default FinancialMetric