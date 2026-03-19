import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const getTricks = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/tricks`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getTrickById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/tricks/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTrick = async (trickData) => {
    try {
        const response = await axios.post(`${API_URL}/tricks`, trickData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTrick = async (id, trickData) => {
    try {
        const response = await axios.put(`${API_URL}/tricks/${id}`, trickData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTrick = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/tricks/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
