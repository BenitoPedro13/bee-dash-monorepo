"use client";

import useDataStore, {
  DashboardMode,
  DashbordDateRange,
  Influencer,
  Posts,
} from "@/store";
import {
  calculatePostsPropertiesVariationsBySocialNetworksType,
  calculatePostsVariationsCPV,
  calculatePostsVariationsCTR,
  calculatePostsVariationsEngajamento,
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
import MediumEngagement from "./MetricsIcons/MediumEngagement";
import LinkClicks from "./MetricsIcons/LinkClicks";
import CPV from "./MetricsIcons/CPV";
import Investment from "./MetricsIcons/Investment";

const metricConfig: Record<
  DashboardMode,
  {
    heading: string[];
    variation: (
      data: Posts[]
    ) => Record<
      DashbordDateRange,
      { total: number | string; variation: number | null }
    >[];
    icon: JSX.Element | null;
    sigla?: string[];
  }[]
> = {
  tiktok: [
    {
      heading: ["Engajamento Médio", "Custo por Engajamento"],
      sigla: ["Total"],
      variation: (data) => [
        calculatePostsVariationsEngajamento(
          data,
          ["impressions"],
          ["interactions"],
          ["TIKTOK"]
        ),
        // calculateVariationsEngajamento(
        //   data,
        //   "Impressoes Tiktok",
        //   "Interacoes Tiktok",
        //   true
        // ),
      ],
      icon: <MediumEngagement />,
    },
    {
      heading: ["Cliques", "Taxa de Cliques"],
      sigla: ["Total", "CTR"],
      variation: (data) => [
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["clicks"],
          ["TIKTOK"]
        ),
        calculatePostsVariationsCTR(
          data,
          ["impressions"],
          ["clicks"],
          ["TIKTOK"]
        ),
      ],

      icon: <LinkClicks />,
    },
    {
      heading: ["Views", "Custo por View", "Custo por Mil Views"],
      sigla: ["Total", "CPV"],
      variation: (data) => [
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["impressions"],
          ["TIKTOK"]
        ),
        calculatePostsVariationsCPV(data, ["impressions"], ["TIKTOK"]),
        // calculateVariationsCPV(data, "Impressoes Tiktok", true),
      ],
      icon: <CPV />,
    },
    {
      heading: ["Investimento Total", "Investimento Médio"],
      sigla: ["Total", "Média"],
      variation: (data) => [
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["mediumPrice"],
          ["TIKTOK"]
        ),
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["mediumPrice"],
          ["TIKTOK"],
          true
        ),
      ],
      icon: <Investment />,
    },
  ],
  instagram: [
    {
      heading: ["Engajamento Médio", "Custo por Engajamento"],
      sigla: ["Total"],
      variation: (data) => [
        calculatePostsVariationsEngajamento(
          data,
          ["impressions"],
          ["interactions"],
          ["INSTAGRAM"]
        ),
        // calculateVariationsEngajamento(data, "Impressoes", "Interacoes", true),
      ],
      icon: <MediumEngagement />,
    },
    {
      heading: ["Cliques", "Taxa de Cliques"],
      sigla: ["Total", "CTR"],
      variation: (data) => [
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["clicks"],
          ["INSTAGRAM"]
        ),
        calculatePostsVariationsCTR(
          data,
          ["impressions"],
          ["clicks"],
          ["INSTAGRAM"]
        ),
      ],
      icon: <LinkClicks />,
    },
    {
      heading: ["Views", "Custo por View", "Custo por Mil Views"],
      sigla: ["Total", "CPV"],

      variation: (data) => [
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["impressions"],
          ["INSTAGRAM"]
        ),
        calculatePostsVariationsCPV(data, ["impressions"], ["INSTAGRAM"]),
        // calculateVariationsCPV(data, "Impressoes", true),
      ],
      icon: <CPV />,
    },
    {
      heading: ["Investimento Total", "Investimento Médio"],

      sigla: ["Total", "Média"],
      variation: (data) => [
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["mediumPrice"],
          ["INSTAGRAM"]
        ),
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["mediumPrice"],
          ["INSTAGRAM"],
          true
        ),
      ],
      icon: <Investment />,
    },
  ],
  all: [
    {
      heading: ["Engajamento Médio", "Custo por Engajamento"],
      sigla: ["Total"],

      variation: (data) => [
        calculatePostsVariationsEngajamento(
          data,
          ["impressions"],
          ["interactions"],
          ["INSTAGRAM", "TIKTOK"]
        ),
        // calculateVariationsEngajamento(
        //   data,
        //   ["Impressoes", "Impressoes Tiktok"],
        //   ["Interacoes", "Interacoes Tiktok"],
        //   true
        // ),
      ],
      icon: <MediumEngagement />,
    },
    {
      heading: ["Cliques", "Taxa de Cliques"],
      sigla: ["Total", "CTR"],
      variation: (data) => [
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["clicks"],
          ["INSTAGRAM", "TIKTOK"]
        ),
        calculatePostsVariationsCTR(
          data,
          ["impressions"],
          ["clicks"],
          ["INSTAGRAM", "TIKTOK"]
        ),
      ],
      icon: <LinkClicks />,
    },
    {
      heading: ["Views", "Custo por View", "Custo por Mil Views"],
      sigla: ["Total", "CPV"],
      variation: (data) => [
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["impressions"],
          ["INSTAGRAM", "TIKTOK"]
        ),
        calculatePostsVariationsCPV(
          data,
          ["impressions"],
          ["INSTAGRAM", "TIKTOK"]
        ),
        // calculateVariationsCPV(data, ["Impressoes", "Impressoes Tiktok"], true),
      ],
      icon: <CPV />,
    },
    {
      heading: ["Investimento Total", "Investimento Médio"],
      sigla: ["Total", "Média"],
      variation: (data) => [
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["mediumPrice"],
          ["INSTAGRAM", "TIKTOK"]
        ),
        calculatePostsPropertiesVariationsBySocialNetworksType(
          data,
          ["mediumPrice"],
          ["INSTAGRAM", "TIKTOK"],
          true
        ),
      ],
      icon: <Investment />,
    },
  ],
};

const SecondSection = ({ data, title }: { data?: Posts[]; title?: string }) => {
  const postsData = useDataStore((state) => state.postsData);
  const mode = useDataStore((state) => state.mode);
  const metrics = metricConfig[mode] || [];

  return (
    <div className="flex flex-col items-start gap-2 self-stretch">
      {title && (
        <h3 className="font-nexa text-[#475467] text-lg font-bold leading-[22px]">
          {title}
        </h3>
      )}

      <div className="box-border flex-shrink-0 w-full h-min flex flex-col justify-start items-start overflow-visible relative content-start flex-nowrap rounded-none">
        <div className="flex-shrink-0 flex-grow xl:flex-grow-0 w-full h-min flex xl:flex-row flex-col justify-start items-center overflow-visible relative p-0 content-center flex-nowrap rounded-none">
          {metrics.map(({ heading, sigla, variation, icon }) => (
            <CostPerMetric
              key={heading.join("-")}
              heading={heading}
              sigla={sigla}
              variation={variation(data ?? postsData)}
            >
              {icon}
            </CostPerMetric>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecondSection;
