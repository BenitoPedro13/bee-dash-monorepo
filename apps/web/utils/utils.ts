import {
  Attachment,
  Influencer,
  Posts,
  PostsPack,
  PostsType,
  SocialNetworksType,
} from "@/store";
import colorConvert from "color-convert";
export type tablekeys = keyof Attachment | keyof Influencer;
export type tablesortDirections = "asc" | "desc";

export function parseDateToPtBr(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR").format(date);
}

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
export const parseDate = (dateString: string): Date => {
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

function clamp(value: number): number {
  return Math.min(255, Math.round(value));
}

function redistributeRgb(
  r: number,
  g: number,
  b: number
): [number, number, number] {
  const threshold = 255;
  const maxChannel = Math.max(r, g, b);

  // If all values are below the threshold, no redistribution is needed.
  if (maxChannel <= threshold) {
    return [clamp(r), clamp(g), clamp(b)];
  }

  // Calculate total and adjust if we are close to the limit.
  const total = r + g + b;
  if (total >= 3 * threshold) {
    return [threshold, threshold, threshold];
  }

  // Calculate the factor for redistribution.
  const factor = (3 * threshold - total) / (3 * maxChannel - total);
  const gray = threshold - factor * maxChannel;

  // Redistribute each channel proportionally.
  const redistributedR = gray + factor * r;
  const redistributedG = gray + factor * g;
  const redistributedB = gray + factor * b;

  return [clamp(redistributedR), clamp(redistributedG), clamp(redistributedB)];
}

export function generatePastelColor(mainColor: string) {
  // Convert hex color to RGB
  const [r, g, b] = colorConvert.hex.rgb(mainColor);

  // Target whiteness as a percentage
  const targetWhiteness = 0.93;

  // Redistribute and adjust the color to increase brightness.
  let factor = 1.0;
  let adjustedColor: [number, number, number] = [r, g, b];

  while (calculateWhiteness(...adjustedColor) < targetWhiteness) {
    // Scale color by the current factor
    const scaledR = r * factor;
    const scaledG = g * factor;
    const scaledB = b * factor;

    // Apply redistribution to keep hue intact
    adjustedColor = redistributeRgb(scaledR, scaledG, scaledB);

    // Increment factor for next iteration if needed
    factor += 0.1;
  }

  // Convert back to hex and return
  const finalHexColor = colorConvert.rgb.hex(adjustedColor);
  return `#${finalHexColor}`;
}

function calculateWhiteness(r: number, g: number, b: number): number {
  return (r + g + b) / 3 / 255;
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
  for (let i = 1; i <= Math.ceil(count / 2); i++) {
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

  // console.log(variations, "variations", Math.ceil(count / 2), 1 / (count + 1));

  return variations;
}

export const total = (
  data: Influencer[],
  dataKey: keyof Influencer | (keyof Influencer)[],
  currency = false,
  investmentMedium?: boolean
) => {
  let count = 0;

  if (!Array.isArray(dataKey)) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      count += Number.parseFloat(element[`${dataKey}`] as string);
    }

    if (investmentMedium) {
      count = count / +totalInfluencers(data);
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      for (let j = 0; j < dataKey.length; j++) {
        const key = dataKey[j];

        count += Number.parseFloat(element[`${key}`] as string);
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

export function countPostsByType(
  items: Posts[],
  valueArray: PostsType[],
  formatAsNumber: boolean = false
) {
  const count = items.reduce((count, item) => {
    if (valueArray.includes(item.type)) {
      return count + 1;
    }

    return count;
  }, 0);

  if (formatAsNumber) {
    return count;
  }

  return count.toLocaleString("PT-BR");
}

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

export const filterPostsDataByDateRange = (
  data: Posts[],
  days: number
): Posts[] => {
  const currentDate = new Date();

  // console.log("filterDataByDateRange", days);

  if (days === 0) return data;

  return data.filter((post) => {
    const postDate = new Date(post.postDate);
    const diffTime = currentDate.getTime() - postDate.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);

    // console.log(diffDays <= days);

    return diffDays <= days;
  });
};

// Calculate variations comparing current total with previous periods
export const calculateVariations = (
  data: Influencer[],
  keys: keyof Influencer | (keyof Influencer)[],
  investmentMedium?: boolean
) => {
  const currentTotal = total(data, keys, false, investmentMedium).replaceAll(
    ".",
    ""
  );

  const last7DaysData = filterDataByDateRange(data, 7);
  const last14DaysData = filterDataByDateRange(data, 14);
  const last30DaysData = filterDataByDateRange(data, 30);

  const total7Days =
    last7DaysData.length === 0
      ? "0"
      : total(last7DaysData, keys, false, investmentMedium).replaceAll(".", "");
  const total14Days =
    last14DaysData.length === 0
      ? "0"
      : total(last14DaysData, keys, false, investmentMedium).replaceAll(
          ".",
          ""
        );
  const total30Days =
    last30DaysData.length === 0
      ? "0"
      : total(last30DaysData, keys, false, investmentMedium).replaceAll(
          ".",
          ""
        );

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

export const calculatePostsPropertiesVariationsBySocialNetworksType = (
  items: Posts[],
  valueArray: (keyof Posts)[],
  socialNetworksTypes: SocialNetworksType[],
  mediumInvestiment: boolean = false
) => {
  const currentTotal = countPostsPropertiesBySocialNetworksType(
    items,
    valueArray,
    socialNetworksTypes,
    mediumInvestiment
  );

  const last7DaysData = filterPostsDataByDateRange(items, 7);
  const last14DaysData = filterPostsDataByDateRange(items, 14);
  const last30DaysData = filterPostsDataByDateRange(items, 30);

  const total7Days =
    last7DaysData.length === 0
      ? 0
      : countPostsPropertiesBySocialNetworksType(
          last7DaysData,
          valueArray,
          socialNetworksTypes,
          mediumInvestiment
        );
  const total14Days =
    last14DaysData.length === 0
      ? 0
      : countPostsPropertiesBySocialNetworksType(
          last14DaysData,
          valueArray,
          socialNetworksTypes,
          mediumInvestiment
        );
  const total30Days =
    last30DaysData.length === 0
      ? 0
      : countPostsPropertiesBySocialNetworksType(
          last30DaysData,
          valueArray,
          socialNetworksTypes,
          mediumInvestiment
        );

  return {
    0: {
      total: new Intl.NumberFormat("pt-BR").format(currentTotal),
      variation: calculateVariation(`${currentTotal}`),
    },
    7: {
      total: new Intl.NumberFormat("pt-BR").format(total7Days),
      variation: calculateVariation(`${currentTotal}`, `${total7Days}`),
    },
    14: {
      total: new Intl.NumberFormat("pt-BR").format(total14Days),
      variation: calculateVariation(`${currentTotal}`, `${total14Days}`),
    },
    30: {
      total: new Intl.NumberFormat("pt-BR").format(total30Days),
      variation: calculateVariation(`${currentTotal}`, `${total30Days}`),
    },
  };
};
export const calculatePostsCountVariations = (
  items: Posts[],
  valueArray: PostsType[]
) => {
  const currentTotal = countPostsByType(items, valueArray, true) as number;

  const last7DaysData = filterPostsDataByDateRange(items, 7);
  const last14DaysData = filterPostsDataByDateRange(items, 14);
  const last30DaysData = filterPostsDataByDateRange(items, 30);

  const total7Days =
    last7DaysData.length === 0
      ? 0
      : (countPostsByType(last7DaysData, valueArray, true) as number);
  const total14Days =
    last14DaysData.length === 0
      ? 0
      : (countPostsByType(last14DaysData, valueArray, true) as number);
  const total30Days =
    last30DaysData.length === 0
      ? 0
      : (countPostsByType(last30DaysData, valueArray, true) as number);

  return {
    0: {
      total: new Intl.NumberFormat("pt-BR").format(currentTotal),
      variation: calculateVariation(`${currentTotal}`),
    },
    7: {
      total: new Intl.NumberFormat("pt-BR").format(total7Days),
      variation: calculateVariation(`${currentTotal}`, `${total7Days}`),
    },
    14: {
      total: new Intl.NumberFormat("pt-BR").format(total14Days),
      variation: calculateVariation(`${currentTotal}`, `${total14Days}`),
    },
    30: {
      total: new Intl.NumberFormat("pt-BR").format(total30Days),
      variation: calculateVariation(`${currentTotal}`, `${total30Days}`),
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
      : totalPercentage(last7DaysData, keys)
          .replace(".", "")
          .replace(",", ".")
          .replace("%", "");
  const total14Days =
    last14DaysData.length === 0
      ? "0"
      : totalPercentage(last14DaysData, keys)
          .replace(".", "")
          .replace(",", ".")
          .replace("%", "");
  const total30Days =
    last30DaysData.length === 0
      ? "0"
      : totalPercentage(last30DaysData, keys)
          .replace(".", "")
          .replace(",", ".")
          .replace("%", "");

  return {
    0: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +Number.parseFloat(currentTotal)
      )}%`,
      variation: calculateVariation(currentTotal),
    },
    7: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +Number.parseFloat(total7Days)
      )}%`,
      variation: calculateVariation(currentTotal, total7Days),
    },
    14: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +Number.parseFloat(total14Days)
      )}%`,
      variation: calculateVariation(currentTotal, total14Days),
    },
    30: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +Number.parseFloat(total30Days)
      )}%`,
      variation: calculateVariation(currentTotal, total30Days),
    },
  };
};

