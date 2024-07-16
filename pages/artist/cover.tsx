import React from 'react';
import Image from 'next/image';
import { ArtistsData } from '@/types';
import Anchor from '@/components/Anchor';
import styles from '@/styles/Artist.module.sass';

type Props = {
  artistNumber: number;
  artistData: ArtistsData;
  groupData: ArtistsData[];
  memberData: ArtistsData[];
};

const Cover = ({ artistNumber, artistData, groupData, memberData }: Props) => {
  return (
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
  );
};

export default Cover;
