import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { formatDate } from '@/utils/apis';
import { ArtistsData, MusicsData } from '@/types';
import Anchor from '@/components/Anchor';
import MusicList from '@/components/MusicList';
import styles from '@/styles/Artist.module.sass';

export default function ArtistDetail({
  artistNumber,
  artistData,
  musicData,
  albumData,
  memberData,
  groupData,
}: {
  artistNumber: number;
  artistData: ArtistsData;
  musicData: MusicsData[];
  albumData: MusicsData[];
  memberData: ArtistsData[];
  groupData: ArtistsData[];
}) {
  return (
    <main className={styles.artist}>
      <div className={styles.cover}>
        <div className={styles.background}>
          <Image
            src={`https://cdn.dev1stud.io/capl/artist/${artistNumber}.webp`}
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
            src={`https://cdn.dev1stud.io/capl/artist/${artistNumber}.webp`}
            width={230}
            height={230}
            unoptimized
            priority
            alt=""
          />
        </div>
        <div className={styles.info}>
          <dl className={styles.primary}>
            <dt>아티스트명</dt>
            <dd>
              <strong>
                {artistData.name} {artistData.otherName && `(${artistData.otherName})`}
              </strong>
            </dd>
          </dl>
          <dl className={styles.secondary}>
            {artistData.debut && (
              <div>
                <dt>데뷔</dt>
                <dd>{artistData.debut}</dd>
              </div>
            )}
            {artistData.isSolo ? (
              <>
                {artistData.birth && (
                  <div>
                    <dt>생년월일</dt>
                    <dd>{artistData.birth}</dd>
                  </div>
                )}
                {artistData.group && (
                  <div>
                    <dt>활동그룹</dt>
                    <dd>
                      {Array.isArray(groupData) &&
                        groupData.map((artists: ArtistsData, index: number) => (
                          <React.Fragment key={artists.id}>
                            <Anchor href={`/artist/${artists.idx}`}>
                              {artists.name} {artists.otherName && `(${artists.otherName})`}
                            </Anchor>
                            {index < memberData.length - 1 && ', '}
                          </React.Fragment>
                        ))}
                    </dd>
                  </div>
                )}
              </>
            ) : (
              <>
                {artistData.member && (
                  <div>
                    <dt>멤버</dt>
                    <dd>
                      {Array.isArray(memberData) &&
                        memberData.map((artists: ArtistsData, index: number) => (
                          <React.Fragment key={artists.id}>
                            <Anchor href={`/artist/${artists.idx}`}>
                              {artists.name} {artists.otherName && `(${artists.otherName})`}
                            </Anchor>
                            {index < memberData.length - 1 && ', '}
                          </React.Fragment>
                        ))}
                    </dd>
                  </div>
                )}
              </>
            )}
            {artistData.agency && (
              <div>
                <dt>소속사</dt>
                <dd>{artistData.agency}</dd>
              </div>
            )}
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
  const artistId = context.params?.artistId;
  let artistData = null;
  let artistNumber = null;
  let musicData = [];
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

      if (artistResponse.list && Array.isArray(artistResponse.list)) {
        const musicPromises = artistResponse.list.map(async (id: number) => {
          const musicResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/music?id=${id}`);
          const musicData = await musicResponse.json();
          return musicData;
        });

        musicData = await Promise.all(musicPromises);
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
        artistNumber: null,
        artistData: null,
        musicData: [],
        albumData: [],
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
