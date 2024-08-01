import useDataStore, { Influencer } from "@/store";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { generateShadesAndTints } from "../../utils/utils";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "./ui/chart";
import { Pie, PieChart } from "recharts";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutGraph() {
  const { data } = useDataStore((state) => state.data);
  const { user } = useDataStore((state) => state.session);

  const mainColor = !user?.color ? "#FF77EF" : user.color; // Assuming user.color is the main color in hex format
  const subVariations = generateShadesAndTints(mainColor, data.length);

  const chartConfig = {
    desktop: {
      label: "Impacto Bruto",
      color: "#FF5100",
    },
  } satisfies ChartConfig;

  const getChartData = (data: Influencer[]) => {
    return data.map((item, index) => {
      return {
        influencer: item.Influencer,
        Impressoes:
          Number.parseInt(item["Impressoes"].replaceAll(".", "")) +
          Number.parseInt(item["Interacoes"].replaceAll(".", "")),
        fill: subVariations[index],
      };
    });
  };

  return (
    <ChartContainer
      config={chartConfig}
      className="aspect-square"
      width="274px"
      height="274px"
    >
      <PieChart>
        <ChartTooltip
          cursor={true}
          content={<ChartTooltipContent className="w-[180px]" />}
        />
        <Pie
          data={getChartData(data)}
          dataKey="Impressoes"
          nameKey="influencer"
          innerRadius={80}
          outerRadius={135}
        />
        {/* <ChartLegend content={<ChartLegendContent />} /> */}
      </PieChart>
    </ChartContainer>
  );
}
