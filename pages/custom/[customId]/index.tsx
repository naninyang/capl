import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useRecoilState, useResetRecoilState } from 'recoil';
import {
  carplayModeState,
  currentPlaylistTitleState,
  currentTrackIndexState,
  musicModeState,
  playlistState,
} from '@/recoil/atom';
import ArtistName from '@/components/ArtistName';
import AlbumInfo from '@/components/AlbumInfo';
import customs from '@/styles/Custom.module.sass';
import styles from '@/styles/List.module.sass';
import { CheckedCheckboxIcon, CustomCurrentMenuIcon, TrashIcon, UncheckedCheckboxIcon } from '@/components/Icons';
import { useTablet } from '@/components/MediaQuery';

type PlaylistImage = {
  title: string;
  imageUrl: string;
};

type MusicsData = {
  id: number;
  title: string;
  artist: any[];
  album: number;
};

export default function CustomPlaylistPage() {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [currentPlaylistTitle, setCurrentPlaylistTitle] = useRecoilState(currentPlaylistTitleState);
  const [currentTrackIndex, setCurrentTrackIndex] = useRecoilState(currentTrackIndexState);
  const [isMusicMode, setIsMusicMode] = useRecoilState(musicModeState);
  const [isCarplayMode, setIsCarplayMode] = useRecoilState(carplayModeState);
  const [viewedPlaylist, setViewedPlaylist] = useState<MusicsData[]>([]);
  const [playlistImage, setPlaylistImage] = useState<PlaylistImage | null>(null);
  const [selectedMusicIds, setSelectedMusicIds] = useState<number[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  const router = useRouter();
  const { customId } = router.query;
  const isTablet = useTablet();

  async function fetchPlaylistData(playlistData: number[]) {
    const musicDetails = await Promise.all(
      playlistData.map(async (id: number) => {
        const response = await fetch(`/api/music?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const music = await response.json();

        return {
          id: music.id,
          title: music.title,
          artist: music.artist,
          album: music.album,
        };
      }),
    );

    return musicDetails;
  }

  useEffect(() => {
    const fetchPlaylistImage = async () => {
      if (!customId || typeof customId !== 'string') return;

      const playlistData = playlist[customId];
      if (!playlistData) return;

      const parsedData: Number[] = JSON.parse(playlistData as string);
      const firstTrack = parsedData[0];
      let imageUrl = `https://cdn.dev1stud.io/capl/album/thm-${firstTrack}.webp`;

      try {
        const response = await fetch(`/api/search?title=${encodeURIComponent(customId)}`);
        if (response.ok) {
          const data = await response.json();
          if (data.titleData && data.titleData.length > 0) {
            const { id } = data.titleData[0];
            imageUrl = `https://cdn.dev1stud.io/capl/playlist/${id}.svg`;
          }
        }
      } catch (error) {
        console.error('Error fetching playlist image:', error);
      }

      setPlaylistImage({ title: customId, imageUrl });
    };

    fetchPlaylistImage();
  }, [customId, playlist]);

  useEffect(() => {
    if (customId) {
      const decodedTitle = decodeURIComponent(customId as string);
      const playlistData = JSON.parse(playlist[decodedTitle]);
      fetchPlaylistData(playlistData).then(setViewedPlaylist);
    }
  }, [customId, playlist]);

  const handleSelectAll = () => {
    setAllSelected((prevAllSelected) => {
      const newAllSelected = !prevAllSelected;
      setSelectedMusicIds(newAllSelected ? viewedPlaylist.map((music) => music.id) : []);
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

  const handlePlaylistDelete = () => {
    const confirmDelete = window.confirm('재생목록을 삭제하시면 복구가 안돼요! 그래도 삭제할까요?');
    if (confirmDelete && customId) {
      const updatedPlaylist = { ...playlist };
      delete updatedPlaylist[customId as string];
      setPlaylist(updatedPlaylist);
      setViewedPlaylist([]);

      if (currentPlaylistTitle === customId) {
        if (Object.keys(updatedPlaylist).length > 0) {
          const firstPlaylistTitle = Object.keys(updatedPlaylist)[0];
          setCurrentPlaylistTitle(firstPlaylistTitle);
          setCurrentTrackIndex(0);
        } else {
          resetAllStates();
        }
      }
      router.push('/custom');
    }
  };

  const handleMusicDelete = () => {
    const confirmDelete = window.confirm('노래를 삭제하시면 복구가 안돼요! 그래도 삭제할까요?');
    if (confirmDelete) {
      const updatedViewedPlaylist = viewedPlaylist.filter((music) => !selectedMusicIds.includes(music.id));
      setViewedPlaylist(updatedViewedPlaylist);
      setSelectedMusicIds([]);
      setAllSelected(false);

      const updatedPlaylist = { ...playlist };
      updatedPlaylist[customId as string] = JSON.stringify(updatedViewedPlaylist.map((music) => music.id));
      setPlaylist(updatedPlaylist);

      if (updatedViewedPlaylist.length === 0) {
        delete updatedPlaylist[customId as string];
        setPlaylist(updatedPlaylist);
        resetAllStates();
        router.push('/custom');
      } else if (currentPlaylistTitle !== customId) {
        if (!updatedPlaylist[currentPlaylistTitle]?.includes(viewedPlaylist[currentTrackIndex]?.id)) {
          if (updatedPlaylist[currentPlaylistTitle] && updatedPlaylist[currentPlaylistTitle].length > 0) {
            const newTrackIndex = Math.min(currentTrackIndex, updatedPlaylist[currentPlaylistTitle].length - 1);
            setCurrentTrackIndex(newTrackIndex);
          } else {
            setCurrentTrackIndex(0);
          }
        }
      }
    }
  };

  const handleDeleteOne = (id: number) => {
    const confirmDelete = window.confirm('이 노래를 삭제하시면 복구가 안돼요! 그래도 삭제할까요?');
    if (confirmDelete) {
      const updatedViewedPlaylist = viewedPlaylist.filter((music) => music.id !== id);
      setViewedPlaylist(updatedViewedPlaylist);

      const updatedPlaylist = { ...playlist };
      updatedPlaylist[customId as string] = JSON.stringify(updatedViewedPlaylist.map((music) => music.id));
      setPlaylist(updatedPlaylist);

      if (updatedViewedPlaylist.length === 0) {
        delete updatedPlaylist[customId as string];
        setPlaylist(updatedPlaylist);
        resetAllStates();
        router.push('/custom');
      } else if (currentPlaylistTitle !== customId) {
        if (!updatedPlaylist[currentPlaylistTitle]?.includes(viewedPlaylist[currentTrackIndex]?.id)) {
          if (updatedPlaylist[currentPlaylistTitle] && updatedPlaylist[currentPlaylistTitle].length > 0) {
            const newTrackIndex = Math.min(currentTrackIndex, updatedPlaylist[currentPlaylistTitle].length - 1);
            setCurrentTrackIndex(newTrackIndex);
          } else {
            setCurrentTrackIndex(0);
          }
        }
      }
    }
  };

  const resetAllStates = () => {
    setCurrentPlaylistTitle('');
    setIsMusicMode(true);
    setIsCarplayMode(false);
    setCurrentTrackIndex(0);
    setPlaylist({});
  };

  return (
    <main className={customs['custom-detail']}>
      <div className={customs.cover}>
        <div className={customs.background}>
          {playlistImage && <Image src={playlistImage.imageUrl} width={230} height={230} unoptimized priority alt="" />}
          <div className={customs.dummy} />
        </div>
        <div className={customs.thumbnail}>
          {playlistImage ? (
            <Image src={playlistImage.imageUrl} width={230} height={230} unoptimized priority alt="" />
          ) : (
            <span>썸네일 이미지 불러오는 중</span>
          )}
        </div>
        <div className={customs.info}>
          <dl className={customs.primary}>
            <dt>재생목록 이름</dt>
            <dd>
              <strong>{decodeURIComponent(customId as string)}</strong>
            </dd>
          </dl>
        </div>
      </div>
      <div className={customs.content}>
        <div className={styles['music-content']}>
          <div className={styles.controller}>
            <button type="button" className={styles['all-play']} onClick={handlePlaylistDelete}>
              <TrashIcon />
              재생목록 삭제
            </button>
            <button type="button" onClick={handleMusicDelete}>
              <CustomCurrentMenuIcon />
              선택 곡 삭제
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
                    <strong>{viewedPlaylist.length.toLocaleString()}</strong>곡
                  </>
                )}
              </div>
            </div>
            {Array.isArray(viewedPlaylist) && (
              <div className={styles['music-items']}>
                {viewedPlaylist.map((music: any) => (
                  <div className={styles.item} key={music.idx}>
                    <div className={styles.checkbox}>
                      <button type="button" onClick={() => handleSelectOne(music.id)}>
                        {selectedMusicIds.includes(music.id) ? <UncheckedCheckboxIcon /> : <CheckedCheckboxIcon />}
                        <span>{selectedMusicIds.includes(music.id) ? '곡 선택됨' : '선택 안된 곡'}</span>
                      </button>
                    </div>
                    <button type="button" onClick={() => handleDeleteOne(music.id)}>
                      <Image
                        src={`https://cdn.dev1stud.io/capl/album/thm-${music.album}.webp`}
                        width={47}
                        height={47}
                        unoptimized
                        priority
                        alt=""
                      />
                      <i>
                        <CustomCurrentMenuIcon />
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
      </div>
    </main>
  );
}
