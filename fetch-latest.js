import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const API_KEY = process.env.POLYGON_API_KEY;
const SYMBOL = 'SPY';
const BASE_URL = 'https://api.polygon.io';

const dates = ['2025-05-28', '2025-05-29']; // 👈 update here as needed

const fetchDataForDate = async (date) => {
  const url = `${BASE_URL}/v1/open-close/${SYMBOL}/${date}?adjusted=true&apiKey=${API_KEY}`;
  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === 'OK') {
      const { open, high, low, close } = data;
      console.log(`✅ ${date}: ${open},${high},${low},${close}`);
      fs.appendFileSync('sp500-data.csv', `${date},${open},${high},${low},${close}\n`);
    } else {
      console.warn(`❌ ${date} skipped: ${data.message || data.status}`);
    }
  } catch (err) {
    const message = err.response?.data?.error || err.message;
    console.error(`❌ Error on ${date}: ${message}`);
  }
};

const run = async () => {
  for (const date of dates) {
    await fetchDataForDate(date);
  }
};

run();
