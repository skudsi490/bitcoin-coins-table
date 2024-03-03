// E:\coins-table\api\cachedValues.ts

import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';

export default async function (_: VercelRequest, res: VercelResponse): Promise<void> {
  const targetUrl = `https://4jzrf4a39y.us.aircode.run/cachedValues`;

  try {
    const response = await axios.get(targetUrl);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching cached values' });
  }
}
