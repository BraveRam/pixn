import axios from '../axios';

export const uploadApi = {
    uploadImages: async (formData: FormData) => {
        const response = await axios.post('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};
