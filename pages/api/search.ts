import type { NextApiRequest, NextApiResponse } from 'next';
import { getAlbumsSearchData, getArtistsSearchData, getMusicsSearchData, getPlaylistsSearchData } from '@/utils/apis';
import { AlbumsData, ArtistsData, MusicsData, PlaylistsData } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const keyword = req.query.keyword as string;
  const search = req.query.search as string;

  try {
    if (!search) {
      console.log('aaa');
      const albumData = await getAlbumsSearchData(1, 6, keyword);
      const artistData = await getArtistsSearchData(1, 6, keyword);
      const musicData = await getMusicsSearchData(1, 3, keyword, 'music');
      const videoData = await getMusicsSearchData(1, 6, keyword, 'video');
      const playlistData = await getPlaylistsSearchData(1, 6, keyword);
      console.log('playlistData');
      console.log('playlistData: ', playlistData);
      console.log('albumData');
      console.log('albumData: ', albumData);
      res.status(200).json({ albumData, artistData, musicData, videoData, playlistData });
    } else {
      let albumData: AlbumsData[] = [];
      let artistData: ArtistsData[] = [];
      let musicData: MusicsData[] = [];
      let videoData: MusicsData[] = [];
      let playlistData: PlaylistsData[] = [];
      if (search === 'album') {
        albumData = await getAlbumsSearchData(1, 100, keyword);
        res.status(200).json({ albumData, artistData, musicData, videoData, playlistData });
      } else if (search === 'artist') {
        artistData = await getArtistsSearchData(1, 100, keyword);
        res.status(200).json({ albumData, artistData, musicData, videoData, playlistData });
      } else if (search === 'music') {
        musicData = await getMusicsSearchData(1, 100, keyword, 'music');
        res.status(200).json({ albumData, artistData, musicData, videoData, playlistData });
      } else if (search === 'video') {
        videoData = await getMusicsSearchData(1, 100, keyword, 'video');
        res.status(200).json({ albumData, artistData, musicData, videoData, playlistData });
      } else if (search === 'playlist') {
        playlistData = await getPlaylistsSearchData(1, 100, keyword);
        res.status(200).json({ albumData, artistData, musicData, videoData, playlistData });
      }
    }
  } catch (error) {
    console.error(error);
    console.log('Unsupported method');
  }
}
