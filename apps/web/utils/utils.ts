import { Attachment, Influencer } from "@/store";
import colorConvert from "color-convert";
export type tablekeys = keyof Attachment | keyof Influencer;
export type tablesortDirections = "asc" | "desc";

export function parseUpdatedAt(updatedAt: string) {
  const date = new Date(updatedAt);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Helper function to parse date strings in 'dd/mm/yyyy' format
const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day); // Months are 0-indexed in JavaScript
};

export const handleSort = (
  column: string,
  sortColumn: string,
  setSortColumn: any,
  setSortOrder: any
) => {
  if (sortColumn === column) {
    // If the same column is clicked, toggle the sort order
    setSortOrder((prevSortOrder: tablesortDirections) =>
      prevSortOrder === "asc" ? "desc" : "asc"
    );
  } else {
    // If a different column is clicked, set the column and initial sort order
    setSortColumn(column);
    setSortOrder("asc");
  }
};

export const parseCurrencyString = (value: string) => {
  const numericValue = Number(
    value
      .replace(/[^\d,-]/g, "")
      .replace(",", ".")
      .replace("R$", "")
      .replace("-", "")
  );

  return Number.isNaN(numericValue) ? 0 : numericValue;
};

export const parsePercentageString = (value: string) => {
  const numericValue = parseFloat(
    value.replace(/[^\d,.]/g, "").replace(",", ".")
  );
  return Number.isNaN(numericValue) ? 0 : numericValue;
};

export function hexToRgba(hex: string, alpha: number = 1): string {
  const hexPattern = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const shortHexPattern = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  const result = hexPattern.exec(hex) || shortHexPattern.exec(hex);

  if (!result) {
    return hexToRgba("#E624CF");
  }

  const [r, g, b] = result.slice(1).map((x) => Number.parseInt(x, 16));
  const alphaValue = alpha >= 0 && alpha <= 1 ? alpha : 1;

  const returnValue = `rgba(${r}, ${g}, ${b}, ${alphaValue})`;

  return returnValue;
}

export function generateShadesAndTints(mainColor: string, count: number) {
  const [r, g, b] = colorConvert.hex.rgb(mainColor);

  const subVariations = [];
  const step = 1 / (count + 1);

  // Generate shades by darkening the color
  for (let i = 1; i <= count; i++) {
    const factor = 1 - i * step;
    const adjustedR = Math.round(r * factor);
    const adjustedG = Math.round(g * factor);
    const adjustedB = Math.round(b * factor);

    const hexSubColor = colorConvert.rgb.hex([adjustedR, adjustedG, adjustedB]);
    subVariations.push(`#${hexSubColor}`);
  }

  return subVariations;
}

export function generateShadesAndTintsRandomly(
  mainColor: string,
  count: number
) {
  const [r, g, b] = colorConvert.hex.rgb(mainColor);

  let variations = [];
  const step = 1 / (count + 1);

  // Generate shades by darkening the color
  for (let i = 1; i <= Math.floor(count / 2); i++) {
    const factor = 1 - i * step;
    const adjustedR = Math.round(r * factor);
    const adjustedG = Math.round(g * factor);
    const adjustedB = Math.round(b * factor);

    const hexSubColor = colorConvert.rgb.hex([adjustedR, adjustedG, adjustedB]);
    variations.push(`#${hexSubColor}`);
  }

  variations = variations.concat(...[variations.reverse()]);

  // Shuffle the array
  for (let i = variations.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [variations[i], variations[j]] = [variations[j], variations[i]];
  }

  return variations;
}

export const total = (
  data: Influencer[],
  dataKey: keyof Influencer | (keyof Influencer)[],
  currency = false
) => {
  let count = 0;

  if (!Array.isArray(dataKey)) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      // if (dataKey === "Reels") {
      //   count += Number.parseInt("2".replaceAll(".", ""));
      // } else {
      count += Number.parseFloat(element[`${dataKey}`] as string);
      // }
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      for (let j = 0; j < dataKey.length; j++) {
        const key = dataKey[j];

        // if (key === "Reels") {
        //   count += Number.parseInt("2".replaceAll(".", ""));
        // } else {
        count += Number.parseFloat(element[`${key}`] as string);
        // }
      }
    }
  }

  if (!currency) {
    return count.toLocaleString("PT-BR");
  }

  const formattedCount = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(count);

  return formattedCount;
};

export const calculateVariation = (
  current: string,
  previous?: string
): number | null => {
  const currentNumber = Number.parseFloat(current);
  const previousNumber = Number.parseFloat(previous ?? "0");

  if (previous === undefined) return null;
  if (previousNumber === 0) return 0;
  return +(((currentNumber - previousNumber) / previousNumber) * 100).toFixed(
    1
  );
};

