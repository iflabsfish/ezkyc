import { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '@vercel/kv';
import { companyUserKey } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { companyId } = req.body;

    if (!companyId) {
      return res.status(400).json({ message: 'Company ID is required' });
    }

    const uids = await kv.hgetall(companyUserKey(companyId));
    if (!uids) {
      return res.status(200).json({ users: [] });
    }
    const verifiedUids = Object.keys(uids).filter((uid) => uids[uid] === true);
    const users = await Promise.all(verifiedUids.map(async (uid) => {
      const address = await kv.hget(uid, 'address');
      return address;
    }));
    return res.status(200).json({ users });
  } catch (error) {
    console.error('Error saving options:', error);
    return res.status(500).json({ 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}