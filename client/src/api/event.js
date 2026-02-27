import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const createEvent = async (eventData) => {
    try {
        const response = await axios.post(`${API_URL}/events`, eventData);
        return response.data;
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

export const getEvents = async (params = {}) => {
    try {
        const response = await axios.get(`${API_URL}/events`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching events:', error);
        throw error;
    }
};

export const getEventById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/events/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching event:', error);
        throw error;
    }
};

export const updateEvent = async (id, eventData) => {
    try {
        const response = await axios.put(`${API_URL}/events/${id}`, eventData);
        return response.data;
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

export const deleteEvent = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/events/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};
