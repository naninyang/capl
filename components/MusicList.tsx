import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRecoilState } from 'recoil';
import { currentPlaylistTitleState, playlistState } from '@/recoil/atom';
import { AlbumsData, MusicsData } from '@/types';
import ArtistName from './ArtistName';
import AlbumInfo from './AlbumInfo';
import styles from '@/styles/List.module.sass';
import { useTablet } from './MediaQuery';
import { CheckedCheckboxIcon, EndListIcon, PlayMusicIcon, StartListIcon, UncheckedCheckboxIcon } from './Icons';

type Props = {
  musicData: MusicsData[];
  playlistName?: string;
  albumInfo?: AlbumsData;
};

const MusicList = ({ musicData, playlistName, albumInfo }: Props) => {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [currentPlaylistTitle, setCurrentPlaylistTitle] = useRecoilState(currentPlaylistTitleState);
  const isTablet = useTablet();

  const [selectedMusicIds, setSelectedMusicIds] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const savedMusicIds = localStorage.getItem('music');
      return savedMusicIds ? JSON.parse(savedMusicIds) : [];
    }
    return [];
  });
  const [allSelected, setAllSelected] = useState(false);

  const handleSelectAll = () => {
    setAllSelected((prevAllSelected) => {
      const newAllSelected = !prevAllSelected;
      setSelectedMusicIds(newAllSelected ? musicData.map((music) => music.id) : []);
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

      if (isCurrentlyPlaying) {
        alert('이미 재생중이거나 추가된 플레이리스트입니다');
      } else if (playlist[newTitle] && playlist[newTitle] === newList) {
        setPlaylist((prevPlaylist: any) => {
          const { [newTitle]: value, ...rest } = prevPlaylist;
          return { [newTitle]: value, ...rest };
        });
        setCurrentPlaylistTitle(newTitle);
      } else {
        setPlaylist((prevPlaylist: any) => ({
          ...prevPlaylist,
          [newTitle]: newList,
        }));
        setCurrentPlaylistTitle(newTitle);
      }
    }
  };

  const handlePlayNextOrEnd = () => {
    console.log(selectedMusicIds);
  };

  const router = useRouter();

  return (
    <div className={styles['music-content']}>
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
        <button type="button" onClick={handlePlayNextOrEnd} disabled={selectedMusicIds.length === 0}>
          <StartListIcon />
          바로 다음
        </button>
        <button type="button" onClick={handlePlayNextOrEnd} disabled={selectedMusicIds.length === 0}>
          <EndListIcon />맨 하단
        </button>
      </div>
      <div className={styles.musics}>
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
                <strong>{selectedMusicIds.length.toLocaleString()}</strong>곡 선택됨
              </>
            ) : (
              <>
                <strong>{musicData.length.toLocaleString()}</strong>곡
              </>
            )}
          </div>
        </div>
        {Array.isArray(musicData) && (
          <div className={styles['music-items']}>
            {musicData.map((music: MusicsData) => (
              <div className={styles.item} key={music.idx}>
                <div className={styles.checkbox}>
                  <button type="button" onClick={() => handleSelectOne(music.id)}>
                    {selectedMusicIds.includes(music.id) ? <UncheckedCheckboxIcon /> : <CheckedCheckboxIcon />}
                    <span>{selectedMusicIds.includes(music.id) ? '곡 선택됨' : '선택 안된 곡'}</span>
                  </button>
                </div>
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
                {isTablet ? (
                  <dl>
                    <div>
                      <dt>곡명</dt>
                      <dd>{music.title}</dd>
                    </div>
                    <div>
                      <dt>아티스트</dt>
                      <dd>
                        <ArtistName artistId={music.artist} />
                      </dd>
                    </div>
                    {router.pathname !== '/album/[albumId]' && (
                      <div>
                        <dt>앨범명</dt>
                        <dd>
                          <AlbumInfo albumId={music.album} />
                        </dd>
                      </div>
                    )}
                  </dl>
                ) : (
                  <>
                    <div className={styles.info}>
                      <strong>{music.title}</strong>
                      <ArtistName artistId={music.artist} />
                    </div>
                    <AlbumInfo albumId={music.album} />
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicList;
