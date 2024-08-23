"use client";

import useDataStore, {
  DashboardMode,
  DashbordDateRange,
  Influencer,
} from "@/store";
import {
  calculateVariations,
  calculateVariationsCPV,
  calculateVariationsCTR,
  calculateVariationsCurrency,
  calculateVariationsEngajamento,
  calculateVariationsPercentage,
  costPerMetric,
  total,
  totalCount,
  totalCPE,
  totalPercentage,
} from "../../utils/utils";
import CostPerMetric from "./CostPerMetric";
import Metrics from "./Metrics";

const metricConfig: Record<
  DashboardMode,
  {
    heading: string[];
    metric: (data: Influencer[]) => string[];
    variation: (
      data: Influencer[]
    ) => Record<
      DashbordDateRange,
      { total: number | string; variation: number | null }
    >[];
    sigla?: string[];
  }[]
> = {
  tiktok: [
    {
      heading: ["Engajamento Médio", "Custo por Engajamento"],
      sigla: ["Total"],
      metric: (data) => [
        totalPercentage(data, "Engajamento Tiktok"),
        // totalCPE(data, "CPE Tiktok"),
      ],
      variation: (data) => [
        calculateVariationsEngajamento(
          data,
          "Impressoes Tiktok",
          "Interacoes Tiktok"
        ),
        // calculateVariationsEngajamento(
        //   data,
        //   "Impressoes Tiktok",
        //   "Interacoes Tiktok",
        //   true
        // ),
      ],
    },
    {
      heading: ["Cliques", "Taxa de Cliques"],
      sigla: ["Total", "CTR"],
      metric: (data) => [
        total(data, "Cliques Tiktok"),
        totalCPE(data, "CPC Tiktok"),
      ],
      variation: (data) => [
        calculateVariations(data, "Cliques Tiktok"),
        calculateVariationsCTR(data, "Impressoes Tiktok", "Cliques Tiktok"),
      ],
    },
    {
      heading: ["Views", "Custo por View", "Custo por Mil Views"],
      sigla: ["Total", "CPV"],
      metric: (data) => [
        total(data, "Impressoes Tiktok"),
        totalCPE(data, "CPV Tiktok"),
        // totalCPE(data, "CPV Tiktok"),
      ],
      variation: (data) => [
        calculateVariations(data, "Impressoes Tiktok"),
        calculateVariationsCPV(data, "Impressoes Tiktok"),
        // calculateVariationsCPV(data, "Impressoes Tiktok", true),
      ],
    },
    {
      heading: ["Investimento Total", "Investimento Médio"],
      metric: (data) => [
        total(data, "Investimento", true),
        total(data, "Investimento", true),
      ],
      sigla: ["Total", "Média"],
      variation: (data) => [
        calculateVariations(data, "Investimento"),
        calculateVariations(data, "Investimento", true),
      ],
    },
  ],
  instagram: [
    {
      heading: ["Engajamento Médio", "Custo por Engajamento"],
      sigla: ["Total"],
      metric: (data) => [
        totalPercentage(data, "Engajamento"),
        // totalCPE(data, "CPE"),
      ],
      variation: (data) => [
        calculateVariationsEngajamento(data, "Impressoes", "Interacoes"),
        // calculateVariationsEngajamento(data, "Impressoes", "Interacoes", true),
      ],
    },
    {
      heading: ["Cliques", "Taxa de Cliques"],
      sigla: ["Total", "CTR"],
      metric: (data) => [total(data, "Cliques"), totalCPE(data, "CPC")],
      variation: (data) => [
        calculateVariations(data, "Cliques"),
        calculateVariationsCTR(data, "Impressoes", "Cliques"),
      ],
    },
    {
      heading: ["Views", "Custo por View", "Custo por Mil Views"],
      sigla: ["Total", "CPV"],
      metric: (data) => [
        total(data, "Impressoes"),
        totalCPE(data, "CPV"),
        // totalCPE(data, "CPV"),
      ],
      variation: (data) => [
        calculateVariations(data, "Impressoes"),
        calculateVariationsCPV(data, "Impressoes"),
        // calculateVariationsCPV(data, "Impressoes", true),
      ],
    },
    {
      heading: ["Investimento Total", "Investimento Médio"],
      metric: (data) => [
        total(data, "Investimento", true),
        total(data, "Investimento", true),
      ],
      sigla: ["Total", "Média"],
      variation: (data) => [
        calculateVariations(data, "Investimento"),
        calculateVariations(data, "Investimento", true),
      ],
    },
  ],
  all: [
    {
      heading: ["Engajamento Médio", "Custo por Engajamento"],
      sigla: ["Total"],
      metric: (data) => [
        totalPercentage(data, "Engajamento Media"),
        // totalCPE(data, ["CPE", "CPE Tiktok"]),
      ],
      variation: (data) => [
        calculateVariationsEngajamento(
          data,
          ["Impressoes", "Impressoes Tiktok"],
          ["Interacoes", "Interacoes Tiktok"]
        ),
        // calculateVariationsEngajamento(
        //   data,
        //   ["Impressoes", "Impressoes Tiktok"],
        //   ["Interacoes", "Interacoes Tiktok"],
        //   true
        // ),
      ],
    },
    {
      heading: ["Cliques", "Taxa de Cliques"],
      sigla: ["Total", "CTR"],
      metric: (data) => [
        total(data, ["Cliques", "Cliques Tiktok"]),
        totalCPE(data, "CPC Media"),
      ],

      variation: (data) => [
        calculateVariations(data, ["Cliques", "Cliques Tiktok"]),
        calculateVariationsCTR(
          data,
          ["Impressoes", "Impressoes Tiktok"],
          ["Cliques", "Cliques Tiktok"]
        ),
      ],
    },
    {
      heading: ["Views", "Custo por View", "Custo por Mil Views"],
      sigla: ["Total", "CPV"],
      metric: (data) => [
        total(data, ["Impressoes", "Impressoes Tiktok"]),
        totalCPE(data, "CPV Media"),
        // totalCPE(data, "CPV Media"),
      ],

      variation: (data) => [
        calculateVariations(data, ["Impressoes", "Impressoes Tiktok"]),
        calculateVariationsCPV(data, ["Impressoes", "Impressoes Tiktok"]),
        // calculateVariationsCPV(data, ["Impressoes", "Impressoes Tiktok"], true),
      ],
    },
    {
      heading: ["Investimento Total", "Investimento Médio"],
      sigla: ["Total", "Média"],
      metric: (data) => [
        total(data, "Investimento", true),
        total(data, "Investimento", true),
      ],
      variation: (data) => [
        calculateVariations(data, "Investimento"),
        calculateVariations(data, "Investimento", true),
      ],
    },
  ],
};

const SecondSection = () => {
  const { data } = useDataStore((state) => state.data);
  const mode = useDataStore((state) => state.mode);
  const metrics = metricConfig[mode] || [];

  return (
    <div className="w-full flex-shrink-0 h-min flex flex-col justify-start items-start overflow-visible relative xl:px-[22px] p-0 content-start flex-nowrap gap-6 rounded-none">
      <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-start xl:p-0 px-[15px] overflow-visible relative content-start flex-nowrap xl:gap-[22px] gap-6 rounded-none">
        <div className="flex-shrink-0 flex-grow xl:flex-grow-0 w-full h-min flex xl:flex-row flex-col justify-start items-center overflow-visible relative p-0 content-center flex-nowrap xl:gap-6 gap-[15px] rounded-none">
          {metrics.map(({ heading, metric, sigla, variation }) => (
            <CostPerMetric
              key={heading.join("-")}
              heading={heading}
              sigla={sigla}
              metric={metric(data)}
              variation={variation(data)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondSection;
