// E:\coins-table\api\offers.ts

import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function (req: VercelRequest, res: VercelResponse): Promise<void> {
  const { amount } = req.query;
  const targetUrl = `https://4jzrf4a39y.us.aircode.run/offers?amount=${amount}`;

  try {
    const response = await axios.get(targetUrl);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching offer results' });
  }
}
