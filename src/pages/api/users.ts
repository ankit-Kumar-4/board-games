import type { NextApiRequest, NextApiResponse } from 'next';
import knex from '@/lib/knex';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const users = await knex('playing_with_neon').select('*');
      res.status(200).json(users);
    } catch (error) {
      console.error('Error querying database', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
