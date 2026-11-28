import axiosClient from './axiosClient'

export const equipmentApi = {
  getEquipments: (params) =>
    axiosClient.get('/equipments', { params }),

  getEquipmentById: (id) =>
    axiosClient.get(`/equipments/${id}`),
}
