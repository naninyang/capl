import { PlaylistsData } from '@/types';
import Anchor from './Anchor';
import styles from '@/styles/List.module.sass';
import Image from 'next/image';

type Props = {
  playlistData: PlaylistsData[];
};

const PlaylistList = ({ playlistData }: Props) => {
  return (
    <div className={styles['playlist-content']}>
      <div className={styles.playlists}>
        <div className={styles.count}>
          <strong>{playlistData.length.toLocaleString()}</strong>개 플레이리스트
        </div>
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
      </div>
    </div>
  );
};

export default PlaylistList;
