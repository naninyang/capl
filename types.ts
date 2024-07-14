export interface AlbumsData {
  id: number;
  idx: string;
  title: string;
  release: number;
  artist: any;
  relationArtists: any;
  credit: any;
  list: any;
  createdAt: string;
}

export interface AlbumData {
  id: number;
  idx: string;
  attributes: {
    title: string;
    release: number;
    artist: any;
    relationArtists: any;
    credit: any;
    createdAt: string;
  };
}

export interface ArtistsData {
  id: number;
  idx: string;
  name: string;
  otherName: string;
  debut: string;
  birth: string;
  member: any;
  group: any;
  abbr: any;
  isSolo: boolean;
}

export interface ArtistData {
  id: number;
  idx: string;
  attributes: {
    name: string;
    otherName: string;
    debut: string;
    birth: string;
    member: any;
    group: any;
    abbr: any;
    isSolo: boolean;
    createdAt: string;
  };
}

export interface MusicsData {
  id: number;
  idx: string;
  title: string;
  album: number;
  originMusic: number;
  originAlbum: number;
  artist: any;
  relationArtists: any;
  cover: any;
  composer: any;
  lyricist: any;
  musicId: string;
  videoId: string;
}

export interface MusicData {
  id: number;
  idx: string;
  attributes: {
    title: string;
    album: number;
    originMusic: number;
    originAlbum: number;
    artist: any;
    relationArtists: any;
    cover: any;
    composer: any;
    lyricist: any;
    musicId: string;
    videoId: string;
    createdAt: string;
  };
}

export interface PlaylistsData {
  id: number;
  idx: string;
  title: string;
  description: string;
  list: any;
  tags: any;
}

export interface PlaylistData {
  id: number;
  idx: string;
  attributes: {
    title: string;
    description: string;
    list: any;
    tags: any;
    createdAt: string;
  };
}

export interface SearchResult {
  albumData: AlbumsData[];
  artistData: ArtistsData[];
  musicData: MusicsData[];
  playlistData: PlaylistsData[];
}

export interface AlbumInfoProps {
  albumId: number;
}

export interface ArtistNameProps {
  artistId: any;
}

export interface PlaylistNameProps {
  playlistId: any;
}