export const calculateVariationsCurrency = (
  data: Influencer[],
  keys: keyof Influencer | (keyof Influencer)[],
  cpm?: boolean
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
      }).format(
        +(
          cpm
            ? +Number.parseFloat(currentTotal) * 1000
            : +Number.parseFloat(currentTotal)
        ).toFixed(2)
      ),
      variation: calculateVariation(currentTotal),
    },
    7: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(
        +(
          cpm
            ? +Number.parseFloat(total7Days) * 1000
            : +Number.parseFloat(total7Days)
        ).toFixed(2)
      ),
      variation: calculateVariation(currentTotal, total7Days),
    },
    14: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(
        +(
          cpm
            ? +Number.parseFloat(total14Days) * 1000
            : +Number.parseFloat(total14Days)
        ).toFixed(2)
      ),
      variation: calculateVariation(currentTotal, total14Days),
    },
    30: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(
        +(
          cpm
            ? +Number.parseFloat(total30Days) * 1000
            : +Number.parseFloat(total30Days)
        ).toFixed(2)
      ),
      variation: calculateVariation(currentTotal, total30Days),
    },
  };
};

export const calculateVariationsCPV = (
  data: Influencer[],
  keys: keyof Influencer | (keyof Influencer)[],
  cpm?: boolean
) => {
  const currentTotalImpressoes = totalCount(data, keys);
  const currentTotalInvestimento = totalCount(data, "Investimento");

  const currentTotalCPV =
    currentTotalImpressoes === 0
      ? 0
      : currentTotalInvestimento / currentTotalImpressoes;

  const last7DaysData = filterDataByDateRange(data, 7);
  const last14DaysData = filterDataByDateRange(data, 14);
  const last30DaysData = filterDataByDateRange(data, 30);

  const total7DaysImpressions = totalCount(last7DaysData, keys);
  const total7DaysInvestment = totalCount(last7DaysData, "Investimento");

  const total14DaysImpressions = totalCount(last14DaysData, keys);
  const total14DaysInvestment = totalCount(last14DaysData, "Investimento");

  const total30DaysImpressions = totalCount(last30DaysData, keys);
  const total30DaysInvestment = totalCount(last30DaysData, "Investimento");

  const total7Days =
    last7DaysData.length === 0
      ? 0
      : total7DaysImpressions === 0
      ? 0
      : total7DaysInvestment / total7DaysImpressions;
  const total14Days =
    last14DaysData.length === 0
      ? 0
      : total14DaysImpressions === 0
      ? 0
      : total14DaysInvestment / total14DaysImpressions;
  const total30Days =
    last30DaysData.length === 0
      ? 0
      : total30DaysImpressions === 0
      ? 0
      : total30DaysInvestment / total30DaysImpressions;

  return {
    0: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+(cpm ? currentTotalCPV * 1000 : currentTotalCPV).toFixed(2)),
      variation: calculateVariation(`${currentTotalCPV}`),
    },
    7: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+(cpm ? total7Days * 1000 : total7Days).toFixed(2)),
      variation: calculateVariation(`${currentTotalCPV}`, `${total7Days}`),
    },
    14: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+(cpm ? total14Days * 1000 : total14Days).toFixed(2)),
      variation: calculateVariation(`${currentTotalCPV}`, `${total14Days}`),
    },
    30: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+(cpm ? total30Days * 1000 : total30Days).toFixed(2)),
      variation: calculateVariation(`${currentTotalCPV}`, `${total30Days}`),
    },
  };
};

