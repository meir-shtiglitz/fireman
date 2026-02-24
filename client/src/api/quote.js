import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';

export const sendQuoteEmail = async (emailData) => {
  try {
    const response = await axios.post(`${API_URL}/send-quote-email`, emailData);
    return response.data;
  } catch (error) {
    console.error('Error sending quote email:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createQuote = async (quoteData) => {
  try {
    const response = await axios.post(`${API_URL}/quotes`, quoteData);
    return response.data;
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
};

export const getQuotes = async (search = '', sortBy = 'createdAt', order = 'desc') => {
  try {
    const params = { search, sortBy, order };
    const response = await axios.get(`${API_URL}/quotes`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

export const getQuoteById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/quotes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
};

export const updateQuote = async (id, quoteData) => {
  try {
    const response = await axios.put(`${API_URL}/quotes/${id}`, quoteData);
    return response.data;
  } catch (error) {
    console.error('Error updating quote:', error);
    throw error;
  }
};

export const deleteQuote = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/quotes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting quote:', error);
    throw error;
  }
};

export const duplicateQuote = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/quotes/${id}/duplicate`);
    return response.data;
  } catch (error) {
    console.error('Error duplicating quote:', error);
    throw error;
  }
};
