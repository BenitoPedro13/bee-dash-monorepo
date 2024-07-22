import { LOCAL_API_URL } from "@providers/data-provider";
import axios from "axios";

export const httpClient = axios.create({
  baseURL: LOCAL_API_URL,
});

export interface ICreatorsSearch {
  creator_id: string;
  id: string;
  image: string;
  name: string;
  profile: string;
  state: string;
  postCount?: number;
}

export type ICreatorsSearchResponse = ICreatorsSearch[];

export class CreatorService {
  async searchByCreatorName(input: string) {
    try {
      const res = await httpClient.get(
        `creators/search-by-creator-name/?input=${input}`
      );
      return res.data.rows as ICreatorsSearch[];
    } catch (exeption) {
      console.error(exeption);
    }
  }

  async searchByCreatorId(input: string) {
    try {
      const res = await httpClient.get(
        `creators/search-by-creator-id/?input=${input}`
      );
      return res.data[0] as ICreatorsSearch;
    } catch (exeption) {
      console.error(exeption);
    }
  }
}
