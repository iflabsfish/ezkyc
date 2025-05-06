import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';
import { companyUserKey } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { companyId, address, userId } = req.body;
    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const pipeline = kv.multi();
    pipeline.hset(companyUserKey(companyId), { [userId]: false });
    pipeline.hset(userId, { address: address, companyId: companyId });
    const results = await pipeline.exec();

    if (!results) {
      return res.status(500).json({ message: 'Transaction failed' });
    }

    console.log('saved user', companyId, userId, address);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error saving options:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}