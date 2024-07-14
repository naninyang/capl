import Image from 'next/image';
import { ArtistsData } from '@/types';
import Anchor from './Anchor';
import styles from '@/styles/List.module.sass';

type Props = {
  artistData: ArtistsData[];
};

const ArtistList = ({ artistData }: Props) => {
  return (
    <div className={styles['artist-content']}>
      <div className={styles.artists}>
        <div className={styles.count}>
          <strong>{artistData.length.toLocaleString()}</strong>개팀 아티스트
        </div>
        {Array.isArray(artistData) && (
          <div className={styles['artist-items']}>
            {artistData.map((artist: ArtistsData) => (
              <div className={styles.item} key={artist.idx}>
                <Anchor href={`/artist/${artist.idx}`}>
                  <Image
                    src={`https://cdn.dev1stud.io/capl/artist/${artist.id}.webp`}
                    width={260}
                    height={260}
                    unoptimized
                    priority
                    alt=""
                  />
                  <div className={styles.info}>
                    <cite>{artist.name}</cite>
                  </div>
                </Anchor>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistList;
