import { useRecoilState } from 'recoil';
import { currentPlaylistTitleState, currentTrackIndexState, musicModeState, playlistState } from '@/recoil/atom';
import { MusicsData } from '@/types';
import ImageRender from './ImageRender';
import ArtistName from './ArtistName';
import styles from '@/styles/List.module.sass';
import { PlayMusicIcon } from './Icons';

type Props = {
  videoData: MusicsData[];
};

const VideoSearch = ({ videoData }: Props) => {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [currentPlaylistTitle, setCurrentPlaylistTitle] = useRecoilState(currentPlaylistTitleState);
  const [isMusicMode, setIsMusicMode] = useRecoilState(musicModeState);
  const [currentTrackIndex, setCurrentTrackIndex] = useRecoilState(currentTrackIndexState);

  const handlePlayOne = (videoInfo: any) => {
    const newTitle = `'${videoInfo.title}' 외 다수`;
    const newList = JSON.stringify([videoInfo.id]);
    const isCurrentlyPlaying = Object.keys(playlist).includes(newTitle);
    setCurrentPlaylistTitle(newTitle);
    setIsMusicMode(false);
    setCurrentTrackIndex(0);

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
      {Array.isArray(videoData) && (
        <div className={styles['search-video-items']}>
          {videoData.map((video: MusicsData) => (
            <div className={styles.item} key={video.idx}>
              <button type="button" onClick={() => handlePlayOne(video)}>
                <ImageRender imageUrl={`${video.videoId}`} width={260} height={145} type="video" />
                <i>
                  <s>
                    <PlayMusicIcon />
                  </s>
                  <span>영상 재생하기</span>
                </i>
                <div className={styles.info}>
                  <strong>{video.title}</strong>
                  <ArtistName artistId={video.artist} />
                </div>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default VideoSearch;
