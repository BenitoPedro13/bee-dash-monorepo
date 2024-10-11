import { create } from "zustand";
import { setCookie } from "nookies";
import { addCPToPostsTable } from "../utils/utils";

// export const baseApiUrl = "https://api.thatsbee.co";
// export const baseApiUrl = "https://api1.thatsbee.co";
export const baseApiUrl = "http://localhost:3000";

export enum DashboardMode {
  ALL = "all",
  INSTAGRAM = "instagram",
  TIKTOK = "tiktok",
}

export type SocialNetworksType = "INSTAGRAM" | "TIKTOK";

export type PostsType = "FEED" | "STORIES" | "REELS" | "TIKTOK";

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
  Cadastros: string;
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
  CTR: string;
  CPV: string;
  "CPE Tiktok": string;
  "CPC Tiktok": string;
  "CTR Tiktok": string;
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

export interface SocialNetwork {
  id: number;
  type: SocialNetworksType;
  followers: number;
  username: string;
  creatorId: number;
  creator?: Creator;
  createdAt: string;
  updatedAt: string;
}

export interface Creator {
  id: number;
  urlProfilePicture?: string;
  name: string;
  city?: string;
  socialNetworks: SocialNetwork[];
  categories?: { id: string; name: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface PostsPack {
  campaignId: number;
  creator: Creator;
  creatorId: number;
  id: number;
  posts: Posts[];
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  userId: number;
  email: string;
  name: string;
  color: string;
  urlProfilePicture?: string;
  campaigns: Campaign[];
  creators: Record<string, { posts: Posts[]; mediumEngagement: number }>;
}

export interface Campaign {
  id: number;
  name: string;
  byPosts: boolean;
  urlTable?: string;
  imageUrl?: string;
  attachments: Attachment[];
  categories?: { id: string; name: string }[];
  postsPack: PostsPack[];
  campaignOverview?: string;
  finalAnalysis?: string;
  totalFollowers: number;
  mediumEngagement: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Posts {
  id: number;
  type: PostsType;
  impressions: number;
  interactions: number;
  likes: number;
  shares: number;
  comments: number;
  saves: number;
  clicks: number;
  stickerClicks: number;
  linkClicks: number;
  socialNetworkId: number;
  socialNetwork: SocialNetwork;
  postsPackId: number;
  postsPack: PostsPack;
  mediumPrice: number;
  postDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  isAuthenticated: boolean;
  user: User;
}

export type LoginFormData = {
  email: string;
  password: string;
};

interface DataState {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  session: Session;
  mode: DashboardMode;
  dateRange: DashbordDateRange;
  setMode: (mode: DashboardMode) => void;
  setDateRange: (dateRange: DashbordDateRange) => void;
  signIn: (loginFormData: LoginFormData) => Promise<boolean>;
  getUserByToken: (access_token: string) => Promise<boolean>;
  data: InfluencerData;
  postsData: Posts[];
  attachments: Attachment[];
  fetchData: (access_token: string, campaignId: number) => Promise<void>;
  fetchAttachment: (access_token: string, campaignId: number) => Promise<void>;
}

const useDataStore = create<DataState>((set) => ({
  loading: true,
  setLoading: (loading: boolean) => set({ loading }),
  session: {
    isAuthenticated: false,
    user: {
      color: "",
      name: "",
      email: "",
      // campaignName: "",
      userId: NaN,
      // estimatedExecutedInvestment: 0,
      // totalInitialInvestment: 0,
      // createdAt: "",
      // updatedAt: "",
      urlProfilePicture: "",
      campaigns: [],
      creators: {},
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
  postsData: [],
  attachments: [],
  fetchData: async (access_token: string, campaignId: number) => {
    try {
      const response = await fetch(`${baseApiUrl}/csvs/data/${campaignId}`, {
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

      const { posts, updatedAt, data } = await response.json();

      set({
        data: { updatedAt, data: data },
        postsData: posts,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  },
  fetchAttachment: async (access_token: string, campaignId: number) => {
    try {
      const response = await fetch(
        `${baseApiUrl}/attachments/by-campaign/${campaignId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`, // Set the token in the Authorization header
          },
        }
      ); // Replace with your API endpoint

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
