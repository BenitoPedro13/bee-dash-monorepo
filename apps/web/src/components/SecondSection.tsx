"use client";

import useDataStore, {
  DashboardMode,
  DashbordDateRange,
  Influencer,
} from "@/store";
import {
  calculateVariations,
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
    metric: (data: Influencer[]) => string;
    variation: (
      data: Influencer[]
    ) => Record<DashbordDateRange, { total: number; variation: number | null }>;
    sigla?: string[];
    costPerMetric: (data: Influencer[]) => string;
  }[]
> = {
  tiktok: [
    {
      heading: "Engajamento Médio",
      sigla: ["Total", "CPE"],
      metric: (data) => totalPercentage(data, "Engajamento Tiktok"),
      costPerMetric: (data) => totalCPE(data, "CPE Tiktok"),
      variation: (data) =>
        calculateVariationsPercentage(data, "Engajamento Tiktok"),
    },
    {
      heading: "Cliques no Link",
      sigla: ["Total", "CPC"],
      metric: (data) => total(data, "Cliques Tiktok"),
      costPerMetric: (data) => totalCPE(data, "CPC Tiktok"),
      variation: (data) => calculateVariations(data, "Cliques Tiktok"),
    },
    {
      heading: "Custo por Mil Views",
      sigla: ["Total", "CPV"],
      metric: (data) => total(data, "Impressoes Tiktok"),
      costPerMetric: (data) => totalCPE(data, "CPV Tiktok"),
      variation: (data) => calculateVariations(data, "CPV Tiktok"),
    },
    {
      heading: "Investimento Total",
      metric: (data) => total(data, "Investimento", true),
      costPerMetric: (data) => total(data, "Investimento", true),
      variation: (data) => calculateVariations(data, "CPV Tiktok"),
    },
  ],
  instagram: [
    {
      heading: "Engajamento Médio",
      sigla: ["Total", "CPE"],
      metric: (data) => totalPercentage(data, "Engajamento"),
      costPerMetric: (data) => totalCPE(data, "CPE"),
      variation: (data) => calculateVariationsPercentage(data, "Engajamento"),
    },
    {
      heading: "Cliques no Link",
      sigla: ["Total", "CPC"],
      metric: (data) => total(data, "Cliques"),
      costPerMetric: (data) => totalCPE(data, "CPC"),
      variation: (data) => calculateVariations(data, "Cliques"),
    },
    {
      heading: "Custo por Mil Views",
      sigla: ["Total", "CPV"],
      metric: (data) => total(data, "Impressoes"),
      costPerMetric: (data) => totalCPE(data, "CPV"),
      variation: (data) => calculateVariations(data, "CPV"),
    },
    {
      heading: "Investimento Total",
      metric: (data) => total(data, "Investimento", true),
      costPerMetric: (data) => total(data, "Investimento", true),
      variation: (data) => calculateVariations(data, "CPV"),
    },
  ],
  all: [
    {
      heading: "Engajamento Médio",
      sigla: ["Total", "CPE"],
      metric: (data) =>
        totalPercentage(data, ["Engajamento", "Engajamento Tiktok"]),
      costPerMetric: (data) => totalCPE(data, ["CPE", "CPE Tiktok"]),
      variation: (data) =>
        calculateVariationsPercentage(data, [
          "Engajamento",
          "Engajamento Tiktok",
        ]),
    },
    {
      heading: "Cliques no Link",
      sigla: ["Total", "CPC"],
      metric: (data) => total(data, ["Cliques", "Cliques Tiktok"]),
      costPerMetric: (data) => totalCPE(data, ["CPC", "CPC Tiktok"]),
      variation: (data) =>
        calculateVariations(data, ["Cliques", "Cliques Tiktok"]),
    },
    {
      heading: "Custo por Mil Views",
      sigla: ["Total", "CPV"],
      metric: (data) => total(data, ["Impressoes", "Impressoes Tiktok"]),
      costPerMetric: (data) => totalCPE(data, ["CPV", "CPV Tiktok"]),
      variation: (data) => calculateVariations(data, ["CPV", "CPV Tiktok"]),
    },
    {
      heading: "Investimento Total",
      metric: (data) => total(data, "Investimento", true),
      costPerMetric: (data) => total(data, "Investimento", true),
      variation: (data) => calculateVariations(data, ["CPV", "CPV Tiktok"]),
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
          {/* <CostPerMetric
            sigla={["Total", "CPE"]}
            heading="Engajamento Médio"
            metric={totalPercentage(data, "Engajamento")}
            variation={12.1}
          />
          <CostPerMetric
            sigla={["Total", "CPC"]}
            heading="Cliques no Link"
            metric={total(data, "Cliques")}
            costPerMetric={costPerMetric(
              data,
              "Cliques",
              totalCount(data, "Investimento")
            )}
            variation={12.1}
          />
          <CostPerMetric
            sigla={["Total", "CPV"]}
            heading="Custo por Mil Views"
            metric={total(data, "Impressoes")}
            costPerMetric={costPerMetric(
              data,
              "Impressoes",
              totalCount(data, "Investimento")
            )}
            variation={12.1}
          />
          <CostPerMetric
            heading="Investimento Total"
            metric={total(data, "Investimento", true)}
          /> */}
          {metrics.map(
            ({ heading, metric, sigla, variation, costPerMetric }) => (
              <CostPerMetric
                key={heading}
                heading={heading}
                sigla={sigla}
                costPerMetric={costPerMetric(data)}
                metric={metric(data)}
                variation={variation(data)}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SecondSection;
