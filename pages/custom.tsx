import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { playlistState } from '@/recoil/atom';
import Anchor from '@/components/Anchor';
import Header from '@/components/Header';
import styles from '@/styles/Custom.module.sass';
import { CustomCurrentMenuIcon } from '@/components/Icons';

type PlaylistImage = {
  title: string;
  imageUrl: string;
};

export default function Custom() {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [isClient, setIsClient] = useState(false);
  const [playlistImages, setPlaylistImages] = useState<PlaylistImage[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchPlaylistImages = async () => {
      const updatedImages = await Promise.all(
        Object.entries(playlist).map(async ([playlistTitle, playlistData]) => {
          const parsedData: Number[] = JSON.parse(playlistData as string);
          const firstTrack = parsedData[0];
          let imageUrl = `https://cdn.dev1stud.io/capl/album/thm-${firstTrack}.webp`;

          try {
            const response = await fetch(`/api/search?title=${encodeURIComponent(playlistTitle)}`);
            if (response.ok) {
              const data = await response.json();
              if (data.titleData && data.titleData.length > 0) {
                const { id } = data.titleData[0];
                imageUrl = `https://cdn.dev1stud.io/capl/playlist/${id}.svg`;
              }
            }
          } catch (error) {
            console.error('Error fetching playlist image:', error);
          }

          return { title: playlistTitle, imageUrl };
        }),
      );
      setPlaylistImages(updatedImages);
    };

    if (isClient) {
      fetchPlaylistImages();
    }
  }, [playlist, isClient]);

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
            {playlistImages.map(({ title, imageUrl }) => (
              <div className={styles.item} key={title}>
                <Anchor href={`/custom/${encodeURIComponent(title)}`}>
                  <Image src={imageUrl} width={272} height={272} unoptimized priority alt="" />
                  <strong>{title}</strong>
                </Anchor>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
