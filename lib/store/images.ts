import { create } from "zustand";

export type Image = {
  path: string;
  signedUrl: string;
  favorite: boolean;
};

export type ImagesStore = {
  initialImages: Image[];
  setImages: (images: Image[]) => void;
  removeImage: (path: string) => void;
  toggleFavorite: (path: string) => void;
};

export const useImagesStore = create<ImagesStore>((set) => ({
  initialImages: [],
  setImages: (initialImages: Image[]) => set({ initialImages }),
  removeImage: (path: string) =>
    set((state) => ({
      initialImages: state.initialImages.filter((img) => img.path !== path),
    })),
  toggleFavorite: (path: string) =>
    set((state) => ({
      initialImages: state.initialImages.map((img) =>
        img.path === path ? { ...img, favorite: !img.favorite } : img
      ),
    })),
}));
