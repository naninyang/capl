import React, { useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { formatDate } from '@/utils/apis';
import { AlbumsData, ArtistsData, MusicsData } from '@/types';
import Anchor from '@/components/Anchor';
import MusicList from '@/components/MusicList';
import styles from '@/styles/Album.module.sass';
import { MoreLinkIcon } from '@/components/Icons';

export default function AlbumDetail({
  albumData,
  artistData,
  relationArtistData,
  musicData,
}: {
  albumData: AlbumsData;
  artistData: ArtistsData[];
  relationArtistData: ArtistsData[];
  musicData: MusicsData[];
}) {
  const [showAll, setShowAll] = useState(false);
  const creditItems = albumData.credit;
  const displayItems = showAll ? creditItems : creditItems.slice(0, 2);
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
            {albumData.genre && (
              <div>
                <dt>주요장르</dt>
                <dd>
                  {Array.isArray(albumData.genre) &&
                    albumData.genre.map((genre: string, index: number) => (
                      <React.Fragment key={index}>
                        {genre}
                        {index < albumData.genre.length - 1 && ', '}
                      </React.Fragment>
                    ))}
                </dd>
              </div>
            )}
            {displayItems.map((credit: any, index: number) => {
              const key = Object.keys(credit)[0];
              const value = credit[key];
              return (
                <div key={index}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              );
            })}
          </dl>
          {creditItems.length > 2 && (
            <div className={styles.button}>
              <button type="button" onClick={() => setShowAll(!showAll)}>
                {showAll ? '접기' : '더보기'}
                <MoreLinkIcon />
              </button>
            </div>
          )}
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
