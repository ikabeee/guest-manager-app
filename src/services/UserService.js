import api from '../config/api';

const create = (data) => api.post('/user/create', data);

const findAll = () => api.get('/user/all');

const findOne = (id) => api.get(`/user/${id}`);

const findById = (id) => api.get(`/user/userById/${id}`);

const update = (id, data) => api.patch(`/user/update/${id}`, data);

const deleteUser = (id) => api.delete(`/user/delete/${id}`);

const UserService = {
    create,
    findAll,
    findOne,
    update,
    deleteUser,
    findById
};

export default UserService;
