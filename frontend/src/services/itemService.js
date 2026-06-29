import api from './api';

const itemService = {
  getItems: async (params = {}) => {
    const { data } = await api.get('/items', { params });
    return data;
  },

  getItemDetails: async (id) => {
    const { data } = await api.get(`/items/${id}`);
    return data;
  },

  createItem: async (formData) => {
    const { data } = await api.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  editItem: async (id, formData) => {
    const { data } = await api.put(`/items/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  deleteItem: async (id) => {
    const { data } = await api.delete(`/items/${id}`);
    return data;
  },

  getCategories: async () => {
    const { data } = await api.get('/categories');
    return data;
  },

  getWishlist: async () => {
    const { data } = await api.get('/wishlist');
    return data;
  },

  toggleWishlist: async (itemId) => {
    const { data } = await api.post('/wishlist/toggle', { itemId });
    return data;
  },
};

export default itemService;
