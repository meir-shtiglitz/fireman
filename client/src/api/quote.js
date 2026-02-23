import axios from 'axios';

// TODO: Replace with your actual backend URL

export const sendQuoteEmail = async (emailData) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-quote-email`, emailData);
    return response.data;
  } catch (error) {
    console.error('Error sending quote email:', error.response ? error.response.data : error.message);
    throw error;
  }
};
