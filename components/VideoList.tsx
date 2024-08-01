import { AlbumsData, MusicsData } from '@/types';
import ImageRender from './ImageRender';
import ArtistName from './ArtistName';
import styles from '@/styles/List.module.sass';
import { CheckedCheckboxIcon, EndListIcon, PlayMusicIcon, StartListIcon, UncheckedCheckboxIcon } from './Icons';
import { currentPlaylistTitleState, currentTrackIndexState, musicModeState, playlistState } from '@/recoil/atom';
import { useRecoilState } from 'recoil';
import { useState } from 'react';

type Props = {
  videoData: MusicsData[];
  playlistName?: string;
  albumInfo?: AlbumsData;
};

const VideoList = ({ videoData, playlistName, albumInfo }: Props) => {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [currentPlaylistTitle, setCurrentPlaylistTitle] = useRecoilState(currentPlaylistTitleState);
  const [currentTrackIndex, setCurrentTrackIndex] = useRecoilState(currentTrackIndexState);
  const [isMusicMode, setIsMusicMode] = useRecoilState(musicModeState);

  const [selectedMusicIds, setSelectedMusicIds] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  const handleSelectAll = () => {
    setAllSelected((prevAllSelected) => {
      const newAllSelected = !prevAllSelected;
      setSelectedMusicIds(newAllSelected ? videoData.map((video) => video.id) : []);
      return newAllSelected;
    });
  };

  const handleSelectOne = (id: number) => {
    if (selectedMusicIds.includes(id)) {
      setSelectedMusicIds(selectedMusicIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedMusicIds([...selectedMusicIds, id]);
    }
  };

  const handlePlayAll = () => {
    if (playlistName && albumInfo) {
      const newTitle = playlistName;
      const newList = JSON.stringify(albumInfo.list);
      const isCurrentlyPlaying = Object.keys(playlist).includes(newTitle);
      setCurrentPlaylistTitle(newTitle);
      setIsMusicMode(true);
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
    }
  };

  const handlePlayOne = (videoInfo: any) => {
    const newTitle = `'${videoInfo.title}' 외 다수`;
    const newList = JSON.stringify([videoInfo.id]);
    const isCurrentlyPlaying = Object.keys(playlist).includes(newTitle);
    setCurrentPlaylistTitle(newTitle);
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

  const handlePlayNext = () => {
    setCurrentPlaylistTitle(currentPlaylistTitle);
    if (currentPlaylistTitle && playlist[currentPlaylistTitle]) {
      const currentPlaylist = JSON.parse(playlist[currentPlaylistTitle]);
      const updatedPlaylist = [
        ...currentPlaylist.slice(0, currentTrackIndex + 1),
        ...selectedMusicIds,
        ...currentPlaylist.slice(currentTrackIndex + 1),
      ];
      setPlaylist((prevPlaylist: any) => ({
        ...prevPlaylist,
        [currentPlaylistTitle]: JSON.stringify(updatedPlaylist),
      }));
      alert('곡들이 다음에 재생됩니다.');
    }
  };

  const handlePlayEnd = () => {
    setCurrentPlaylistTitle(currentPlaylistTitle);
    if (currentPlaylistTitle && playlist[currentPlaylistTitle]) {
      const currentPlaylist = JSON.parse(playlist[currentPlaylistTitle]);
      const updatedPlaylist = [...currentPlaylist, ...selectedMusicIds];
      setPlaylist((prevPlaylist: any) => ({
        ...prevPlaylist,
        [currentPlaylistTitle]: JSON.stringify(updatedPlaylist),
      }));
      alert('곡들이 맨 하단에 추가되었습니다.');
    }
  };

  return (
    <div className={styles['video-content']}>
      <div className={styles.controller}>
        {playlistName && (
          <button
            type="button"
            className={styles['all-play']}
            disabled={selectedMusicIds.length > 0}
            onClick={handlePlayAll}
          >
            <PlayMusicIcon />
            전체 재생
          </button>
        )}
        <button type="button" onClick={handlePlayNext} disabled={selectedMusicIds.length === 0}>
          <StartListIcon />
          바로 다음
        </button>
        <button type="button" onClick={handlePlayEnd} disabled={selectedMusicIds.length === 0}>
          <EndListIcon />맨 하단
        </button>
      </div>
      <div className={styles.videos}>
        <div className={styles['checkbox-status']}>
          <div className={styles.checkbox}>
            <button type="button" onClick={handleSelectAll}>
              {allSelected ? <UncheckedCheckboxIcon /> : <CheckedCheckboxIcon />}
              <span>{allSelected ? '현 페이지의 곡 모두 선택됨' : '선택된 곡 없음'}</span>
            </button>
          </div>
          <div className={styles.count}>
            {selectedMusicIds.length > 0 ? (
              <>
                <strong>{selectedMusicIds.length.toLocaleString()}</strong>개 영상 선택됨
              </>
            ) : (
              <>
                <strong>{videoData.length.toLocaleString()}</strong>개 영상
              </>
            )}
          </div>
        </div>
        {Array.isArray(videoData) && (
          <div className={styles['video-items']}>
            {videoData.map((video: MusicsData) => (
              <div className={styles.item} key={video.idx}>
                <div className={styles['item-container']}>
                  <button type="button" onClick={() => handlePlayOne(video)}>
                    <ImageRender imageUrl={`${video.videoId}`} width={260} height={145} type="video" />
                    <i>
                      <s>
                        <PlayMusicIcon />
                      </s>
                      <span>영상 재생하기</span>
                    </i>
                  </button>
                  <div className={styles.info}>
                    <div className={styles.option}>
                      <button type="button" onClick={() => handleSelectOne(video.id)}>
                        {selectedMusicIds.includes(video.id) ? <UncheckedCheckboxIcon /> : <CheckedCheckboxIcon />}
                        <span>{selectedMusicIds.includes(video.id) ? '영상 선택됨' : '선택 안된 영상'}</span>
                      </button>
                      <strong>{video.title}</strong>
                    </div>
                    <ArtistName artistId={video.artist} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoList;
