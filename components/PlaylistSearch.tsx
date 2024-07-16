import Image from 'next/image';
import { PlaylistsData } from '@/types';
import Anchor from './Anchor';
import styles from '@/styles/List.module.sass';

type Props = {
  playlistData: PlaylistsData[];
};

const PlaylistSearch = ({ playlistData }: Props) => {
  return (
    <>
      {Array.isArray(playlistData) && (
        <div className={styles['playlist-items']}>
          {playlistData.map((playlist: PlaylistsData) => (
            <div className={styles.item} key={playlist.idx}>
              <Anchor href={`/playlist/${playlist.idx}`}>
                <Image
                  src={`https://cdn.dev1stud.io/capl/playlist/${playlist.id}.svg`}
                  width={260}
                  height={260}
                  unoptimized
                  priority
                  alt=""
                />
              </Anchor>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PlaylistSearch;
