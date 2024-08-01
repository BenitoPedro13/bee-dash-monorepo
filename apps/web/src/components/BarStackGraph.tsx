import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useDataStore, { Influencer } from "@/store";

import { GraphTypes } from "./MetricsLineGraph";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { generateShadesAndTints } from "../../utils/utils";
// import { TrendingUp } from "lucide-react";

export default function BarStackGraph({
  typeOfGraph,
}: {
  typeOfGraph: GraphTypes;
}) {
  const { data } = useDataStore((state) => state.data);
  const { user } = useDataStore((state) => state.session);

  const mainColor = !user?.color ? "#FF77EF" : user.color; // Assuming user.color is the main color in hex format
  const subVariations = generateShadesAndTints(mainColor, data.length);

  const chartConfig = {
    desktop: {
      label: typeOfGraph,
      color: "#FF5100",
    },
  } satisfies ChartConfig;

  const getChartData = (typeOfGraph: GraphTypes, data: Influencer[]) => {
    switch (typeOfGraph) {
      case "Impressoes":
        return data.map((item, index) => {
          return {
            influencer: item.Influencer,
            Impressoes: Number.parseInt(item["Impressoes"].replaceAll(".", "")),
            fill: subVariations[index],
          };
        });
      case "Interacoes":
        return data.map((item, index) => {
          return {
            influencer: item.Influencer,
            Interacoes: Number.parseInt(item["Interacoes"].replaceAll(".", "")),
            fill: subVariations[index],
          };
        });
      default:
        return [];
    }
  };

  return (
    // <Card>
    //   <CardHeader>
    //     <CardTitle>Bar Chart - Label</CardTitle>
    //     <CardDescription>January - June 2024</CardDescription>
    //   </CardHeader>
    //   <CardContent>
    // <div className="w-full max-w-[880px] h-full max-h-[224px]">
    <ChartContainer config={chartConfig} width="100%" height="288px">
      <BarChart
        accessibilityLayer
        data={getChartData(typeOfGraph, data)}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          hide
          dataKey="influencer"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          // tickFormatter={(value) => value}
        />
        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent className="w-[180px]" />}
        />
        <Bar dataKey={typeOfGraph} fill="var(--color-desktop)" radius={4}>
          {/* <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          /> */}
        </Bar>
      </BarChart>
    </ChartContainer>
    // </div>

    // </CardContent>
    //   <CardFooter className="flex-col items-start gap-2 text-sm">
    //     <div className="flex gap-2 font-medium leading-none">
    //       Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
    //     </div>
    //     <div className="leading-none text-muted-foreground">
    //       Showing total visitors for the last 6 months
    //     </div>
    //   </CardFooter>
    // </Card>
  );
}