export const calculatePostsVariationsCPV = (
  data: Posts[],
  keys: (keyof Posts)[],
  socialNetworksTypes: SocialNetworksType[],
  cpm?: boolean
) => {
  const currentTotalImpressoes = countPostsPropertiesBySocialNetworksType(
    data,
    keys,
    socialNetworksTypes
  );
  const currentTotalInvestimento = countPostsPropertiesBySocialNetworksType(
    data,
    ["mediumPrice"],
    socialNetworksTypes
  );

  const currentTotalCPV =
    currentTotalImpressoes === 0
      ? 0
      : currentTotalInvestimento / currentTotalImpressoes;

  const last7DaysData = filterPostsDataByDateRange(data, 7);
  const last14DaysData = filterPostsDataByDateRange(data, 14);
  const last30DaysData = filterPostsDataByDateRange(data, 30);

  const total7DaysImpressions = countPostsPropertiesBySocialNetworksType(
    last7DaysData,
    keys,
    socialNetworksTypes
  );
  const total7DaysInvestment = countPostsPropertiesBySocialNetworksType(
    last7DaysData,
    ["mediumPrice"],
    socialNetworksTypes
  );

  const total14DaysImpressions = countPostsPropertiesBySocialNetworksType(
    last14DaysData,
    keys,
    socialNetworksTypes
  );
  const total14DaysInvestment = countPostsPropertiesBySocialNetworksType(
    last14DaysData,
    ["mediumPrice"],
    socialNetworksTypes
  );

  const total30DaysImpressions = countPostsPropertiesBySocialNetworksType(
    last30DaysData,
    keys,
    socialNetworksTypes
  );
  const total30DaysInvestment = countPostsPropertiesBySocialNetworksType(
    last30DaysData,
    ["mediumPrice"],
    socialNetworksTypes
  );

  const total7Days =
    last7DaysData.length === 0
      ? 0
      : total7DaysImpressions === 0
      ? 0
      : total7DaysInvestment / total7DaysImpressions;
  const total14Days =
    last14DaysData.length === 0
      ? 0
      : total14DaysImpressions === 0
      ? 0
      : total14DaysInvestment / total14DaysImpressions;
  const total30Days =
    last30DaysData.length === 0
      ? 0
      : total30DaysImpressions === 0
      ? 0
      : total30DaysInvestment / total30DaysImpressions;

  return {
    0: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+(cpm ? currentTotalCPV * 1000 : currentTotalCPV).toFixed(2)),
      variation: calculateVariation(`${currentTotalCPV}`),
    },
    7: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+(cpm ? total7Days * 1000 : total7Days).toFixed(2)),
      variation: calculateVariation(`${currentTotalCPV}`, `${total7Days}`),
    },
    14: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+(cpm ? total14Days * 1000 : total14Days).toFixed(2)),
      variation: calculateVariation(`${currentTotalCPV}`, `${total14Days}`),
    },
    30: {
      total: new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(+(cpm ? total30Days * 1000 : total30Days).toFixed(2)),
      variation: calculateVariation(`${currentTotalCPV}`, `${total30Days}`),
    },
  };
};

