"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useDataStore from "@/store";
import { generateShadesAndTints } from "../../utils/utils";
const chartData = [
  { month: "Segunda", instagram: 186, tiktok: 80 },
  { month: "Terça", instagram: 305, tiktok: 200 },
  { month: "Quarta", instagram: 237, tiktok: 120 },
  { month: "Quinta", instagram: 73, tiktok: 190 },
  { month: "Sexta", instagram: 209, tiktok: 130 },
  { month: "Sábado", instagram: 214, tiktok: 140 },
  { month: "Domingo", instagram: 214, tiktok: 140 },
];

export function Component() {
  const { user } = useDataStore((state) => state.session);

  const mainColor = !user?.color ? "#FF77EF" : user.color; // Assuming user.color is the main color in hex format
  const subVariations = generateShadesAndTints(mainColor, 2);

  const chartConfig = {
    instagram: {
      label: "Instagram",
      color: subVariations[0],
    },
    tiktok: {
      label: "TikTok",
      color: subVariations[1],
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} width="100%" height="288px">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="instagram"
          stackId="a"
          fill="var(--color-instagram)"
          radius={[0, 0, 4, 4]}
        />
        <Bar
          dataKey="tiktok"
          stackId="a"
          fill="var(--color-tiktok)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
