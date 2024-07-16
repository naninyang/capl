import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '@/styles/Image.module.sass';
import { PlayMusicIcon, ProfileIcon } from './Icons';

interface ImageRenderProps {
  imageUrl: string;
  width: number;
  height: number;
  type: string;
}

const ImageRender = ({ imageUrl, width, height, type }: ImageRenderProps) => {
  const [data, setData] = useState<string>();
  const fetchData = async () => {
    try {
      if (type !== 'video') {
        const imageApi = `/api/image?imageUrl=${encodeURIComponent(imageUrl)}`;
        const response = await fetch(imageApi);
        const result = await response.json();
        setData(result);
      } else {
        const urls = [
          `https://i.ytimg.com/vi/${imageUrl}/maxresdefault.jpg`,
          `https://i.ytimg.com/vi/${imageUrl}/sddefault.jpg`,
          `https://i.ytimg.com/vi/${imageUrl}/hqdefault.jpg`,
          `https://i.ytimg.com/vi/${imageUrl}/hq720.jpg`,
          `https://i.ytimg.com/vi/${imageUrl}/mqdefault.jpg`,
          `https://i.ytimg.com/vi/${imageUrl}/sddefault.jpg`,
          `https://i.ytimg.com/vi/${imageUrl}/default.jpg`,
          `https://i.ytimg.com/vi/${imageUrl}/missing.jpg`,
        ];

        for (const url of urls) {
          const imageApi = `/api/image?imageUrl=${encodeURIComponent(url)}`;
          const response = await fetch(imageApi);
          const result = await response.json();
          if (result) {
            setData(result);
            break;
          }
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [imageUrl, type]);

  return (
    <>
      {data ? (
        <Image src={data} width={width} height={height} unoptimized priority alt="" />
      ) : (
        <>
          {type === 'artist' && (
            <div className={`${styles.missing} ${styles.artist}`}>
              <ProfileIcon />
            </div>
          )}
          {type === 'video' && (
            <div className={`${styles.missing} ${styles.video}`}>
              <PlayMusicIcon />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ImageRender;
