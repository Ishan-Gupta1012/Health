const axios = require('axios');

const APP_ID = process.env.INFERMEDICA_APP_ID; 
const API_KEY = process.env.INFERMEDICA_API_KEY;

const BASE_URL = 'https://api.infermedica.com/v3';

const headers = {
  'App-Id': APP_ID || '',
  'App-Key': API_KEY || '',
  'Content-Type': 'application/json',
};

const checkCredentials = () => {
    if (!APP_ID || !API_KEY) {
        // NOTE: Make sure to set these in your .env file
        throw new Error("Infermedica API credentials are not configured. Please set INFERMEDICA_APP_ID and INFERMEDICA_API_KEY environment variables.");
    }
}

const parseSymptoms = async (text, age, sex) => {
  checkCredentials();
  try {
    const response = await axios.post(`${BASE_URL}/parse`, { 
        text,
        age: { value: age },
        sex 
    }, { headers });
    return response.data;
  } catch (error) {
    console.error('Infermedica Parse API Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to parse symptoms.');
  }
};

const getDiagnosis = async (diagnosisRequest) => {
  checkCredentials();
  try {
    const response = await axios.post(`${BASE_URL}/diagnosis`, diagnosisRequest, { headers });
    return response.data;
  } catch (error) {
    console.error('Infermedica Diagnosis API Error:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get diagnosis.');
  }
};

module.exports = { parseSymptoms, getDiagnosis };