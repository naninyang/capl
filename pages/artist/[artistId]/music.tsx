import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { formatDate } from '@/utils/apis';
import { ArtistsData, MusicsData } from '@/types';
import Cover from '../cover';
import MusicList from '@/components/MusicList';
import styles from '@/styles/Artist.module.sass';

export default function MusicPage({
  artistNumber,
  artistData,
  musicData,
  memberData,
  groupData,
}: {
  artistNumber: number;
  artistData: ArtistsData;
  musicData: MusicsData[];
  memberData: ArtistsData[];
  groupData: ArtistsData[];
}) {
  return (
    <main className={styles.artist}>
      <Cover artistNumber={artistNumber} artistData={artistData} groupData={groupData} memberData={memberData} />
      <div className={styles.content}>{musicData.length > 0 && <MusicList musicData={musicData} />}</div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const artistId = context.params?.artistId;
  let artistData = null;
  let artistNumber = null;
  let musicData = [];
  let memberData = [];
  let groupData = [];

  if (artistId && typeof artistId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist/${artistId.substring(14)}/item`);
    const artistResponse = await response.json();
    let createdAt = artistResponse.createdAt;

    if (createdAt && formatDate(createdAt) === artistId.substring(0, 14)) {
      artistNumber = artistResponse.id;
      artistData = artistResponse;

      if (artistResponse.music && Array.isArray(artistResponse.music)) {
        const musicPromises = artistResponse.music.map(async (id: number) => {
          const musicResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/music?id=${id}&type=music`);
          const musicData = await musicResponse.json();
          return musicData;
        });

        musicData = await Promise.all(musicPromises);
      }

      if (artistResponse.member && Array.isArray(artistResponse.member)) {
        const memberPromises = artistResponse.member.map(async (id: number) => {
          const memberResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist?id=${id}`);
          const memberData = await memberResponse.json();
          return memberData;
        });

        memberData = await Promise.all(memberPromises);
      }

      if (artistResponse.group && Array.isArray(artistResponse.group)) {
        const groupPromises = artistResponse.group.map(async (id: number) => {
          const groupResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist?id=${id}`);
          const groupData = await groupResponse.json();
          return groupData;
        });

        groupData = await Promise.all(groupPromises);
      }
    }
  }

  if (!artistData) {
    return {
      props: {
        artistNumber: null,
        artistData: null,
        musicData: [],
        memberData: [],
        groupData: [],
      },
    };
  }

  return {
    props: {
      artistNumber,
      artistData,
      musicData,
      memberData,
      groupData,
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
