import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { playlistState } from '@/recoil/atom';
import Anchor from '@/components/Anchor';
import Header from '@/components/Header';
import styles from '@/styles/Custom.module.sass';
import { CustomCurrentMenuIcon } from '@/components/Icons';

export default function Custom() {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (playlist) {
      setPlaylist(playlist);
    }
  }, [playlist, setPlaylist]);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <main className={`primary ${styles.custom}`}>
        <Header />
        <div className="present">
          <h1>
            <CustomCurrentMenuIcon /> 재생목록 편집
          </h1>
          <div className={styles.content}>
            {Object.entries(playlist).map(([playlistTitle, playlistData]) => {
              let firstTrack: Number | null = null;
              const parsedData: Number[] = JSON.parse(playlistData as string);
              firstTrack = parsedData[0];
              return (
                <div className={styles.item} key={playlistTitle}>
                  <Anchor href={`/custom/${encodeURIComponent(playlistTitle)}`}>
                    <Image
                      src={`https://cdn.dev1stud.io/capl/album/thm-${firstTrack}.webp`}
                      width={272}
                      height={272}
                      unoptimized
                      priority
                      alt=""
                    />
                    <strong>{playlistTitle}</strong>
                  </Anchor>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}
