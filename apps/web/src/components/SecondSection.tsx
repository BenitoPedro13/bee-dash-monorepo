"use client";

import useDataStore, {
  DashboardMode,
  DashbordDateRange,
  Influencer,
} from "@/store";
import {
  calculateVariations,
  calculateVariationsCurrency,
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
    heading: string;
    metric: (data: Influencer[]) => [string, string];
    variation: (
      data: Influencer[]
    ) => [
      Record<
        DashbordDateRange,
        { total: number | string; variation: number | null }
      >,
      Record<
        DashbordDateRange,
        { total: number | string; variation: number | null }
      >
    ];
    sigla?: string[];
  }[]
> = {
  tiktok: [
    {
      heading: "Engajamento Médio",
      sigla: ["Total", "CPE"],
      metric: (data) => [
        totalPercentage(data, "Engajamento Tiktok"),
        totalCPE(data, "CPE Tiktok"),
      ],
      variation: (data) => [
        calculateVariationsPercentage(data, "Engajamento Tiktok"),
        calculateVariationsCurrency(data, "CPE Tiktok"),
      ],
    },
    {
      heading: "Cliques no Link",
      sigla: ["Total", "CPC"],
      metric: (data) => [
        total(data, "Cliques Tiktok"),
        totalCPE(data, "CPC Tiktok"),
      ],
      variation: (data) => [
        calculateVariations(data, "Cliques Tiktok"),
        calculateVariationsCurrency(data, "CPC Tiktok"),
      ],
    },
    {
      heading: "Custo por Mil Views",
      sigla: ["Total", "CPV"],
      metric: (data) => [
        total(data, "Impressoes Tiktok"),
        totalCPE(data, "CPV Tiktok"),
      ],
      variation: (data) => [
        calculateVariations(data, "Impressoes Tiktok"),
        calculateVariationsCurrency(data, "CPV Tiktok"),
      ],
    },
    {
      heading: "Investimento Total",
      metric: (data) => [
        total(data, "Investimento", true),
        total(data, "Investimento", true),
      ],
      variation: (data) => [
        calculateVariations(data, "Investimento"),
        calculateVariations(data, "Investimento"),
      ],
    },
  ],
  instagram: [
    {
      heading: "Engajamento Médio",
      sigla: ["Total", "CPE"],
      metric: (data) => [
        totalPercentage(data, "Engajamento"),
        totalCPE(data, "CPE"),
      ],
      variation: (data) => [
        calculateVariationsPercentage(data, "Engajamento"),
        calculateVariationsCurrency(data, "CPE"),
      ],
    },
    {
      heading: "Cliques no Link",
      sigla: ["Total", "CPC"],
      metric: (data) => [total(data, "Cliques"), totalCPE(data, "CPC")],

      variation: (data) => [
        calculateVariations(data, "Cliques"),
        calculateVariationsCurrency(data, "CPV"),
      ],
    },
    {
      heading: "Custo por Mil Views",
      sigla: ["Total", "CPV"],
      metric: (data) => [total(data, "Impressoes"), totalCPE(data, "CPV")],

      variation: (data) => [
        calculateVariations(data, "Impressoes"),
        calculateVariationsCurrency(data, "CPV"),
      ],
    },
    {
      heading: "Investimento Total",
      metric: (data) => [
        total(data, "Investimento", true),
        total(data, "Investimento", true),
      ],

      variation: (data) => [
        calculateVariations(data, "Investimento"),
        calculateVariations(data, "Investimento"),
      ],
    },
  ],
  all: [
    {
      heading: "Engajamento Médio",
      sigla: ["Total", "CPE"],
      metric: (data) => [
        totalPercentage(data, "Engajamento Media"),
        totalCPE(data, ["CPE", "CPE Tiktok"]),
      ],
      variation: (data) => [
        calculateVariationsPercentage(data, "Engajamento Media"),
        calculateVariationsCurrency(data, "CPE Media"),
      ],
    },
    {
      heading: "Cliques no Link",
      sigla: ["Total", "CPC"],
      metric: (data) => [
        total(data, ["Cliques", "Cliques Tiktok"]),
        totalCPE(data, "CPC Media"),
      ],

      variation: (data) => [
        calculateVariations(data, ["Cliques", "Cliques Tiktok"]),
        calculateVariationsCurrency(data, "CPV Media"),
      ],
    },
    {
      heading: "Custo por Mil Views",
      sigla: ["Total", "CPV"],
      metric: (data) => [
        total(data, ["Impressoes", "Impressoes Tiktok"]),
        totalCPE(data, "CPV Media"),
      ],

      variation: (data) => [
        calculateVariations(data, ["Impressoes", "Impressoes Tiktok"]),
        calculateVariationsCurrency(data, "CPV Media"),
      ],
    },
    {
      heading: "Investimento Total",
      metric: (data) => [
        total(data, "Investimento", true),
        total(data, "Investimento", true),
      ],
      variation: (data) => [
        calculateVariations(data, "Investimento"),
        calculateVariations(data, "Investimento"),
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
              key={heading}
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
