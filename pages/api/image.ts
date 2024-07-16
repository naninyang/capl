import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const imageUrl = req.query.imageUrl as string;

  try {
    const response = await fetch(imageUrl, {
      method: 'HEAD',
    });

    if (response.ok) {
      res.status(200).json(imageUrl);
    } else {
      res.status(404).json(false);
    }
  } catch (error) {
    res.status(500).json({ exists: false, error: 'Server error' });
  }
}
