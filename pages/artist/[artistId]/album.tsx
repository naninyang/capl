import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { formatDate } from '@/utils/apis';
import { AlbumsData, ArtistsData } from '@/types';
import Cover from '../cover';
import AlbumList from '@/components/AlbumList';
import styles from '@/styles/Artist.module.sass';

export default function AlbumPage({
  artistNumber,
  artistData,
  albumData,
  memberData,
  groupData,
}: {
  artistNumber: number;
  artistData: ArtistsData;
  albumData: AlbumsData[];
  memberData: ArtistsData[];
  groupData: ArtistsData[];
}) {
  return (
    <main className={styles.artist}>
      <Cover artistNumber={artistNumber} artistData={artistData} groupData={groupData} memberData={memberData} />
      <div className={styles.content}>{albumData.length > 0 && <AlbumList albumData={albumData} />}</div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const artistId = context.params?.artistId;
  let artistData = null;
  let artistNumber = null;
  let albumData = [];
  let memberData = [];
  let groupData = [];

  if (artistId && typeof artistId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist/${artistId.substring(14)}/item`);
    const artistResponse = await response.json();
    let createdAt = artistResponse.createdAt;

    if (createdAt && formatDate(createdAt) === artistId.substring(0, 14)) {
      artistNumber = artistResponse.id;
      artistData = artistResponse;

      if (artistResponse.album && Array.isArray(artistResponse.album)) {
        const albumPromises = artistResponse.album.map(async (id: number) => {
          const albumResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/album?id=${id}`);
          const albumData = await albumResponse.json();
          return albumData;
        });

        albumData = await Promise.all(albumPromises);
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
        albumData: [],
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
      albumData,
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
