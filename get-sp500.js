import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

// Get yesterday's date in YYYY-MM-DD format
const getYesterdayDate = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
};

const TRACK_DATE = getYesterdayDate();

const getSP500Data = async () => {
  try {
    const symbol = 'SPY';
    const url = `https://api.polygon.io/v1/open-close/${symbol}/${TRACK_DATE}?adjusted=true&apiKey=${POLYGON_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    if (data.status === 'OK') {
      console.log(`SPY (S&P 500 ETF) Data for ${TRACK_DATE}:`);
      console.log(`Open: ${data.open}`);
      console.log(`High: ${data.high}`);
      console.log(`Low: ${data.low}`);
      console.log(`Close: ${data.close}`);

      // Append to CSV
      const row = `${TRACK_DATE},${data.open},${data.high},${data.low},${data.close}\n`;
      fs.appendFileSync('sp500-data.csv', row);
    } else {
      console.warn(`Polygon API returned non-OK status for ${TRACK_DATE}`);
    }
  } catch (error) {
    console.error('Error fetching SPY data:', error.response?.data || error.message);
  }
};

getSP500Data();