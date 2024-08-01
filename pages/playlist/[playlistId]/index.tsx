import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { formatDate } from '@/utils/apis';
import { MusicsData, PlaylistsData } from '@/types';
import MusicList from '@/components/MusicList';
import styles from '@/styles/Playlist.module.sass';
import VideoList from '@/components/VideoList';

export default function PlaylistDetail({
  playlistData,
  musicData,
}: {
  playlistData: PlaylistsData;
  musicData: MusicsData[];
}) {
  const musicItems = {
    id: 0,
    idx: '',
    title: '',
    release: 0,
    artist: null,
    relationArtists: null,
    relationStaffs: null,
    credit: null,
    list: playlistData.list,
    genre: null,
    albumNumbering: '',
    isMusicMode: playlistData.isMusicMode,
    createdAt: '',
  };

  return (
    <main className={styles.playlist}>
      <div className={styles.cover}>
        <div className={styles.background}>
          <Image
            src={`https://cdn.dev1stud.io/capl/playlist/${playlistData.id}.svg`}
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
            src={`https://cdn.dev1stud.io/capl/playlist/${playlistData.id}.svg`}
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
              <strong>{playlistData.title}</strong>
            </dd>
            <dt>설명</dt>
            <dd>{playlistData.description}</dd>
          </dl>
        </div>
      </div>
      <div className={styles.content}>
        {playlistData.isMusicMode ? (
          <MusicList musicData={musicData} playlistName={playlistData.title} albumInfo={musicItems} />
        ) : (
          <VideoList videoData={musicData} playlistName={playlistData.title} albumInfo={musicItems} />
        )}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const playlistId = context.params?.playlistId;
  let playlistData = null;
  let playlistNumber = null;
  let musicData = [];

  if (playlistId && typeof playlistId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlist?id=${playlistId.substring(14)}`);
    const playlistResponse = await response.json();
    let createdAt = playlistResponse.createdAt;

    if (createdAt && formatDate(createdAt) === playlistId.substring(0, 14)) {
      playlistNumber = playlistResponse.id;
      playlistData = playlistResponse;

      if (playlistResponse.list && Array.isArray(playlistResponse.list)) {
        const musicPromises = playlistResponse.list.map(async (id: number) => {
          const musicResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/music?id=${id}`);
          const musicData = await musicResponse.json();
          return musicData;
        });

        musicData = await Promise.all(musicPromises);
      }
    }
  }

  if (!playlistData) {
    return {
      props: {
        playlistNumber: null,
        playlistData: null,
        musicData: [],
      },
    };
  }

  return {
    props: {
      playlistNumber,
      playlistData,
      musicData,
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
