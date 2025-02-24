import api from '../config/api';

const create = (data) => api.post('/guest/create', data);

const findAll = () => api.get('/guest/all');

const findOne = (id) => api.get(`/guest/${id}`);

const getListGuestByUser = (id) => api.get(`/guest/listGuest/${id}`);

const update = (id, data) => api.patch(`/guest/update/${id}`, data);

const deleteGuest = (id) => api.delete(`/guest/delete/${id}`);

const GuestService = {
    create,
    findAll,
    findOne,
    update,
    deleteGuest,
    getListGuestByUser
};

export default GuestService;