// Filter data by date range
export const filterDataByDateRange = (
  data: Influencer[],
  days: number
): Influencer[] => {
  const currentDate = new Date();

  // console.log("filterDataByDateRange", days);

  if (days === 0) return data;

  return data.filter((influencer) => {
    const postDate = parseDate(influencer["Data de Postagem"]);
    const diffTime = currentDate.getTime() - postDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    // console.log(diffDays <= days);

    return diffDays <= days;
  });
};

// Calculate variations comparing current total with previous periods
export const calculateVariations = (
  data: Influencer[],
  keys: keyof Influencer | (keyof Influencer)[]
) => {
  const currentTotal = total(data, keys).replaceAll(".", "");

  const last7DaysData = filterDataByDateRange(data, 7);
  const last14DaysData = filterDataByDateRange(data, 14);
  const last30DaysData = filterDataByDateRange(data, 30);

  const total7Days = total(last7DaysData, keys).replaceAll(".", "");
  const total14Days = total(last14DaysData, keys).replaceAll(".", "");
  const total30Days = total(last30DaysData, keys).replaceAll(".", "");

  // console.log(total7Days, total14Days, total30Days);

  return {
    0: {
      total: new Intl.NumberFormat("pt-BR").format(
        +Number.parseFloat(currentTotal).toFixed(2)
      ),
      variation: calculateVariation(currentTotal),
    },
    7: {
      total: new Intl.NumberFormat("pt-BR").format(
        +Number.parseFloat(total7Days).toFixed(2)
      ),
      variation: calculateVariation(currentTotal, total7Days),
    },
    14: {
      total: new Intl.NumberFormat("pt-BR").format(
        +Number.parseFloat(total14Days).toFixed(2)
      ),
      variation: calculateVariation(currentTotal, total14Days),
    },
    30: {
      total: new Intl.NumberFormat("pt-BR").format(
        +Number.parseFloat(total30Days).toFixed(2)
      ),
      variation: calculateVariation(currentTotal, total30Days),
    },
  };
};

export const calculateVariationsPercentage = (
  data: Influencer[],
  keys: keyof Influencer | (keyof Influencer)[]
) => {
  const currentTotal = totalPercentage(data, keys)
    .replace(",", ".")
    .replaceAll("%", "");

  // console.log("currentTotal", currentTotal);

  const last7DaysData = filterDataByDateRange(data, 7);
  const last14DaysData = filterDataByDateRange(data, 14);
  const last30DaysData = filterDataByDateRange(data, 30);

  const total7Days =
    last7DaysData.length === 0
      ? "0"
      : totalPercentage(last7DaysData, keys).replace(",", ".").replace("%", "");
  const total14Days =
    last14DaysData.length === 0
      ? "0"
      : totalPercentage(last14DaysData, keys)
          .replace(",", ".")
          .replace("%", "");
  const total30Days =
    last30DaysData.length === 0
      ? "0"
      : totalPercentage(last30DaysData, keys)
          .replace(",", ".")
          .replace("%", "");

  return {
    0: {
      total: `${Number.parseFloat(currentTotal)}%`,
      variation: calculateVariation(currentTotal),
    },
    7: {
      total: `${Number.parseFloat(total7Days)}%`,
      variation: calculateVariation(currentTotal, total7Days),
    },
    14: {
      total: `${Number.parseFloat(total14Days)}%`,
      variation: calculateVariation(currentTotal, total14Days),
    },
    30: {
      total: `${Number.parseFloat(total30Days)}%`,
      variation: calculateVariation(currentTotal, total30Days),
    },
  };
};

export const calculateVariationsCurrency = (
  data: Influencer[],
  keys: keyof Influencer | (keyof Influencer)[]
) => {
  const currentTotal = totalCurrency(data, keys)
    .replaceAll(",", ".")
    .replaceAll(/R\$\s*/g, "");

  const last7DaysData = filterDataByDateRange(data, 7);
  const last14DaysData = filterDataByDateRange(data, 14);
  const last30DaysData = filterDataByDateRange(data, 30);

  const total7Days =
    last7DaysData.length === 0
      ? "0"
      : totalCurrency(last7DaysData, keys)
          .replace(",", ".")
          .replace(/R\$\s*/g, "");
  const total14Days =
    last14DaysData.length === 0
      ? "0"
      : totalCurrency(last14DaysData, keys)
          .replace(",", ".")
          .replace(/R\$\s*/g, "");
  const total30Days =
    last30DaysData.length === 0
      ? "0"
      : totalCurrency(last30DaysData, keys)
          .replace(",", ".")
          .replace(/R\$\s*/g, "");

  return {
    0: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+Number.parseFloat(currentTotal).toFixed(2)),
      variation: calculateVariation(currentTotal),
    },
    7: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+Number.parseFloat(total7Days).toFixed(2)),
      variation: calculateVariation(currentTotal, total7Days),
    },
    14: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+Number.parseFloat(total14Days).toFixed(2)),
      variation: calculateVariation(currentTotal, total14Days),
    },
    30: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+Number.parseFloat(total30Days).toFixed(2)),
      variation: calculateVariation(currentTotal, total30Days),
    },
  };
};

