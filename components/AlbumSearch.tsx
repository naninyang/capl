import Image from 'next/image';
import { AlbumsData } from '@/types';
import Anchor from './Anchor';
import ArtistName from './ArtistName';
import styles from '@/styles/List.module.sass';
import { useLandscapeDesktop, usePortraitDesktop } from './MediaQuery';
import { PlayMusicIcon } from './Icons';

type Props = {
  albumData: AlbumsData[];
};

const AlbumSearch = ({ albumData }: Props) => {
  const isLandscapeDesktop = useLandscapeDesktop();
  const isPortraitDesktop = usePortraitDesktop();
  return (
    <>
      {Array.isArray(albumData) && (
        <div className={styles['search-album-items']}>
          {albumData.map((album: AlbumsData) => (
            <div className={styles.item} key={album.idx}>
              <Anchor href={`/album/${album.idx}`}>
                <Image
                  src={`https://cdn.dev1stud.io/capl/album/thm-${album.id}.webp`}
                  width={260}
                  height={260}
                  unoptimized
                  priority
                  alt=""
                />
                <div className={styles.info}>
                  <strong>{album.title}</strong>
                  <ArtistName artistId={album.artist} />
                </div>
              </Anchor>
              {(isLandscapeDesktop || isPortraitDesktop) && (
                <button type="button">
                  <i>
                    <PlayMusicIcon />
                  </i>
                  <span>앨범 전곡 재생</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default AlbumSearch;
