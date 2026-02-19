import axios from "../axios";

export const shareApi = {
  createShareLink: async (paths: string[]) => {
    const response = await axios.post("/api/share/create", { paths });
    return response.data as {
      shareUrl: string;
      count: number;
      expiresAt: string;
    };
  },
};
