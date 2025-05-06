import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    const companyOptions = await kv.hget(companyId, "options");
    const companyName = await kv.hget(companyId, "companyName");
    const companyStart = await kv.hget(companyId, "start");
    const companyEnd = await kv.hget(companyId, "end");

    if (!companyOptions || !companyName || !companyStart || !companyEnd) {
      return res.status(400).json({ message: 'Company not found' });
    }

    if (companyStart && companyEnd) {
      const now = (new Date()).getTime();
      if (now < Number(companyStart) || now > Number(companyEnd)) {
        return res.status(400).json({ message: 'Company KYC is not active' });
      }
    }

    return res.status(200).json({ options: companyOptions, companyName: companyName });
  } catch (error) {
    console.error('Error fetching company options:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

