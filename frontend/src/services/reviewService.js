import api from './api';

const reviewService = {
  addReview: async (reviewData) => {
    const { data } = await api.post('/reviews', reviewData);
    return data;
  },

  editReview: async (id, reviewData) => {
    const { data } = await api.put(`/reviews/${id}`, reviewData);
    return data;
  },

  deleteReview: async (id) => {
    const { data } = await api.delete(`/reviews/${id}`);
    return data;
  },

  getReviews: async (itemId) => {
    const { data } = await api.get(`/reviews/item/${itemId}`);
    return data;
  },
};

export default reviewService;
