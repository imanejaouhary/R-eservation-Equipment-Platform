import axiosClient from './axiosClient'

export const reservationApi = {
  getReservationsByUser: (userId) =>
    axiosClient.get(`/reservations/user/${userId}`),

  getReservationDetails: (id) =>
    axiosClient.get(`/reservations/${id}/details`),

  createReservation: (data) =>
    axiosClient.post('/reservations', data),

  confirmReservation: (id, paymentData) =>
    axiosClient.post(`/reservations/${id}/confirm`, paymentData),

  cancelReservation: (id) =>
    axiosClient.put(`/reservations/${id}/cancel`),
}