export const calculateVariationsEngajamento = (
  data: Influencer[],
  keysImpressions: keyof Influencer | (keyof Influencer)[],
  keysInteractions: keyof Influencer | (keyof Influencer)[],
  cpe?: boolean
) => {
  const currentTotalImpressions = totalCount(data, keysImpressions);
  const currentTotalInteractions = totalCount(data, keysInteractions);
  const currentTotalInvestimento = totalCount(data, "Investimento");

  const currentTotalEngajamento =
    currentTotalImpressions === 0
      ? 0
      : (currentTotalInteractions / currentTotalImpressions) * 100;

  const last7DaysData = filterDataByDateRange(data, 7);
  const last14DaysData = filterDataByDateRange(data, 14);
  const last30DaysData = filterDataByDateRange(data, 30);

  const total7DaysImpressions = totalCount(last7DaysData, keysImpressions);
  const total7DaysInteractions = totalCount(last7DaysData, keysInteractions);
  const total7DaysInvestimento = totalCount(last7DaysData, "Investimento");

  const total7DaysEngajamento =
    total7DaysImpressions === 0
      ? 0
      : (total7DaysInteractions / total7DaysImpressions) * 100;

  const total14DaysImpressions = totalCount(last14DaysData, keysImpressions);
  const total14DaysInteractions = totalCount(last14DaysData, keysInteractions);
  const total14DaysInvestimento = totalCount(last14DaysData, "Investimento");

  const total14DaysEngajamento =
    total14DaysImpressions === 0
      ? 0
      : (total14DaysInteractions / total14DaysImpressions) * 100;

  const total30DaysImpressions = totalCount(last30DaysData, keysImpressions);
  const total30DaysInteractions = totalCount(last30DaysData, keysInteractions);
  const total30DaysInvestimento = totalCount(last30DaysData, "Investimento");

  const total30DaysEngajamento =
    total30DaysImpressions === 0
      ? 0
      : (total30DaysInteractions / total30DaysImpressions) * 100;

  const totalDays = cpe
    ? currentTotalInvestimento / currentTotalEngajamento
    : currentTotalEngajamento;

  const total7Days =
    last7DaysData.length === 0
      ? 0
      : cpe
      ? total7DaysInvestimento / total7DaysEngajamento
      : total7DaysEngajamento;
  const total14Days =
    last14DaysData.length === 0
      ? 0
      : cpe
      ? total14DaysInvestimento / total14DaysEngajamento
      : total14DaysEngajamento;
  const total30Days =
    last30DaysData.length === 0
      ? 0
      : cpe
      ? total30DaysInvestimento / total30DaysEngajamento
      : total30DaysEngajamento;

  return {
    0: {
      total: !cpe
        ? `${new Intl.NumberFormat("pt-BR").format(+totalDays.toFixed(2))}%`
        : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(+totalDays.toFixed(2)),
      variation: calculateVariation(`${totalDays}`),
    },
    7: {
      total: !cpe
        ? `${new Intl.NumberFormat("pt-BR").format(+total7Days.toFixed(2))}%`
        : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(+total7Days.toFixed(2)),
      variation: calculateVariation(`${totalDays}`, `${total7Days}`),
    },
    14: {
      total: !cpe
        ? `${new Intl.NumberFormat("pt-BR").format(+total14Days.toFixed(2))}%`
        : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(+total14Days.toFixed(2)),
      variation: calculateVariation(`${totalDays}`, `${total14Days}`),
    },
    30: {
      total: !cpe
        ? `${new Intl.NumberFormat("pt-BR").format(+total30Days.toFixed(2))}%`
        : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(+total30Days.toFixed(2)),
      variation: calculateVariation(`${totalDays}`, `${total30Days}`),
    },
  };
};