export const totalInfluencers = (data: Influencer[]) => `${data.length}`;

export const totalCount = (data: Influencer[], dataKey: keyof Influencer) => {
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    count += Number.parseInt(
      (element[`${dataKey}`] as string).replaceAll(".", "")
    );
  }

  return count;
};

export const totalPercentage = (
  data: Influencer[],
  dataKey: keyof Influencer | (keyof Influencer)[]
) => {
  let count = 0;

  if (!Array.isArray(dataKey)) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      count += Number.parseFloat(
        (element[`${dataKey}`] as string).replaceAll("%", "")
      );
    }

    const formattedCount = new Intl.NumberFormat("pt-BR").format(
      +(count / +totalInfluencers(data)).toFixed(2)
    ); // Divide by number of influencers

    // console.log(formattedCount, "formattedCount");

    return `${formattedCount}%`;
  } else {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      for (let j = 0; j < dataKey.length; j++) {
        const key = dataKey[j];

        // if (key === "Reels") {
        //   count += Number.parseInt("2".replaceAll(".", ""));
        // } else {
        count += Number.parseFloat(
          (element[`${key}`] as string).replaceAll("%", "")
        );
        // }
      }
    }

    const formattedCount = new Intl.NumberFormat("pt-BR").format(
      +(count / (+totalInfluencers(data) * dataKey.length)).toFixed(2)
    ); // Divide by number of influencers and of datakey

    // console.log(dataKey, `${formattedCount}%`);

    return `${formattedCount}%`;
  }
};

export const totalCurrency = (
  data: Influencer[],
  dataKey: keyof Influencer | (keyof Influencer)[]
) => {
  let count = 0;

  if (!Array.isArray(dataKey)) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      count += Number.parseFloat(
        (element[`${dataKey}`] as string).replaceAll("R$", "")
      );
    }

    const formattedCount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(+(count / +totalInfluencers(data)).toFixed(2));
    // console.log("formattedCount", formattedCount);

    return `${formattedCount}`;
  } else {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      for (let j = 0; j < dataKey.length; j++) {
        const key = dataKey[j];

        // if (key === "Reels") {
        //   count += Number.parseInt("2".replaceAll(".", ""));
        // } else {
        count += Number.parseFloat(
          (element[`${key}`] as string).replaceAll("R$", "")
        );
        // }
      }
    }

    const formattedCount = new Intl.NumberFormat("pt-BR").format(
      +(count / (+totalInfluencers(data) * dataKey.length)).toFixed(2)
    ); // Divide by number of influencers and of datakey

    // console.log(dataKey, `${formattedCount}%`);

    return `${formattedCount}`;
  }
};

export const totalCPE = (
  data: Influencer[],
  dataKey: keyof Influencer | (keyof Influencer)[]
) => {
  let count = 0;

  if (!Array.isArray(dataKey)) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      count += Number.parseFloat(
        (element[`${dataKey}`] as string)
          .replaceAll("R$", "")
          .replaceAll(",", ".")
      );
    }

    const formattedCount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(+(count / +totalInfluencers(data)).toFixed(2));

    return formattedCount;
  } else {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      for (let j = 0; j < dataKey.length; j++) {
        const key = dataKey[j];

        count += Number.parseFloat(
          (element[`${key}`] as string)
            .replaceAll("R$", "")
            .replaceAll(",", ".")
        );
      }
    }

    const formattedCount = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(+(count / (+totalInfluencers(data) * dataKey.length)).toFixed(2));

    return formattedCount;
  }
};

export const costPerMetric = (
  data: Influencer[],
  dataKey: keyof Influencer,
  cost: number
) => {
  let count = 0;

  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    count += Number.parseInt(
      (element[`${dataKey}`] as string).replaceAll(".", "")
    );
  }

  return (cost / count).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export function addAlphaToHex(hex: string, alpha: number) {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  // Convert 3-digit hex to 6-digit hex
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((x) => x + x)
      .join("");
  }

  // Ensure the hex is 6 digits long
  if (hex.length !== 6) {
    throw new Error("Invalid hex color format.");
  }

  // Convert the alpha value from a float to a two-digit hex number
  const alphaHex = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase();

  // console.log(`#${hex}${alphaHex}`);

  // Return the combined hex color with alpha
  return `#${hex}${alphaHex}`;
}
