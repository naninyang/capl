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

export const formatDateInfo = (dateinfo: string) => {
  const date = new Date(dateinfo);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
  return date.toLocaleDateString('ko-KR', options);
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
    relationStaffs: albumData.attributes.relationStaffs,
    credit: albumData.attributes.credit,
    list: albumData.attributes.list,
    genre: albumData.attributes.genre,
    createdAt: albumData.attributes.createdAt,
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
    debut: formatDateInfo(data.attributes.debut),
    birth: formatDateInfo(data.attributes.birth),
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
    agency: artistData.attributes.agency,
    otherName: artistData.attributes.otherName,
    debut: formatDateInfo(artistData.attributes.debut),
    birth: formatDateInfo(artistData.attributes.birth),
    member: artistData.attributes.member,
    group: artistData.attributes.group,
    abbr: artistData.attributes.abbr,
    isSolo: artistData.attributes.isSolo,
    album: artistData.attributes.album,
    music: artistData.attributes.music,
    genre: artistData.attributes.genre,
    compose: artistData.attributes.compose,
    lyrics: artistData.attributes.lyrics,
    createdAt: artistData.attributes.createdAt,
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
    debut: formatDateInfo(data.attributes.debut),
    birth: formatDateInfo(data.attributes.birth),
    member: data.attributes.member,
    group: data.attributes.group,
    abbr: data.attributes.abbr,
    album: data.attributes.album,
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
    genre: musicData.attributes.genre,
  };

  return music;
}

export async function getMusicsTypeData(musicId?: number, type?: string) {
  let filterQuery = `${process.env.STRAPI_URL}/api/capl-musics`;
  if (type !== null) {
    filterQuery += `/${musicId}?filters[$and][0][id][$eq]=${musicId}&filters[$and][1][${type}Id][$null]=false`;
  } else {
    filterQuery += `/${musicId}`;
  }
  const response = await fetch(filterQuery, {
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
    genre: musicData.attributes.genre,
  };

  return music;
}

export async function getMusicsSearchData(page?: number, pageSize?: number, musicTitle?: string, type?: string) {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/capl-musics?sort[0]=id:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}&filters[$and][0][title][$contains]=${musicTitle}&filters[$and][1][${type}Id][$null]=false`,
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
    createdAt: playlistData.attributes.createdAt,
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

export const getStaffData = async (
  staffId: number,
  type: string,
): Promise<{ musics: MusicsData[]; artists: ArtistsData[] }> => {
  const response = await fetch(
    `${process.env.STRAPI_URL}/api/capl-musics?sort[0]=id:desc&pagination[page]=1&pagination[pageSize]=100&filters[${type}][$contains]=${staffId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
      },
    },
  );

  const musicResponse = await response.json();
  const musicData = musicResponse.data;

  const musics: MusicsData[] = musicData
    .filter((data: MusicData) => {
      if (type === 'composer') {
        return data.attributes.composer.includes(staffId);
      } else if (type === 'lyricist') {
        return data.attributes.lyricist.includes(staffId);
      }
      return false;
    })
    .map((data: MusicData) => ({
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

  let artists: ArtistsData[] = [];
  let artistIds = [];

  if (type === 'composer') {
    artistIds = musicData.flatMap((data: MusicData) => data.attributes.composer).filter((id: number) => id === staffId);
  } else {
    artistIds = musicData.flatMap((data: MusicData) => data.attributes.lyricist).filter((id: number) => id === staffId);
  }

  if (artistIds.length > 0) {
    const artistResponse = await fetch(
      `${process.env.STRAPI_URL}/api/capl-artists?sort[0]=id:desc&pagination[page]=1&pagination[pageSize]=100&filters[id][$eq]=${staffId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_BEARER_TOKEN}`,
        },
      },
    );

    const artistResponseJson = await artistResponse.json();
    const artistData = artistResponseJson.data;

    artists = artistData.map((data: ArtistData) => ({
      id: data.id,
      idx: `${formatDate(data.attributes.createdAt)}${data.id}`,
      name: data.attributes.name,
      otherName: data.attributes.otherName,
      debut: formatDateInfo(data.attributes.debut),
      birth: formatDateInfo(data.attributes.birth),
      member: data.attributes.member,
      group: data.attributes.group,
      abbr: data.attributes.abbr,
      album: data.attributes.album,
      isSolo: data.attributes.isSolo,
    }));
  }

  return { musics, artists };
};
