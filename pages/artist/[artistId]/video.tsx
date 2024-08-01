import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { formatDate } from '@/utils/apis';
import { ArtistsData, MusicsData } from '@/types';
import Cover from '../cover';
import VideoList from '@/components/VideoList';
import styles from '@/styles/Artist.module.sass';

export default function VideoPage({
  artistNumber,
  artistData,
  videoData,
  memberData,
  groupData,
}: {
  artistNumber: number;
  artistData: ArtistsData;
  videoData: MusicsData[];
  memberData: ArtistsData[];
  groupData: ArtistsData[];
}) {
  const videoItems = {
    id: 0,
    idx: '',
    title: '',
    release: 0,
    artist: null,
    relationArtists: null,
    relationStaffs: null,
    credit: null,
    list: artistData.music,
    genre: null,
    albumNumbering: '',
    isMusicMode: true,
    createdAt: '',
  };
  return (
    <main className={styles.artist}>
      <Cover artistNumber={artistNumber} artistData={artistData} groupData={groupData} memberData={memberData} />
      <div className={styles.content}>
        {videoData.length > 0 && (
          <VideoList videoData={videoData} playlistName={`‘${artistData.name}’의 영상`} albumInfo={videoItems} />
        )}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const artistId = context.params?.artistId;
  let artistData = null;
  let artistNumber = null;
  let videoData = [];
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
          const musicResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/music?id=${id}&type=video`);
          const videoData = await musicResponse.json();
          return videoData;
        });

        videoData = await Promise.all(musicPromises);
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
        artistId: null,
        artistNumber: null,
        artistData: null,
        videoData: [],
        memberData: [],
        groupData: [],
      },
    };
  }

  return {
    props: {
      artistId,
      artistNumber,
      artistData,
      videoData,
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