export const calculatePostsVariationsEngajamento = (
  data: Posts[],
  keysImpressions: (keyof Posts)[],
  keysInteractions: (keyof Posts)[],
  socialNetworksTypes: SocialNetworksType[],
  cpe?: boolean
) => {
  const currentTotalImpressions = countPostsPropertiesBySocialNetworksType(
    data,
    keysImpressions,
    socialNetworksTypes
  );
  const currentTotalInteractions = countPostsPropertiesBySocialNetworksType(
    data,
    keysInteractions,
    socialNetworksTypes
  );
  const currentTotalInvestimento = countPostsPropertiesBySocialNetworksType(
    data,
    ["mediumPrice"],
    socialNetworksTypes
  );

  const currentTotalEngajamento =
    currentTotalImpressions === 0
      ? 0
      : (currentTotalInteractions / currentTotalImpressions) * 100;

  const last7DaysData = filterPostsDataByDateRange(data, 7);
  const last14DaysData = filterPostsDataByDateRange(data, 14);
  const last30DaysData = filterPostsDataByDateRange(data, 30);

  const total7DaysImpressions = countPostsPropertiesBySocialNetworksType(
    last7DaysData,
    keysImpressions,
    socialNetworksTypes
  );
  const total7DaysInteractions = countPostsPropertiesBySocialNetworksType(
    last7DaysData,
    keysInteractions,
    socialNetworksTypes
  );
  const total7DaysInvestimento = countPostsPropertiesBySocialNetworksType(
    last7DaysData,
    ["mediumPrice"],
    socialNetworksTypes
  );

  const total7DaysEngajamento =
    total7DaysImpressions === 0
      ? 0
      : (total7DaysInteractions / total7DaysImpressions) * 100;

  const total14DaysImpressions = countPostsPropertiesBySocialNetworksType(
    last14DaysData,
    keysImpressions,
    socialNetworksTypes
  );
  const total14DaysInteractions = countPostsPropertiesBySocialNetworksType(
    last14DaysData,
    keysInteractions,
    socialNetworksTypes
  );
  const total14DaysInvestimento = countPostsPropertiesBySocialNetworksType(
    last14DaysData,
    ["mediumPrice"],
    socialNetworksTypes
  );

  const total14DaysEngajamento =
    total14DaysImpressions === 0
      ? 0
      : (total14DaysInteractions / total14DaysImpressions) * 100;

  const total30DaysImpressions = countPostsPropertiesBySocialNetworksType(
    last30DaysData,
    keysImpressions,
    socialNetworksTypes
  );
  const total30DaysInteractions = countPostsPropertiesBySocialNetworksType(
    last30DaysData,
    keysInteractions,
    socialNetworksTypes
  );
  const total30DaysInvestimento = countPostsPropertiesBySocialNetworksType(
    last30DaysData,
    ["mediumPrice"],
    socialNetworksTypes
  );

  const total30DaysEngajamento =
    total30DaysImpressions === 0
      ? 0
      : (total30DaysInteractions / total30DaysImpressions) * 100;

  const totalDays = cpe
    ? currentTotalInvestimento / currentTotalEngajamento
    : currentTotalEngajamento;

  const total7Days =
    last7DaysData.length === 0
      ? 0
      : cpe
      ? total7DaysInvestimento / total7DaysEngajamento
      : total7DaysEngajamento;
  const total14Days =
    last14DaysData.length === 0
      ? 0
      : cpe
      ? total14DaysInvestimento / total14DaysEngajamento
      : total14DaysEngajamento;
  const total30Days =
    last30DaysData.length === 0
      ? 0
      : cpe
      ? total30DaysInvestimento / total30DaysEngajamento
      : total30DaysEngajamento;

  return {
    0: {
      total: !cpe
        ? `${new Intl.NumberFormat("pt-BR").format(+totalDays.toFixed(2))}%`
        : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(+totalDays.toFixed(2)),
      variation: calculateVariation(`${totalDays}`),
    },
    7: {
      total: !cpe
        ? `${new Intl.NumberFormat("pt-BR").format(+total7Days.toFixed(2))}%`
        : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(+total7Days.toFixed(2)),
      variation: calculateVariation(`${totalDays}`, `${total7Days}`),
    },
    14: {
      total: !cpe
        ? `${new Intl.NumberFormat("pt-BR").format(+total14Days.toFixed(2))}%`
        : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(+total14Days.toFixed(2)),
      variation: calculateVariation(`${totalDays}`, `${total14Days}`),
    },
    30: {
      total: !cpe
        ? `${new Intl.NumberFormat("pt-BR").format(+total30Days.toFixed(2))}%`
        : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(+total30Days.toFixed(2)),
      variation: calculateVariation(`${totalDays}`, `${total30Days}`),
    },
  };
};

