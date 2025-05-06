import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { companyId, companyName, options, start, end } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    if (!companyName) {
      return res.status(400).json({ message: 'Company Name is required' });
    }

    if (!options) {
      return res.status(400).json({ message: 'Options are required' });
    }

    const isExists = await kv.hgetall(companyId);
    if (isExists) {
      return res.status(400).json({ message: 'Company already exists' });
    }

    const startTimestamp = start ? new Date(start).getTime() : (new Date()).getTime();
    const endTimestamp = end ? new Date(end).getTime() : (new Date()).getTime() + 3 * 24 * 60 * 60 * 1000;

    console.log('Saving options for company: ', companyName, companyId, options, startTimestamp, endTimestamp);
    await kv.hset(companyId, { companyName: companyName, options: options, start: startTimestamp, end: endTimestamp });

    return res.status(200).json({ message: 'Options saved successfully' });
  } catch (error) {
    console.error('Error saving options:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}