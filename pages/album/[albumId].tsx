import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { formatDate } from '@/utils/apis';
import { AlbumsData, ArtistsData, MusicsData } from '@/types';
import Anchor from '@/components/Anchor';
import MusicList from '@/components/MusicList';
import styles from '@/styles/Album.module.sass';

export default function AlbumDetail({
  albumNumber,
  albumData,
  artistData,
  relationArtistData,
  musicData,
}: {
  albumNumber: number;
  albumData: AlbumsData;
  artistData: ArtistsData[];
  relationArtistData: ArtistsData[];
  musicData: MusicsData[];
}) {
  return (
    <main className={styles.album}>
      <div className={styles.cover}>
        <div className={styles.background}>
          <Image
            src={`https://cdn.dev1stud.io/capl/album/thm-${albumData.id}.webp`}
            width={230}
            height={230}
            unoptimized
            priority
            alt=""
          />
          <div className={styles.dummy} />
        </div>
        <div className={styles.thumbnail}>
          <Image
            src={`https://cdn.dev1stud.io/capl/album/thm-${albumData.id}.webp`}
            width={230}
            height={230}
            unoptimized
            priority
            alt=""
          />
        </div>
        <div className={styles.info}>
          <dl className={styles.primary}>
            <dt>앨범명</dt>
            <dd>
              <strong>
                {albumData.title} <em>({albumData.release})</em>
              </strong>
            </dd>
            <dt>아티스트</dt>
            <dd>
              {Array.isArray(artistData) &&
                artistData.map((artists: ArtistsData, index: number) => (
                  <React.Fragment key={artists.id}>
                    <Anchor href={`/artist/${artists.idx}`}>
                      {artists.name} {artists.otherName && `(${artists.otherName})`}
                    </Anchor>
                    {index < artistData.length - 1 && ', '}
                  </React.Fragment>
                ))}
            </dd>
          </dl>
          <dl className={styles.secondary}>
            <div>
              <dt>참여 멤버</dt>
              <dd>
                {Array.isArray(relationArtistData) &&
                  relationArtistData.map((artists: ArtistsData, index: number) => (
                    <React.Fragment key={artists.id}>
                      <Anchor href={`/artist/${artists.idx}`}>
                        {artists.name} {artists.otherName && `(${artists.otherName})`}
                      </Anchor>
                      {index < relationArtistData.length - 1 && ', '}
                    </React.Fragment>
                  ))}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className={styles.content}>
        <MusicList musicData={musicData} />
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const albumId = context.params?.albumId;
  let albumData = null;
  let albumNumber = null;
  let musicData = [];
  let artistData = [];
  let relationArtistData = [];

  if (albumId && typeof albumId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/album?id=${albumId.substring(14)}`);
    const albumResponse = await response.json();
    let createdAt = albumResponse.createdAt;

    if (createdAt && formatDate(createdAt) === albumId.substring(0, 14)) {
      albumNumber = albumResponse.id;
      albumData = albumResponse;

      if (albumResponse.list && Array.isArray(albumResponse.list)) {
        const musicPromises = albumResponse.list.map(async (id: number) => {
          const musicResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/music?id=${id}`);
          const musicData = await musicResponse.json();
          return musicData;
        });

        musicData = await Promise.all(musicPromises);
      }

      if (albumResponse.artist && Array.isArray(albumResponse.artist)) {
        const artistPromises = albumResponse.artist.map(async (id: number) => {
          const artistResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist?id=${id}`);
          const artistData = await artistResponse.json();
          return artistData;
        });

        artistData = await Promise.all(artistPromises);
      }

      if (albumResponse.relationArtists && Array.isArray(albumResponse.relationArtists)) {
        const relationArtistPromises = albumResponse.relationArtists.map(async (id: number) => {
          const relationArtistResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist?id=${id}`);
          const relationArtistData = await relationArtistResponse.json();
          return relationArtistData;
        });

        relationArtistData = await Promise.all(relationArtistPromises);
      }
    }
  }

  if (!albumData) {
    return {
      props: {
        albumNumber: null,
        albumData: null,
        musicData: [],
        artistData: [],
        relationArtistData: [],
      },
    };
  }

  return {
    props: {
      albumNumber,
      albumData,
      musicData,
      artistData,
      relationArtistData,
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};
