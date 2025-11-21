import axios from '../axios';

export interface DeleteImageParams {
    path: string;
}

export interface ToggleFavoriteParams {
    path: string;
}

export const galleryApi = {
    deleteImage: async (params: DeleteImageParams) => {
        const response = await axios.delete('/api/gallery/delete', {
            data: params,
        });
        return response.data;
    },

    toggleFavorite: async (params: ToggleFavoriteParams) => {
        const response = await axios.patch('/api/gallery/favorite', params);
        return response.data;
    },
};
