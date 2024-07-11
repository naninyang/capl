import type { NextApiRequest, NextApiResponse } from "next";
import { getPlaylistData, getPlaylistsData } from "@/utils/apis";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = Number(req.query.id);
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize);

  if (!id) {
    try {
      const data = await getPlaylistsData(page, pageSize);
      res.status(200).json(data);
    } catch (error) {
      console.log("Unsupported method");
    }
  } else {
    try {
      const data = await getPlaylistData(id);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
}
