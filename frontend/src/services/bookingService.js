import api from './api';

const bookingService = {
  bookItem: async (bookingData) => {
    const { data } = await api.post('/bookings', bookingData);
    return data;
  },

  cancelBooking: async (id) => {
    const { data } = await api.patch(`/bookings/${id}/cancel`);
    return data;
  },

  getBookings: async (role) => {
    const { data } = await api.get('/bookings', { params: { role } });
    return data;
  },

  approveBooking: async (id) => {
    const { data } = await api.patch(`/bookings/${id}/approve`);
    return data;
  },

  rejectBooking: async (id) => {
    const { data } = await api.patch(`/bookings/${id}/reject`);
    return data;
  },
};

export default bookingService;
