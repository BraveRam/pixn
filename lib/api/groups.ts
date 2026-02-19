import axios from "../axios";
import type { Image } from "./queries";

export type Group = {
  id: string;
  name: string;
  created_at: string;
};

export const groupsApi = {
  getGroups: async (): Promise<Group[]> => {
    const response = await axios.get("/api/groups");
    return response.data.groups ?? [];
  },

  createGroup: async (name: string): Promise<Group> => {
    const response = await axios.post("/api/groups", { name });
    return response.data.group;
  },

  assignImagesToGroup: async (groupId: string, paths: string[]) => {
    const response = await axios.post("/api/groups/assign", { groupId, paths });
    return response.data as { success: boolean; assigned: number };
  },

  getGroupImages: async (groupId: string): Promise<Image[]> => {
    const response = await axios.get("/api/groups/images", {
      params: { groupId },
    });
    return response.data.images ?? [];
  },
};
