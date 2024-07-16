import Image from 'next/image';
import { MusicsData } from '@/types';
import ArtistName from './ArtistName';
import AlbumInfo from './AlbumInfo';
import styles from '@/styles/List.module.sass';
import { PlayMusicIcon } from './Icons';

type Props = {
  musicData: MusicsData[];
};

const MusicSearch = ({ musicData }: Props) => {
  return (
    <>
      {Array.isArray(musicData) && (
        <div className={styles['search-music-items']}>
          {musicData.map((music: MusicsData) => (
            <div className={styles.item} key={music.idx}>
              <button type="button">
                <Image
                  src={`https://cdn.dev1stud.io/capl/album/thm-${music.album}.webp`}
                  width={47}
                  height={47}
                  unoptimized
                  priority
                  alt=""
                />
                <i>
                  <PlayMusicIcon />
                </i>
              </button>
              <div className={styles.info}>
                <strong>{music.title}</strong>
              </div>
              <AlbumInfo albumId={music.album} />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default MusicSearch;
