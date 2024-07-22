import useDataStore from "@/store";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { generateShadesAndTints } from "../../utils/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutGraph() {
  const { data } = useDataStore((state) => state.data);
  const { user } = useDataStore((state) => state.session);

  const mainColor = !user?.color ? '#FF77EF' : user.color; // Assuming user.color is the main color in hex format
  const subVariations = generateShadesAndTints(mainColor, data.length);

  const chartData = {
    labels: data.map((item) => item.Influencer),
    datasets: [
      {
        label: "Impressões",
        data: data.map((item) => Number.parseInt(item.Impressoes.replaceAll(".", ""))),
        backgroundColor: subVariations,
        borderColor: subVariations,
        borderWidth: 1,
      },
    ],
  };

  return <Doughnut className="overflow-hidden max-w-[380px] max-h-[380px]" data={chartData} />;
}
