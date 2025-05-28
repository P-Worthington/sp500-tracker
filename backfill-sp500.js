import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import { setTimeout as sleep } from 'timers/promises';

dotenv.config();

const API_KEY = process.env.POLYGON_API_KEY;
const SYMBOL = 'SPY';
const BASE_URL = 'https://api.polygon.io';

const today = new Date();
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(today.getMonth() - 6);

// Format date to YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Generate weekdays only
const getWeekdays = (start, end) => {
  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      days.push(formatDate(new Date(d)));
    }
  }
  return days;
};

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
  const dates = getWeekdays(sixMonthsAgo, today);

  for (const date of dates) {
    await fetchDataForDate(date);
    await sleep(15000); // 15-second delay between calls
  }

  console.log('✅ Finished processing all dates');
};

run();