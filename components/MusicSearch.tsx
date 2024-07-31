import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { currentPlaylistTitleState, playlistState } from '@/recoil/atom';
import { MusicsData } from '@/types';
import AlbumInfo from './AlbumInfo';
import styles from '@/styles/List.module.sass';
import { PlayMusicIcon } from './Icons';

type Props = {
  musicData: MusicsData[];
};

const MusicSearch = ({ musicData }: Props) => {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [currentPlaylistTitle, setCurrentPlaylistTitle] = useRecoilState(currentPlaylistTitleState);

  const handlePlayOne = (musicInfo: any) => {
    const newTitle = `'${musicInfo.title}' 외 다수`;
    const newList = JSON.stringify([musicInfo.id]);
    const isCurrentlyPlaying = Object.keys(playlist).includes(newTitle);
    setCurrentPlaylistTitle(newTitle);

    if (isCurrentlyPlaying) {
      alert('이미 재생중이거나 추가된 플레이리스트입니다');
    } else if (playlist[newTitle] && playlist[newTitle] === newList) {
      setPlaylist((prevPlaylist: any) => {
        const { [newTitle]: value, ...rest } = prevPlaylist;
        return { [newTitle]: value, ...rest };
      });
    } else {
      setPlaylist((prevPlaylist: any) => ({
        ...prevPlaylist,
        [newTitle]: newList,
      }));
    }
  };

  return (
    <>
      {Array.isArray(musicData) && (
        <div className={styles['search-music-items']}>
          {musicData.map((music: MusicsData) => (
            <div className={styles.item} key={music.idx}>
              <button type="button" onClick={() => handlePlayOne(music)}>
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