export const calculateVariationsCTR = (
  data: Influencer[],
  keysImpressions: keyof Influencer | (keyof Influencer)[],
  keysCliques: keyof Influencer | (keyof Influencer)[]
) => {
  const currentTotalImpressions = totalCount(data, keysImpressions);
  const currentTotalCliques = totalCount(data, keysCliques);

  const currentTotalCTR =
    (currentTotalCliques /
      (currentTotalImpressions === 0 ? 1 : currentTotalImpressions)) *
    100;

  const last7DaysData = filterDataByDateRange(data, 7);
  const last14DaysData = filterDataByDateRange(data, 14);
  const last30DaysData = filterDataByDateRange(data, 30);

  const total7DaysImpressions = totalCount(last7DaysData, keysImpressions);
  const total7DaysCliques = totalCount(last7DaysData, keysCliques);

  const total7DaysCTR =
    (total7DaysCliques /
      (total7DaysImpressions === 0 ? 1 : total7DaysImpressions)) *
    100;

  const total14DaysImpressions = totalCount(last14DaysData, keysImpressions);
  const total14DaysCliques = totalCount(last14DaysData, keysCliques);

  const total14DaysCTR =
    (total14DaysCliques /
      (total14DaysImpressions === 0 ? 1 : total14DaysImpressions)) *
    100;

  const total30DaysImpressions = totalCount(last30DaysData, keysImpressions);
  const total30DaysCliques = totalCount(last30DaysData, keysCliques);

  const total30DaysCTR =
    (total30DaysCliques /
      (total30DaysImpressions === 0 ? 1 : total30DaysImpressions)) *
    100;

  const total7Days = last7DaysData.length === 0 ? 0 : total7DaysCTR;
  const total14Days = last14DaysData.length === 0 ? 0 : total14DaysCTR;
  const total30Days = last30DaysData.length === 0 ? 0 : total30DaysCTR;

  return {
    0: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +currentTotalCTR.toFixed(2)
      )}%`,
      variation: calculateVariation(`${currentTotalCTR}`),
    },
    7: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +total7Days.toFixed(2)
      )}%`,
      variation: calculateVariation(`${currentTotalCTR}`, `${total7Days}`),
    },
    14: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +total14Days.toFixed(2)
      )}%`,
      variation: calculateVariation(`${currentTotalCTR}`, `${total14Days}`),
    },
    30: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +total30Days.toFixed(2)
      )}%`,
      variation: calculateVariation(`${currentTotalCTR}`, `${total30Days}`),
    },
  };
};

