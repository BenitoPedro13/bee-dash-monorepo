import { create } from "zustand";
import { setCookie } from "nookies";

export const baseApiUrl = "https://backend.gopark.app.br";
// export const baseApiUrl = "http://localhost:3000";

export enum DashboardMode {
  ALL = "all",
  INSTAGRAM = "instagram",
  TIKTOK = "tiktok",
}

export enum DashbordDateRange {
  ZERO = "0",
  SEVEN = "7",
  FOURTEEN = "14",
  THIRTY = "30",
}

export interface Influencer {
  id: number;
  Influencer: string;
  Username: string;
  Cidade: string;
  "Impacto Bruto": string;
  Investimento: string;
  Posts: string;
  Reels: string;
  Stories: string;
  Feed: string;
  Tiktok: string;
  Impressoes: string;
  Interacoes: string;
  Cliques: string;
  "Video Views": string;
  Engajamento: string;
  "Impacto Bruto Tiktok": string;
  "Engajamento Tiktok": string;
  "Interacoes Tiktok": string;
  "Cliques Tiktok": string;
  "Impressoes Tiktok": string;
  "Url Foto Perfil": string;
  CPE: string;
  CPC: string;
  CPV: string;
  "CPE Tiktok": string;
  "CPC Tiktok": string;
  "CPV Tiktok": string;
  "Engajamento Media": string;
  "CPE Media": string;
  "CPC Media": string;
  "CPV Media": string;
  "Data de Postagem": string;
}

type InfluencerData = {
  data: Influencer[];
  updatedAt: string;
};

export interface Attachment {
  id: number;
  uniqueFilename: string;
  originalFilename: string;
  fileSize: number;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  isAuthenticated: boolean;
  user: {
    color?: string;
    name?: string;
    email?: string;
    campaignName?: string;
    userId?: number;
    estimatedExecutedInvestment?: number;
    totalInitialInvestment?: number;
    urlProfilePicture?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export type LoginFormData = {
  email: string;
  password: string;
};

interface DataState {
  session: Session;
  mode: DashboardMode;
  dateRange: DashbordDateRange;
  setMode: (mode: DashboardMode) => void;
  setDateRange: (dateRange: DashbordDateRange) => void;
  signIn: (loginFormData: LoginFormData) => Promise<boolean>;
  getUserByToken: (access_token: string) => Promise<boolean>;
  data: InfluencerData;
  attachments: Attachment[];
  fetchData: (access_token: string) => Promise<void>;
  fetchAttachment: (access_token: string) => Promise<void>;
}

const useDataStore = create<DataState>((set) => ({
  session: {
    isAuthenticated: false,
    user: {
      color: "",
      name: "",
      email: "",
      campaignName: "",
      userId: NaN,
      estimatedExecutedInvestment: 0,
      totalInitialInvestment: 0,
      createdAt: "",
      updatedAt: "",
      urlProfilePicture: "",
    },
  },
  mode: DashboardMode.ALL,
  dateRange: DashbordDateRange.ZERO,
  setMode: (mode: DashboardMode) => set({ mode }),
  setDateRange: (dateRange: DashbordDateRange) => set({ dateRange }),
  signIn: async (loginFormData: LoginFormData) => {
    try {
      const response = await fetch(`${baseApiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginFormData),
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      setCookie(undefined, "bee-dash-token", data.access_token, {
        maxAge: 60 * 60 * 1, // 1 hora
      });

      set({
        session: {
          isAuthenticated: true,
          user: data.user,
        },
      });

      return true;
      // const router = useRouter();
      // if (router) {
      //   router.push('/dashboard');
      // }
    } catch (error) {
      console.log("sign error: ", error);
      return false;
    }
  },
  getUserByToken: async (access_token: string) => {
    try {
      const response = await fetch(`${baseApiUrl}/auth/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`, // Set the token in the Authorization header
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      set({
        session: {
          isAuthenticated: true,
          user: data.user,
        },
      });

      return true;
    } catch (error) {
      console.log("sign error: ", error);
      return false;
    }
  },
  data: {
    updatedAt: "",
    data: [],
  },
  attachments: [],
  fetchData: async (access_token: string) => {
    try {
      const response = await fetch(`${baseApiUrl}/csvs/data`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`, // Set the token in the Authorization header
        },
      });

      if (!response.ok || response.status === 401) {
        return set((prevState) => {
          return {
            ...prevState,
            session: {
              ...prevState.session,
              isAuthenticated: false,
            },
          };
        });
      }

      const data = await response.json();
      set({ data });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  fetchAttachment: async (access_token: string) => {
    try {
      const response = await fetch(`${baseApiUrl}/attachments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`, // Set the token in the Authorization header
        },
      }); // Replace with your API endpoint

      if (!response.ok || response.status === 401) {
        return set((prevState) => {
          return {
            ...prevState,
            session: {
              ...prevState.session,
              isAuthenticated: false,
            },
          };
        });
      }

      const attachments: Attachment[] = await response.json();
      set({ attachments });
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  },
}));

export default useDataStore;
