import { ArtistsData } from '@/types';
import Anchor from './Anchor';
import ImageRender from './ImageRender';
import styles from '@/styles/List.module.sass';

type Props = {
  artistData: ArtistsData[];
};

const ArtistSearch = ({ artistData }: Props) => {
  return (
    <>
      {Array.isArray(artistData) && (
        <div className={styles['artist-items']}>
          {artistData.map((artist: ArtistsData) => (
            <div className={styles.item} key={artist.idx}>
              <Anchor href={`/artist/${artist.idx}`}>
                <ImageRender
                  imageUrl={`https://cdn.dev1stud.io/capl/artist/${artist.id}.webp`}
                  width={260}
                  height={260}
                  type="artist"
                />
                <div className={styles.info}>
                  <cite>{artist.name}</cite>
                </div>
              </Anchor>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ArtistSearch;