export const calculatePostsVariationsCTR = (
  data: Posts[],
  keysImpressions: (keyof Posts)[],
  keysCliques: (keyof Posts)[],
  socialNetworksTypes: SocialNetworksType[]
) => {
  const currentTotalImpressions = countPostsPropertiesBySocialNetworksType(
    data,
    keysImpressions,
    socialNetworksTypes
  );
  const currentTotalCliques = countPostsPropertiesBySocialNetworksType(
    data,
    keysCliques,
    socialNetworksTypes
  );

  const currentTotalCTR =
    (currentTotalCliques /
      (currentTotalImpressions === 0 ? 1 : currentTotalImpressions)) *
    100;

  const last7DaysData = filterPostsDataByDateRange(data, 7);
  const last14DaysData = filterPostsDataByDateRange(data, 14);
  const last30DaysData = filterPostsDataByDateRange(data, 30);

  const total7DaysImpressions = countPostsPropertiesBySocialNetworksType(
    last7DaysData,
    keysImpressions,
    socialNetworksTypes
  );
  const total7DaysCliques = countPostsPropertiesBySocialNetworksType(
    last7DaysData,
    keysCliques,
    socialNetworksTypes
  );

  const total7DaysCTR =
    (total7DaysCliques /
      (total7DaysImpressions === 0 ? 1 : total7DaysImpressions)) *
    100;

  const total14DaysImpressions = countPostsPropertiesBySocialNetworksType(
    last14DaysData,
    keysImpressions,
    socialNetworksTypes
  );
  const total14DaysCliques = countPostsPropertiesBySocialNetworksType(
    last14DaysData,
    keysCliques,
    socialNetworksTypes
  );

  const total14DaysCTR =
    (total14DaysCliques /
      (total14DaysImpressions === 0 ? 1 : total14DaysImpressions)) *
    100;

  const total30DaysImpressions = countPostsPropertiesBySocialNetworksType(
    last30DaysData,
    keysImpressions,
    socialNetworksTypes
  );
  const total30DaysCliques = countPostsPropertiesBySocialNetworksType(
    last30DaysData,
    keysCliques,
    socialNetworksTypes
  );

  const total30DaysCTR =
    (total30DaysCliques /
      (total30DaysImpressions === 0 ? 1 : total30DaysImpressions)) *
    100;

  const total7Days = last7DaysData.length === 0 ? 0 : total7DaysCTR;
  const total14Days = last14DaysData.length === 0 ? 0 : total14DaysCTR;
  const total30Days = last30DaysData.length === 0 ? 0 : total30DaysCTR;

  return {
    0: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +currentTotalCTR.toFixed(2)
      )}%`,
      variation: calculateVariation(`${currentTotalCTR}`),
    },
    7: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +total7Days.toFixed(2)
      )}%`,
      variation: calculateVariation(`${currentTotalCTR}`, `${total7Days}`),
    },
    14: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +total14Days.toFixed(2)
      )}%`,
      variation: calculateVariation(`${currentTotalCTR}`, `${total14Days}`),
    },
    30: {
      total: `${new Intl.NumberFormat("pt-BR").format(
        +total30Days.toFixed(2)
      )}%`,
      variation: calculateVariation(`${currentTotalCTR}`, `${total30Days}`),
    },
  };
};
export const totalInfluencers = (data: Influencer[]) => `${data.length}`;

export const totalCount = (
  data: Influencer[],
  dataKey: keyof Influencer | (keyof Influencer)[]
) => {
  let count = 0;
  if (!Array.isArray(dataKey)) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      count += Number.parseInt(
        (element[`${dataKey}`] as string).replaceAll(".", "")
      );
    }
  } else {
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < dataKey.length; j++) {
        const key = dataKey[j];

        const element = data[i];

        count += Number.parseInt(
          (element[`${key}`] as string).replaceAll(".", "")
        );
      }
    }
  }

  return count;
};

export const countPostsPropertiesBySocialNetworksType = (
  items: Posts[],
  valueArray: (keyof Posts)[],
  socialNetworksTypes: SocialNetworksType[],
  mediumInvestiment: boolean = false
) => {
  const postsFilteredBySocialNetwork = items.filter((item) =>
    socialNetworksTypes.includes(item.socialNetwork.type)
  );

  const count = postsFilteredBySocialNetwork.reduce((count, item) => {
    for (const postsKey of valueArray) {
      return count + (item[postsKey] as number);
    }
    return count;
  }, 0);

  if (!mediumInvestiment) {
    return count;
  }

  const postsGroupedByCreator = postsFilteredBySocialNetwork.reduce(
    (acc: Record<string, Posts[]>, post) => {
      if (!acc[post.socialNetwork.creatorId]) {
        acc[post.socialNetwork.creatorId] = [];
      }
      acc[post.socialNetwork.creatorId].push(post);
      return acc;
    },
    {}
  );

  const creatorsCount = Object.keys(postsGroupedByCreator).length;

  const result = count / creatorsCount;

  return Number.isNaN(result) ? 0 : result;
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

export const addCPToPostsTable = (creator: any) => {
  const engajamento =
    (Number.parseInt(creator["Interacoes"]) /
      Number.parseInt(
        creator["Impressoes"] === "0" ? "1" : creator["Impressoes"]
      )) *
    100;

  const engajamentoTiktok =
    (Number.parseInt(creator["Interacoes Tiktok"]) /
      Number.parseInt(
        creator["Impressoes Tiktok"] === "0"
          ? "1"
          : creator["Impressoes Tiktok"]
      )) *
    100;

  const engajamentoMedium =
    ((Number.parseInt(creator["Interacoes"]) +
      Number.parseInt(creator["Interacoes Tiktok"])) /
      (Number.parseInt(creator["Impressoes"]) +
        Number.parseInt(creator["Impressoes Tiktok"]))) *
    100;

  const cpe = Number.parseInt(creator["Investimento"]) / engajamento;
  const cpeTiktok =
    Number.parseInt(creator["Investimento"]) /
    (engajamentoTiktok === 0 ? 1 : engajamentoTiktok);

  const cpeMedium =
    Number.parseInt(creator["Investimento"]) / engajamentoMedium;

  const cpc =
    Number.parseInt(creator["Investimento"]) /
    Number.parseInt(creator["Cliques"] === "0" ? "1" : creator["Cliques"]);

  const cpcTiktok =
    Number.parseInt(creator["Investimento"]) /
    Number.parseInt(
      creator["Cliques Tiktok"] === "0" ? "1" : creator["Cliques Tiktok"]
    );

  const cpcMedium =
    Number.parseInt(creator["Investimento"]) /
    (Number.parseInt(creator["Cliques Tiktok"]) +
      Number.parseInt(creator["Cliques"]));

  const ctr =
    (Number.parseInt(creator["Cliques"]) /
      Number.parseInt(
        creator["Impressoes"] === "0" ? "1" : creator["Impressoes"]
      )) *
    100;

  const ctrTiktok =
    (Number.parseInt(creator["Cliques Tiktok"]) /
      Number.parseInt(
        creator["Impressoes Tiktok"] === "0"
          ? "1"
          : creator["Impressoes Tiktok"]
      )) *
    100;

  const cpv =
    Number.parseInt(creator["Investimento"]) /
    Number.parseInt(
      creator["Impressoes"] === "0" ? "1" : creator["Impressoes"]
    );

  const cpvTiktok =
    Number.parseInt(creator["Investimento"]) /
    Number.parseInt(
      creator["Impressoes Tiktok"] === "0" ? "1" : creator["Impressoes Tiktok"]
    );

  const cpvMedium =
    Number.parseInt(creator["Investimento"]) /
    (Number.parseInt(creator["Impressoes Tiktok"]) +
      Number.parseInt(creator["Impressoes"]));

  creator["Engajamento"] =
    (engajamento === +creator["Impressoes"] * 100 ? 0 : engajamento).toFixed(
      2
    ) + "%";
  creator["CPE"] =
    "R$" + (cpe === +creator["Investimento"] ? 0 : cpe).toFixed(2);

  creator["Engajamento Tiktok"] =
    (engajamentoTiktok === +creator["Impressoes Tiktok"] * 100
      ? 0
      : engajamentoTiktok
    ).toFixed(2) + "%";

  creator["Engajamento Media"] =
    (engajamentoMedium === Infinity ? 0 : engajamentoMedium).toFixed(2) + "%";

  creator["CPE Tiktok"] =
    "R$" + (cpeTiktok === +creator["Investimento"] ? 0 : cpeTiktok).toFixed(2);

  creator["CPE Media"] =
    "R$" + (cpeMedium === Infinity ? 0 : cpeMedium).toFixed(2);

  creator["CPC"] =
    "R$" + (cpc === +creator["Investimento"] ? 0 : cpc).toFixed(2);
  creator["CPC Tiktok"] =
    "R$" + (cpcTiktok === +creator["Investimento"] ? 0 : cpcTiktok).toFixed(2);

  creator["CTR"] =
    (ctr === +creator["Cliques"] * 100 ? 0 : ctr).toFixed(2) + "%";
  creator["CTR Tiktok"] =
    (ctrTiktok === +creator["Cliques Tiktok"] * 100 ? 0 : ctrTiktok).toFixed(
      2
    ) + "%";

  creator["CPC Media"] =
    "R$" + (cpcMedium === Infinity ? 0 : cpcMedium).toFixed(2);

  creator["CPV"] = "R$" + cpv.toFixed(2);
  creator["CPV Tiktok"] =
    "R$" + (cpvTiktok === +creator["Investimento"] ? 0 : cpvTiktok).toFixed(2);
  creator["CPV Media"] =
    "R$" + (cpvMedium === Infinity ? 0 : cpvMedium).toFixed(2);
};
