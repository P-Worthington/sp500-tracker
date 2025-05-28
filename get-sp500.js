import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;
const TRACK_DATE = '2024-05-24'; // Replace with any date you want to test

const getSP500Data = async () => {
  try {
    const symbol = 'SPY';
    const url = `https://api.polygon.io/v1/open-close/${symbol}/${TRACK_DATE}?adjusted=true&apiKey=${POLYGON_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    console.log(`SPY (S&P 500 ETF) Data for ${TRACK_DATE}:`);
    console.log(`Open: ${data.open}`);
    console.log(`High: ${data.high}`);
    console.log(`Low: ${data.low}`);
    console.log(`Close: ${data.close}`);
  } catch (error) {
    console.error('Error fetching SPY data:', error.response?.data || error.message);
  }
};

getSP500Data();
