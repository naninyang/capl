import {
  AlbumData,
  AlbumsData,
  ArtistData,
  ArtistsData,
  MusicData,
  MusicsData,
  PlaylistData,
  PlaylistsData,
} from '@/types';

export const formatDate = (datetime: string) => {
  const date = new Date(datetime);
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};

export async function getAlbumsData(page?: number, pageSize?: number) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/capl-albums?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const albumResponse = await response.json();
  const albumData = albumResponse.data;
  const albums: AlbumsData[] = albumData.map((data: AlbumData) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    title: data.attributes.title,
    release: data.attributes.release,
    artist: data.attributes.artist,
    relationArtists: data.attributes.relationArtists,
    credit: data.attributes.credit,
  }));

  return albums;
}

export async function getAlbumData(albumId: number) {
  const response = await fetch(`${process.env.STRAPI_URL}/api/capl-albums/${albumId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
    },
  });
  const albumResponse = await response.json();
  const albumData = albumResponse.data;
  const album: AlbumsData = {
    id: albumData.id,
    idx: `${formatDate(albumData.attributes.createdAt)}${albumData.id}`,
    title: albumData.attributes.title,
    release: albumData.attributes.release,
    artist: albumData.attributes.artist,
    relationArtists: albumData.attributes.relationArtists,
    credit: albumData.attributes.credit,
  };

  return album;
}

export async function getAlbumsSearchData(page?: number, pageSize?: number, albumTitle?: string) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/capl-albums?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[title][$contains]=${albumTitle}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const albumResponse = await response.json();
  const albumData = albumResponse.data;
  const albums: AlbumsData[] = albumData.map((data: AlbumData) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    title: data.attributes.title,
    release: data.attributes.release,
    artist: data.attributes.artist,
    relationArtists: data.attributes.relationArtists,
    credit: data.attributes.credit,
  }));

  return albums;
}

export async function getArtistsData(page?: number, pageSize?: number) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/capl-artists?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const artistResponse = await response.json();
  const artistData = artistResponse.data;
  const artists: ArtistsData[] = artistData.map((data: ArtistData) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    name: data.attributes.name,
    otherName: data.attributes.otherName,
    debut: data.attributes.debut,
    birth: data.attributes.birth,
    member: data.attributes.member,
    group: data.attributes.group,
    abbr: data.attributes.abbr,
    isSolo: data.attributes.isSolo,
  }));

  return artists;
}

export async function getArtistData(artistId: number) {
  const response = await fetch(`${process.env.STRAPI_URL}/api/capl-artists/${artistId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
    },
  });
  const artistResponse = await response.json();
  const artistData = artistResponse.data;
  const artist: ArtistsData = {
    id: artistData.id,
    idx: `${formatDate(artistData.attributes.createdAt)}${artistData.id}`,
    name: artistData.attributes.name,
    otherName: artistData.attributes.otherName,
    debut: artistData.attributes.debut,
    birth: artistData.attributes.birth,
    member: artistData.attributes.member,
    group: artistData.attributes.group,
    abbr: artistData.attributes.abbr,
    isSolo: artistData.attributes.isSolo,
  };

  return artist;
}

export async function getArtistsSearchData(page?: number, pageSize?: number, artistName?: any) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/capl-artists?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[abbr][$contains]=${artistName}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const artistResponse = await response.json();
  const artistData = artistResponse.data;
  const artists: ArtistsData[] = artistData.map((data: ArtistData) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    name: data.attributes.name,
    otherName: data.attributes.otherName,
    debut: data.attributes.debut,
    birth: data.attributes.birth,
    member: data.attributes.member,
    group: data.attributes.group,
    abbr: data.attributes.abbr,
    isSolo: data.attributes.isSolo,
  }));

  return artists;
}

export async function getMusicsData(page?: number, pageSize?: number) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/capl-musics?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const musicResponse = await response.json();
  const musicData = musicResponse.data;
  const musics: MusicsData[] = musicData.map((data: MusicData) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    title: data.attributes.title,
    album: data.attributes.album,
    originMusic: data.attributes.originMusic,
    originAlbum: data.attributes.originAlbum,
    artist: data.attributes.artist,
    relationArtists: data.attributes.relationArtists,
    cover: data.attributes.cover,
    composer: data.attributes.composer,
    lyricist: data.attributes.lyricist,
    musicId: data.attributes.musicId,
    videoId: data.attributes.videoId,
  }));

  return musics;
}

export async function getMusicData(musicId: number) {
  const response = await fetch(`${process.env.STRAPI_URL}/api/capl-musics/${musicId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
    },
  });
  const musicResponse = await response.json();
  const musicData = musicResponse.data;
  const music: MusicsData = {
    id: musicData.id,
    idx: `${formatDate(musicData.attributes.createdAt)}${musicData.id}`,
    title: musicData.attributes.title,
    album: musicData.attributes.album,
    originMusic: musicData.attributes.originMusic,
    originAlbum: musicData.attributes.originAlbum,
    artist: musicData.attributes.artist,
    relationArtists: musicData.attributes.relationArtists,
    cover: musicData.attributes.cover,
    composer: musicData.attributes.composer,
    lyricist: musicData.attributes.lyricist,
    musicId: musicData.attributes.musicId,
    videoId: musicData.attributes.videoId,
  };

  return music;
}

export async function getMusicsSearchData(page?: number, pageSize?: number, musicTitle?: string) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/capl-musics?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[title][$contains]=${musicTitle}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const musicResponse = await response.json();
  const musicData = musicResponse.data;
  const musics: MusicsData[] = musicData.map((data: MusicData) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    title: data.attributes.title,
    album: data.attributes.album,
    originMusic: data.attributes.originMusic,
    originAlbum: data.attributes.originAlbum,
    artist: data.attributes.artist,
    relationArtists: data.attributes.relationArtists,
    cover: data.attributes.cover,
    composer: data.attributes.composer,
    lyricist: data.attributes.lyricist,
    musicId: data.attributes.musicId,
    videoId: data.attributes.videoId,
  }));

  return musics;
}

export async function getPlaylistsData(page?: number, pageSize?: number) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/capl-playlists?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const playlistResponse = await response.json();
  const playlistData = playlistResponse.data;
  const playlists: PlaylistsData[] = playlistData.map((data: PlaylistData) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    title: data.attributes.title,
    description: data.attributes.description,
    list: data.attributes.list,
    tags: data.attributes.tags,
  }));

  return playlists;
}

export async function getPlaylistData(playlistId: number) {
  const response = await fetch(`${process.env.STRAPI_URL}/api/capl-playlists/${playlistId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
    },
  });
  const playlistResponse = await response.json();
  const playlistData = playlistResponse.data;
  const playlist: PlaylistsData = {
    id: playlistData.id,
    idx: `${formatDate(playlistData.attributes.createdAt)}${playlistData.id}`,
    title: playlistData.attributes.title,
    description: playlistData.attributes.description,
    list: playlistData.attributes.list,
    tags: playlistData.attributes.tags,
  };

  return playlist;
}

export async function getPlaylistsSearchData(page?: number, pageSize?: number, playlistTag?: any) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/capl-playlists?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[tags][$contains]=${playlistTag}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );
  const playlistResponse = await response.json();
  const playlistData = playlistResponse.data;
  const playlists: PlaylistsData[] = playlistData.map((data: PlaylistData) => ({
    id: data.id,
    idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
    title: data.attributes.title,
    description: data.attributes.description,
    list: data.attributes.list,
    tags: data.attributes.tags,
  }));

  return playlists;
}
