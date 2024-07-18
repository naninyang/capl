import type { NextApiRequest, NextApiResponse } from 'next';
import { getStaffData } from '@/utils/apis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);
  const type = req.query.type as string;
  try {
    const data = await getStaffData(id, type);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
