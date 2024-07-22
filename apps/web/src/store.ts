import { create } from "zustand";
import { setCookie } from "nookies";

export const baseApiUrl = "https://dashapi.juicy.space";
// export const baseApiUrl = "http://localhost:3000";

export interface Influencer {
  id: number;
  Influencer: string;
  Username: string;
  Cidade: string;
  Investimento: string;
  Posts: string;
  Stories: string;
  Feed: string;
  Tiktok: string;
  Impressoes: string;
  Interacoes: string;
  Cliques: string;
  "Video Views": string;
  Engajamento: string;
  "Engajamento Tiktok": string;
  "Cliques Tiktok": string;
  "Impressoes Tiktok": string;
  "Url Foto Perfil": string;
  CPE: string;
  CTR: string;
  CPC: string;
  CPV: string;
  createdAt: string;
  updatedAt: string;
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

      setCookie(undefined, "juicy-admin-token", data.access_token, {
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
      const attachments: Attachment[] = await response.json();
      set({ attachments });
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  },
}));

export default useDataStore;
