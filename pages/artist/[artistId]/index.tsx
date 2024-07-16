import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { formatDate } from '@/utils/apis';
import { AlbumsData, ArtistsData, MusicsData } from '@/types';
import Anchor from '@/components/Anchor';
import MusicSearch from '@/components/MusicSearch';
import VideoSearch from '@/components/VideoSearch';
import AlbumSearch from '@/components/AlbumSearch';
import ArtistSearch from '@/components/ArtistSearch';
import Cover from '../cover';
import styles from '@/styles/Artist.module.sass';
import { MoreLinkIcon } from '@/components/Icons';

export default function ArtistDetail({
  artistId,
  artistNumber,
  artistData,
  musicData,
  videoData,
  albumData,
  memberData,
  groupData,
}: {
  artistId: number;
  artistNumber: number;
  artistData: ArtistsData;
  musicData: MusicsData[];
  videoData: MusicsData[];
  albumData: AlbumsData[];
  memberData: ArtistsData[];
  groupData: ArtistsData[];
}) {
  return (
    <main className={styles.artist}>
      <Cover artistNumber={artistNumber} artistData={artistData} groupData={groupData} memberData={memberData} />
      <div className={styles.content}>
        {musicData.length > 0 && (
          <section>
            <div className={styles.headline}>
              <h2>
                <Anchor href={`/artist/${artistId}/music`}>
                  노래 <MoreLinkIcon />
                </Anchor>
              </h2>
              <div className={styles.more}>
                <Anchor href={`/artist/${artistId}/music`}>더보기</Anchor>
              </div>
            </div>
            <MusicSearch musicData={musicData} />
          </section>
        )}
        {videoData.length > 0 && (
          <section>
            <div className={styles.headline}>
              <h2>
                <Anchor href={`/artist/${artistId}/video`}>
                  영상 <MoreLinkIcon />
                </Anchor>
              </h2>
              <div className={styles.more}>
                <Anchor href={`/artist/${artistId}/video`}>더보기</Anchor>
              </div>
            </div>
            <VideoSearch videoData={videoData} />
          </section>
        )}
        {albumData.length > 0 && (
          <section>
            <div className={styles.headline}>
              <h2>
                <Anchor href={`/artist/${artistId}/album`}>
                  앨범 <MoreLinkIcon />
                </Anchor>
              </h2>
              <div className={styles.more}>
                <Anchor href={`/artist/${artistId}/album`}>더보기</Anchor>
              </div>
            </div>
            <AlbumSearch albumData={albumData} />
          </section>
        )}
        {memberData.length > 0 && (
          <section>
            <div className={styles.headline}>
              <h2>
                <Anchor href={`/artist/${artistId}/artist`}>
                  멤버 <MoreLinkIcon />
                </Anchor>
              </h2>
              <div className={styles.more}>
                <Anchor href={`/artist/${artistId}/artist`}>더보기</Anchor>
              </div>
            </div>
            <ArtistSearch artistData={memberData} />
          </section>
        )}
        {groupData.length > 0 && (
          <section>
            <div className={styles.headline}>
              <h2>
                <Anchor href={`/artist/${artistId}/artist`}>
                  소속 그룹 <MoreLinkIcon />
                </Anchor>
              </h2>
              <div className={styles.more}>
                <Anchor href={`/artist/${artistId}/?s=artist`}>더보기</Anchor>
              </div>
            </div>
            <ArtistSearch artistData={groupData} />
          </section>
        )}
      </div>
    </main>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const artistId = context.params?.artistId;
  let artistData = null;
  let artistNumber = null;
  let musicData = [];
  let videoData = [];
  let albumData = [];
  let memberData = [];
  let groupData = [];

  if (artistId && typeof artistId === 'string') {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/artist?id=${artistId.substring(14)}`);
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

      if (artistResponse.music && Array.isArray(artistResponse.music)) {
        const musicPromises = artistResponse.music.map(async (id: number) => {
          const musicResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/music?id=${id}&type=video`);
          const videoData = await musicResponse.json();
          return videoData;
        });

        videoData = await Promise.all(musicPromises);
      }

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
        musicData: [],
        videoData: [],
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
      musicData,
      videoData,
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
