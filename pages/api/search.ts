import type { NextApiRequest, NextApiResponse } from 'next';
import { getAlbumsSearchData, getArtistsSearchData, getMusicsSearchData, getPlaylistsSearchData } from '@/utils/apis';
import { AlbumsData } from '@/types';
import { ArtistsData } from '@/types';
import { MusicsData } from '@/types';
import { PlaylistsData } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const keyword = req.query.keyword as string;
  const search = req.query.search as string;

  try {
    if (!search) {
      const albumData = await getAlbumsSearchData(1, 6, keyword);
      const artistData = await getArtistsSearchData(1, 6, keyword);
      const musicData = await getMusicsSearchData(1, 3, keyword);
      const playlistData = await getPlaylistsSearchData(1, 6, keyword);
      res.status(200).json({ albumData, artistData, musicData, playlistData });
    } else {
      let albumData: AlbumsData[] = [];
      let artistData: ArtistsData[] = [];
      let musicData: MusicsData[] = [];
      let playlistData: PlaylistsData[] = [];
      if (search === 'album') {
        albumData = await getAlbumsSearchData(1, 100, keyword);
        res.status(200).json({ albumData, artistData, musicData, playlistData });
      } else if (search === 'artist') {
        artistData = await getArtistsSearchData(1, 100, keyword);
        res.status(200).json({ albumData, artistData, musicData, playlistData });
      } else if (search === 'music') {
        musicData = await getMusicsSearchData(1, 100, keyword);
        res.status(200).json({ albumData, artistData, musicData, playlistData });
      } else if (search === 'playlist') {
        playlistData = await getPlaylistsSearchData(1, 100, keyword);
        res.status(200).json({ albumData, artistData, musicData, playlistData });
      }
    }
  } catch (error) {
    console.log('Unsupported method');
  }
}
