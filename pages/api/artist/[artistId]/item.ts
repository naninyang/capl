import type { NextApiRequest, NextApiResponse } from 'next';
import { getArtistData } from '@/utils/apis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.artistId);

  try {
    const data = await getArtistData(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
