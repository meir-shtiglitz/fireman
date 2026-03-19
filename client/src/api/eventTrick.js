import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const attachTrickToEvent = async (data) => {
    try {
        const response = await axios.post(`${API_URL}/event-tricks`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getEventTricks = async (eventId) => {
    try {
        const response = await axios.get(`${API_URL}/event-tricks/event/${eventId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateEventTrick = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/event-tricks/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeTrickFromEvent = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/event-tricks/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const batchReorderTricks = async (orders) => {
    try {
        const response = await axios.post(`${API_URL}/event-tricks/reorder`, { orders });
        return response.data;
    } catch (error) {
        throw error;
    }
};
