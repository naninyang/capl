import { useEffect, useState, useCallback, useRef, MouseEvent, TouchEvent } from 'react';
import Image from 'next/image';
import YouTube, { YouTubePlayer } from 'react-youtube';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { isMobile, isIOS, isAndroid } from 'react-device-detect';
import { useRecoilState } from 'recoil';
import {
  carplayModeState,
  currentPlaylistTitleState,
  currentTrackIndexState,
  musicModeState,
  playlistState,
} from '@/recoil/atom';
import { ArtistData, ArtistsData } from '@/types';
import styles from '@/styles/Music.module.sass';
import 'react-perfect-scrollbar/dist/css/styles.css';
import {
  useLandscapeDesktop,
  useLandscapeMobile,
  usePortraitDesktop,
  usePortraitMobile,
  useTablet,
} from './MediaQuery';
import {
  CarplayIcon,
  CloseIcon,
  CrossIcon,
  MusicIcon,
  NextMusicIcon,
  PauseMusicIcon,
  PlaylistIcon,
  PlayMusicIcon,
  PrevMusicIcon,
  RepeatIcon,
  TrashIcon,
  ViewIcon,
  VolumeIsMutedIcon,
  VolumeNotMutedIcon,
} from './Icons';

type Music = {
  id: number;
  title: string;
  musicId: string;
  videoId: string;
  artist: ArtistsData[];
  composer: ArtistsData[];
  lyricist: ArtistsData[];
  album: {
    id: number;
    title: string;
    release: string;
    albumNumbering: string;
  };
};

export default function Music() {
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [currentPlaylistTitle, setCurrentPlaylistTitle] = useRecoilState(currentPlaylistTitleState);
  const [currentTrackIndex, setCurrentTrackIndex] = useRecoilState(currentTrackIndexState);
  const [isMusicMode, setIsMusicMode] = useRecoilState(musicModeState);
  const [isCarplayMode, setIsCarplayMode] = useRecoilState(carplayModeState);
  const [currentPlaylist, setCurrentPlaylist] = useState<Music[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [isPlaylistDropdown, setIsPlaylistDropdown] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isSingleTrackRepeating, setIsSingleTrackRepeating] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaylistVisible, setIsPlaylistVisible] = useState(false);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [viewedPlaylist, setViewedPlaylist] = useState<Music[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [volume, setVolume] = useState(100);
  const [previousVolume, setPreviousVolume] = useState(100);

  const playerRef = useRef<YouTubePlayer | null>(null);
  const playlistRef = useRef<HTMLUListElement | null>(null);

  const isTablet = useTablet();
  const isLandscapeMobile = useLandscapeMobile();
  const isPortraitMobile = usePortraitMobile();
  const isLandscapeDesktop = useLandscapeDesktop();
  const isPortraitDesktop = usePortraitDesktop();

  const handleClickOutside = (event: Event) => {
    if (playlistRef.current && !playlistRef.current.contains(event.target as Node)) {
      setIsPlaylistDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (!currentTrackIndex) {
      setCurrentTrackIndex(0);
    }
  }, [playlist]);

  const fetchData = async () => {
    const playlistData = JSON.parse(playlist[currentPlaylistTitle]) || [];
    const musicDetails = await Promise.all(
      playlistData.map(async (id: number) => {
        const response = await fetch(`/api/music?id=${id}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const music = await response.json();

        const artistPromises = music.artist.map(async (artistId: number) => {
          const artistResponse = await fetch(`/api/artist?id=${artistId}`);
          if (!artistResponse.ok) {
            throw new Error('Network response was not ok');
          }
          return artistResponse.json() as Promise<ArtistData>;
        });

        const artists = await Promise.all(artistPromises);

        const composerPromises = music.composer.map(async (composerId: number) => {
          const composerResponse = await fetch(`/api/artist?id=${composerId}`);
          if (!composerResponse.ok) {
            throw new Error('Network response was not ok');
          }
          return composerResponse.json() as Promise<ArtistData>;
        });

        const composers = await Promise.all(composerPromises);

        const lyricistPromises = music.lyricist.map(async (lyricistId: number) => {
          const lyricistResponse = await fetch(`/api/artist?id=${lyricistId}`);
          if (!lyricistResponse.ok) {
            throw new Error('Network response was not ok');
          }
          return lyricistResponse.json() as Promise<ArtistData>;
        });

        const lyricists = await Promise.all(lyricistPromises);

        const albumResponse = await fetch(`/api/album?id=${music.album}`);
        const album = await albumResponse.json();

        return {
          id: music.id,
          title: music.title,
          musicId: music.musicId,
          videoId: music.videoId,
          composer: composers.map((composer: ArtistsData) => ({
            id: composer.id,
            name: composer.name,
            otherName: composer.otherName,
          })),
          lyricist: lyricists.map((lyricist: ArtistsData) => ({
            id: lyricist.id,
            name: lyricist.name,
            otherName: lyricist.otherName,
          })),
          artist: artists.map((artist: ArtistsData) => ({
            id: artist.id,
            name: artist.name,
            otherName: artist.otherName,
          })),
          album: {
            id: album.id,
            title: album.title,
            release: album.release,
            albumNumbering: album.albumNumbering,
          },
        };
      }),
    );
    setCurrentPlaylist(musicDetails);
  };

  useEffect(() => {
    setIsCarplayMode(false);
  }, [setIsCarplayMode]);

  useEffect(() => {
    if (currentPlaylistTitle) {
      fetchData();
    }

    if (!currentPlaylistTitle && Object.keys(playlist).length > 0) {
      setCurrentPlaylistTitle(Object.keys(playlist)[0]);
    }

    setIsClient(true);
  }, [currentPlaylistTitle, playlist]);

  const currentTrack = currentPlaylist[currentTrackIndex];
  const videoId = isMusicMode ? currentTrack?.musicId : currentTrack?.videoId || currentTrack?.musicId;

  useEffect(() => {
    if (currentTrack) {
      if (currentTrack.musicId === null) {
        setIsMusicMode(false);
      } else if (currentTrack.videoId === null) {
        setIsMusicMode(true);
      }
    }
  }, [currentTrack]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && !isSeeking) {
        setCurrentTime(playerRef.current.getCurrentTime());
        setDuration(playerRef.current.getDuration());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isSeeking]);

  const handleViewPlaylist = () => {
    if (!selectedPlaylist) return;

    const playlistData = JSON.parse(playlist[selectedPlaylist]);
    const fetchPlaylistData = async () => {
      try {
        const musicDetails = await Promise.all(
          playlistData.map(async (id: number) => {
            const response = await fetch(`/api/music?id=${id}`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const music = await response.json();

            const artistPromises = music.artist.map(async (artistId: number) => {
              const artistResponse = await fetch(`/api/artist?id=${artistId}`);
              if (!artistResponse.ok) {
                throw new Error('Network response was not ok');
              }
              return artistResponse.json() as Promise<ArtistData>;
            });

            const artists = await Promise.all(artistPromises);

            const composerPromises = music.composer.map(async (composerId: number) => {
              const composerResponse = await fetch(`/api/artist?id=${composerId}`);
              if (!composerResponse.ok) {
                throw new Error('Network response was not ok');
              }
              return composerResponse.json() as Promise<ArtistData>;
            });

            const composers = await Promise.all(composerPromises);

            const lyricistPromises = music.lyricist.map(async (lyricistId: number) => {
              const lyricistResponse = await fetch(`/api/artist?id=${lyricistId}`);
              if (!lyricistResponse.ok) {
                throw new Error('Network response was not ok');
              }
              return lyricistResponse.json() as Promise<ArtistData>;
            });

            const lyricists = await Promise.all(lyricistPromises);

            const albumResponse = await fetch(`/api/album?id=${music.album}`);
            const album = await albumResponse.json();

            return {
              id: music.id,
              title: music.title,
              musicId: music.musicId,
              videoId: music.videoId,
              composer: composers.map((composer: ArtistsData) => ({
                id: composer.id,
                name: composer.name,
                otherName: composer.otherName,
              })),
              lyricist: lyricists.map((lyricist: ArtistsData) => ({
                id: lyricist.id,
                name: lyricist.name,
                otherName: lyricist.otherName,
              })),
              artist: artists.map((artist: ArtistsData) => ({
                id: artist.id,
                name: artist.name,
                otherName: artist.otherName,
              })),
              album: {
                id: album.id,
                title: album.title,
                release: album.release,
                albumNumbering: album.albumNumbering,
              },
            };
          }),
        );
        setViewedPlaylist(musicDetails);
      } catch (error) {
        console.error('Error fetching playlist data:', error);
      }
    };

    fetchPlaylistData();
  };

  const handlePlayTrack = (index: number, playlistTitle?: string | null) => {
    setCurrentTrackIndex(index);
    setIsPlaying(false);
    if (selectedPlaylist) {
      setCurrentPlaylist(viewedPlaylist);
      if (playlistTitle !== undefined && playlistTitle !== null) {
        setCurrentPlaylistTitle(playlistTitle);
      }
    } else {
      setCurrentPlaylist(currentPlaylist);
    }
    setIsPlaying(true);
  };

  const handleDeletePlaylist = () => {
    if (!selectedPlaylist) return;
    const confirmDelete = window.confirm('삭제하시면 복구가 안돼요! 그래도 삭제할까요?');
    if (confirmDelete) {
      const newPlaylist = { ...playlist };
      delete newPlaylist[selectedPlaylist];
      setPlaylist(newPlaylist);
      setSelectedPlaylist(null);
      setViewedPlaylist([]);
    }
  };

  const handlePlayerClose = () => {
    setIsPlaylistDropdown(false);
    setIsPlayerOpen(false);
    setIsPlaylistVisible(false);
  };

  const handlePlaylistClose = () => {
    setIsPlaylistDropdown(false);
    setIsPlaylistVisible(false);
  };

  const handleTogglePlaylistVisibility = () => {
    setIsPlaylistDropdown(false);
    if (!isPlayerOpen) {
      setIsPlayerOpen(true);
      setIsPlaylistVisible(true);
    } else {
      setIsPlaylistVisible((prev) => !prev);
    }
  };

  const handleTogglePlayerVisibility = () => {
    setIsPlayerOpen((prev) => !prev);
  };

  const handlePlayPause = () => {
    if (playerRef.current) {
      if (playerRef.current.getPlayerState() === 1) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    }
  };

  const handleToggleRepeat = () => {
    setIsSingleTrackRepeating((prev) => !prev);
  };

  const handleToggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        setVolume(previousVolume);
      } else {
        playerRef.current.mute();
        setPreviousVolume(volume);
        setVolume(0);
      }
      setIsMuted((prev) => !prev);
    }
  };

  const handleNextTrack = useCallback(() => {
    setIsPlaying(false);
    if (currentTrackIndex === currentPlaylist.length - 1) {
      setCurrentTrackIndex(0);
    } else {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }

    if (isIOS) {
      setTimeout(() => {
        setIsPlaying(true);
      }, 1000);
    } else {
      setIsPlaying(true);
    }
  }, [currentTrackIndex, currentPlaylist.length]);

  const handlePrevTrack = () => {
    if (currentTrackIndex === 0) {
      setCurrentTrackIndex(currentPlaylist.length - 1);
    } else {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }

    if (isIOS) {
      setTimeout(() => {
        setIsPlaying(true);
      }, 1000);
    } else {
      setIsPlaying(true);
    }
  };

  const onReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    if (playerRef.current) {
      playerRef.current.setVolume(volume);

      if (isIOS) {
        setIsPlaying(false);
        setTimeout(() => {
          playerRef.current?.playVideo();
        }, 1000);
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const onEnd = () => {
    if (isSingleTrackRepeating) {
      if (playerRef.current) {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
      }
    } else {
      handleNextTrack();
    }
  };

  const onStateChange = (event: { data: number }) => {
    switch (event.data) {
      case -1:
        setIsPlaying(false);
      case 0:
        setIsPlaying(false);
      case 2:
        setIsPlaying(false);
      case 3:
        setIsPlaying(false);
        break;
      case 1:
        setIsPlaying(true);
        break;
      default:
        break;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(seekTime, true);
      setCurrentTime(seekTime);
    }
    setIsSeeking(false);
  };

  const handleSeekingMouse = (event: MouseEvent<HTMLButtonElement>) => {
    if (!playerRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const newSeekTime = (offsetX / rect.width) * duration;

    setSeekTime(newSeekTime);
    setIsPlaying(true);
  };

  const handleSeekingTouch = (event: TouchEvent<HTMLButtonElement>) => {
    if (!playerRef.current) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const touch = event.touches[0];
    const offsetX = touch.clientX - rect.left;
    const newSeekTime = (offsetX / rect.width) * duration;

    setSeekTime(newSeekTime);
    setIsPlaying(true);
  };

  const handleSeekStartMouse = (event: MouseEvent<HTMLButtonElement>) => {
    setIsSeeking(true);
    handleSeekingMouse(event);
  };

  const handleSeekStartTouch = (event: TouchEvent<HTMLButtonElement>) => {
    setIsSeeking(true);
    handleSeekingTouch(event);
  };

  const handleSeekEndMouse = () => {
    setIsSeeking(false);
  };

  const handleSeekEndTouch = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(seekTime, true);
      setCurrentTime(seekTime);
    }
    setIsSeeking(false);
  };

  const handleVolumeChange = (event: MouseEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
    if (!playerRef.current) return;

    let clientX;
    if ('touches' in event) {
      clientX = event.touches[0].clientX;
    } else {
      clientX = event.clientX;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const newVolume = Math.min(Math.max((offsetX / rect.width) * 100, 0), 100);

    setVolume(newVolume);
    playerRef.current.setVolume(newVolume);
    if (newVolume > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const handleVolumeTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    setIsSeeking(true);
    handleVolumeChange(event);
  };

  const handleVolumeTouchMove = (event: TouchEvent<HTMLButtonElement>) => {
    handleVolumeChange(event);
  };

  const handleVolumeTouchEnd = () => {
    setIsSeeking(false);
  };

  const handleToggleMode = () => {
    setIsMusicMode((prev) => !prev);
  };

  useEffect(() => {
    const preventScroll = (e: Event): void => {
      e.preventDefault();
    };
    const preventScrollKeys = (e: KeyboardEvent): void => {
      if (['ArrowUp', 'ArrowDown', 'Space', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.code)) {
        e.preventDefault();
      }
    };
    if (isPlayerOpen) {
      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });
      window.addEventListener('keydown', preventScrollKeys, { passive: false });
    } else {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventScrollKeys);
    }
    return () => {
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
      window.removeEventListener('keydown', preventScrollKeys);
    };
  }, [isPlayerOpen]);

  const renderTrackInfo = (track: Music, current?: string) => (
    <>
      <div className={styles.thumbnail}>
        <Image
          src={`https://cdn.dev1stud.io/capl/album/thm-${track.album.id}.webp`}
          width={47}
          height={47}
          unoptimized
          priority
          alt=""
        />
        {current && currentTrack.album.id === track.album.id && (
          <i>
            <MusicIcon />
            <span>현재 재생중인 곡</span>
          </i>
        )}
      </div>
      <div className={styles.info}>
        <strong>{track.title}</strong>
        <cite>
          {track.artist
            .map((artist: ArtistsData) => `${artist.name}${artist.otherName ? ` (${artist.otherName})` : ''}`)
            .join(', ')}
        </cite>
      </div>
    </>
  );

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={`${styles.music} ${styles.night} ${isLandscapeMobile ? styles.lm : ''} ${isPortraitMobile ? styles.pm : ''} ${isLandscapeDesktop ? styles.ld : ''} ${isPortraitDesktop ? styles.pd : ''} ${isCarplayMode ? styles.cp : ''} ${isPlayerOpen && (isLandscapeMobile || isPortraitMobile || isCarplayMode) ? styles.expented : ''}`}
    >
      {currentTrack && (
        <div className={`${styles['background']} ${isPlayerOpen ? styles['background-open'] : ''}`}>
          <Image
            src={`https://cdn.dev1stud.io/capl/album/ext-${currentTrack.album.id}.webp`}
            width={570}
            height={570}
            unoptimized
            priority
            alt=""
          />
          <div className={styles.dummy} />
        </div>
      )}
      <div className={`${styles['music-player']} ${isPlayerOpen ? styles.open : ''}`}>
        <h2>뮤직 플레이어</h2>
        <div className={styles.option}>
          <div className={styles.carplay}>
            <button
              type="button"
              className={isCarplayMode ? styles.isCarplay : undefined}
              onClick={() => setIsCarplayMode((prev) => !prev)}
            >
              <span>{isCarplayMode ? '카플레이 모드 취소' : '카플레이 모드 전환'}</span>
              {!isTablet && (
                <>
                  <CarplayIcon />
                  <s>
                    <i />
                  </s>
                </>
              )}
            </button>
          </div>
          <div className={styles['musicNvideo']}>
            <ul>
              <li>
                <button
                  type="button"
                  onClick={() => setIsMusicMode(true)}
                  disabled={currentTrack && currentTrack.musicId === null}
                  className={`${styles.isMusic} ${isMusicMode ? styles.current : ''}`}
                >
                  노래
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsMusicMode(false)}
                  disabled={currentTrack && currentTrack.videoId === null}
                  className={`${styles.isVideo} ${isMusicMode ? '' : styles.current}`}
                >
                  동영상
                </button>
              </li>
            </ul>
          </div>
          <div className={styles.close}>
            <button type="button" onClick={handlePlayerClose}>
              <CloseIcon />
              <span>뮤직 플레이어 닫기</span>
            </button>
          </div>
        </div>
        {isPlaylistVisible && (
          <div className={styles.playlist}>
            <div className={styles.headline}>
              <h2>플레이리스트 선택</h2>
              <button type="button" onClick={handlePlaylistClose}>
                <CrossIcon />
                <span>플레이리스트 닫기</span>
              </button>
            </div>
            <div className={styles.select}>
              <button
                type="button"
                className={`${styles.selectbox} ${selectedPlaylist ? styles.selected : ''}`}
                onClick={() => setIsPlaylistDropdown(!isPlaylistDropdown)}
              >
                <strong>{selectedPlaylist || currentPlaylistTitle}</strong>
              </button>
              {isPlaylistDropdown && (
                <ul ref={playlistRef}>
                  {Object.entries(playlist).map(([key]) => (
                    <li key={key}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlaylist(key);
                          setIsPlaylistDropdown(false);
                        }}
                      >
                        {key}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button type="button" className={styles.view} disabled={!selectedPlaylist} onClick={handleViewPlaylist}>
                <ViewIcon />
                <span>선택한 플레이리스트 보기</span>
              </button>
              <button
                type="button"
                className={styles.delete}
                disabled={!selectedPlaylist}
                onClick={handleDeletePlaylist}
              >
                <TrashIcon />
                <span>선택한 플레이리스트 삭제</span>
              </button>
            </div>
            <div className={styles.items}>
              <PerfectScrollbar className={styles['scrollbar-container']}>
                <ul>
                  {viewedPlaylist.length > 0 ? (
                    viewedPlaylist.map((track, index) => (
                      <li
                        key={index}
                        className={currentTrack.album.id === track.album.id ? styles.currentTrack : undefined}
                      >
                        {renderTrackInfo(track, 'current')}
                        <button type="button" onClick={() => handlePlayTrack(index, selectedPlaylist)}>
                          <span>곡 듣기</span>
                        </button>
                      </li>
                    ))
                  ) : (
                    <>
                      {currentPlaylist.map((track, index) => (
                        <li key={index}>
                          {renderTrackInfo(track, 'current')}
                          <button type="button" onClick={() => handlePlayTrack(index)}>
                            <span>곡 듣기</span>
                          </button>
                        </li>
                      ))}
                    </>
                  )}
                </ul>
              </PerfectScrollbar>
            </div>
          </div>
        )}
        {currentTrack && (
          <div className={styles['musicplayer-container']}>
            <div className={styles['mp-visual']}>
              {isMusicMode ? (
                <Image
                  src={`https://cdn.dev1stud.io/capl/album/ext-${currentTrack.album.id}.webp`}
                  width={570}
                  height={570}
                  unoptimized
                  priority
                  alt=""
                />
              ) : (
                <span />
              )}
              <YouTube
                videoId={videoId}
                opts={{
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    modestbranding: 1,
                    rel: 0,
                    disablekb: 0,
                    iv_load_policy: 3,
                  },
                }}
                onEnd={onEnd}
                onReady={onReady}
                onStateChange={onStateChange}
              />
              {!isMusicMode &&
                (isLandscapeMobile ||
                  isPortraitMobile ||
                  (isCarplayMode && (isLandscapeDesktop || isPortraitDesktop))) && (
                  <div className={styles.time}>
                    <dl>
                      <div>
                        <dt>재생된 시간</dt>
                        <dd>{formatTime(currentTime)}</dd>
                        <dt>전체 재생시간</dt>
                        <dd>{duration > 0 ? formatTime(duration) : '0:00'}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              {!isMusicMode && (
                <div className={styles['video-controller']}>
                  <button type="button" onClick={handlePlayPause} className={isPlaying ? styles.isPlaying : undefined}>
                    <div className={styles.dummy} />
                    {isPlaying ? (
                      <>
                        <s>
                          <PauseMusicIcon />
                        </s>
                        <span>영상 일시정지하기</span>
                      </>
                    ) : (
                      <>
                        <s>
                          <PlayMusicIcon />
                        </s>
                        <span>영상 재생하기</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
            <div className={styles['mp-info']}>
              <dl className={styles.primary}>
                <div>
                  <dt>곡명</dt>
                  <dd>{currentTrack.title}</dd>
                </div>
                <div>
                  <dt>아티스트</dt>
                  <dd>
                    {currentTrack.artist
                      .map((artist: ArtistsData) => `${artist.name}${artist.otherName ? ` (${artist.otherName})` : ''}`)
                      .join(', ')}
                  </dd>
                </div>
                <div>
                  <dt>앨범명</dt>
                  <dd>
                    {currentTrack.album.title} ({currentTrack.album.release})
                  </dd>
                </div>
              </dl>
              <dl className={styles.secondary}>
                {isMusicMode &&
                  (isLandscapeMobile ||
                    isPortraitMobile ||
                    (isCarplayMode && (isLandscapeDesktop || isPortraitDesktop))) && (
                    <div>
                      <dt>재생시간</dt>
                      <dd>
                        {formatTime(currentTime)} / {duration > 0 ? formatTime(duration) : '0:00'}
                      </dd>
                    </div>
                  )}
                <div>
                  <dt>작곡</dt>
                  <dd>
                    {currentTrack.composer
                      .map((artist: ArtistsData) => `${artist.name}${artist.otherName ? ` (${artist.otherName})` : ''}`)
                      .join(', ')}
                  </dd>
                </div>
                <div>
                  <dt>작사</dt>
                  <dd>
                    {currentTrack.lyricist
                      .map((artist: ArtistsData) => `${artist.name}${artist.otherName ? ` (${artist.otherName})` : ''}`)
                      .join(', ')}
                  </dd>
                </div>
              </dl>
              {(isLandscapeMobile || isPortraitMobile || isCarplayMode) && (
                <div className={styles['controller-container']}>
                  <div
                    className={`${isMobile || isIOS || isAndroid ? styles.seektiming : styles.seektime} ${styles['seektime-controller']}`}
                  >
                    {isMobile || isIOS || isAndroid ? (
                      <button
                        type="button"
                        onTouchMove={handleSeekingTouch}
                        onTouchStart={handleSeekStartTouch}
                        onTouchEnd={handleSeekEndTouch}
                      >
                        <s>
                          <i
                            style={{
                              width: isSeeking
                                ? `${(seekTime / duration) * 100}%`
                                : `${(currentTime / duration) * 100}%`,
                            }}
                            className={isSeeking ? styles.seeking : undefined}
                          />
                          <span
                            style={{
                              left: isSeeking
                                ? `${(seekTime / duration) * 100}%`
                                : `${(currentTime / duration) * 100}%`,
                            }}
                          >
                            {isSeeking && <strong>{formatTime(seekTime)}</strong>}
                          </span>
                        </s>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onMouseMove={handleSeekingMouse}
                        onMouseEnter={handleSeekStartMouse}
                        onMouseLeave={handleSeekEndMouse}
                        onClick={handleSeek}
                      >
                        <s>
                          <i
                            style={{
                              width: isSeeking
                                ? `${(seekTime / duration) * 100}%`
                                : `${(currentTime / duration) * 100}%`,
                            }}
                            className={isSeeking ? styles.seeking : undefined}
                          />
                          {isSeeking && (
                            <span
                              style={{
                                left: `${(seekTime / duration) * 100}%`,
                              }}
                            >
                              <strong>{formatTime(seekTime)}</strong>
                            </span>
                          )}
                        </s>
                      </button>
                    )}
                  </div>
                  <div className={styles.repeat}>
                    <button
                      type="button"
                      onClick={handleToggleRepeat}
                      className={isSingleTrackRepeating ? styles.all : undefined}
                    >
                      <RepeatIcon />
                      <span>{isSingleTrackRepeating ? '재생목록 모든곡 반복하기' : '현재곡 반복하기'}</span>
                    </button>
                  </div>
                  <div className={styles.controller}>
                    <button type="button" className={styles.side} onClick={handlePrevTrack}>
                      <PrevMusicIcon />
                      <span>이전곡 재생</span>
                    </button>
                    <button type="button" className={styles.play} onClick={handlePlayPause}>
                      {isPlaying ? (
                        <>
                          <PauseMusicIcon />
                          <span>일시 정지하기</span>
                        </>
                      ) : (
                        <>
                          <PlayMusicIcon />
                          <span>계속 재생하기</span>
                        </>
                      )}
                    </button>
                    <button type="button" className={styles.side} onClick={handleNextTrack}>
                      <NextMusicIcon />
                      <span>다음곡 재생</span>
                    </button>
                  </div>
                  <div className={styles.playlist}>
                    <button
                      type="button"
                      className={isPlaylistVisible ? styles.visible : undefined}
                      onClick={handleTogglePlaylistVisibility}
                    >
                      <PlaylistIcon />
                      <span>{isPlaylistVisible ? '재생목록 숨기기' : '재생목록 보기'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={`${styles['music-bar']} ${isPlayerOpen ? styles['musicbar-open'] : ''}`}>
        {Object.keys(playlist).length > 0 && currentPlaylistTitle !== '' ? (
          <div className={styles['music-container']}>
            <div
              className={`${isMobile || isIOS || isAndroid ? styles.seektiming : styles.seektime} ${styles['seektime-controller']}`}
            >
              {isMobile || isIOS || isAndroid ? (
                <button
                  type="button"
                  onTouchMove={handleSeekingTouch}
                  onTouchStart={handleSeekStartTouch}
                  onTouchEnd={handleSeekEndTouch}
                >
                  <s>
                    <i
                      style={{
                        width: isSeeking ? `${(seekTime / duration) * 100}%` : `${(currentTime / duration) * 100}%`,
                      }}
                      className={isSeeking ? styles.seeking : undefined}
                    />
                    <span
                      style={{
                        left: isSeeking ? `${(seekTime / duration) * 100}%` : `${(currentTime / duration) * 100}%`,
                      }}
                    >
                      {isSeeking && <strong>{formatTime(seekTime)}</strong>}
                    </span>
                  </s>
                </button>
              ) : (
                <button
                  type="button"
                  onMouseMove={handleSeekingMouse}
                  onMouseEnter={handleSeekStartMouse}
                  onMouseLeave={handleSeekEndMouse}
                  onClick={handleSeek}
                >
                  <s>
                    <i
                      style={{
                        width: isSeeking ? `${(seekTime / duration) * 100}%` : `${(currentTime / duration) * 100}%`,
                      }}
                      className={isSeeking ? styles.seeking : undefined}
                    />
                    {isSeeking && (
                      <span style={{ left: `${(seekTime / duration) * 100}%` }}>
                        <strong>{formatTime(seekTime)}</strong>
                      </span>
                    )}
                  </s>
                </button>
              )}
            </div>
            <div className={styles.songsong}>
              <div className={styles['music-info']}>
                <div className={styles['info-container']}>
                  {currentTrack ? (
                    <>
                      <button type="button" onClick={handleTogglePlayerVisibility}>
                        <span>{isPlayerOpen ? '플레이어 숨기기' : '플레이어 보기'}</span>
                      </button>
                      {renderTrackInfo(currentTrack)}
                    </>
                  ) : (
                    <>
                      <div className={styles.thumbnail}>
                        <MusicIcon />
                      </div>
                      <div className={styles.info}>
                        <strong>노래 불러오는 중</strong>
                        <cite>잠시만 기다려 주세요</cite>
                      </div>
                    </>
                  )}
                </div>
                <div className={styles.repeat}>
                  <button
                    type="button"
                    onClick={handleToggleRepeat}
                    className={isSingleTrackRepeating ? styles.all : undefined}
                  >
                    <RepeatIcon />
                    <span>{isSingleTrackRepeating ? '재생목록 모든곡 반복하기' : '현재곡 반복하기'}</span>
                  </button>
                </div>
                {isTablet && (
                  <div className={styles.time}>
                    <dl>
                      <div>
                        <dt>재생된 시간</dt>
                        <dd>{formatTime(currentTime)}</dd>
                      </div>
                      <div>
                        <dt>전체 재생시간</dt>
                        <dd>{duration > 0 ? formatTime(duration) : '0:00'}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
              <div className={styles['music-controller']}>
                <button type="button" className={styles.side} onClick={handlePrevTrack}>
                  <PrevMusicIcon />
                  <span>이전곡 재생</span>
                </button>
                <button type="button" className={styles.play} onClick={handlePlayPause}>
                  {isPlaying ? (
                    <>
                      <PauseMusicIcon />
                      <span>일시 정지하기</span>
                    </>
                  ) : (
                    <>
                      <PlayMusicIcon />
                      <span>계속 재생하기</span>
                    </>
                  )}
                </button>
                <button type="button" className={styles.side} onClick={handleNextTrack}>
                  <NextMusicIcon />
                  <span>다음곡 재생</span>
                </button>
              </div>
              <div className={styles['music-playlist']}>
                {isTablet && (
                  <div className={styles.volume}>
                    <button type="button" className={isMuted ? styles.muted : undefined} onClick={handleToggleMute}>
                      {isMuted ? (
                        <>
                          <VolumeIsMutedIcon />
                          <span>음소거 취소하기</span>
                        </>
                      ) : (
                        <>
                          <VolumeNotMutedIcon />
                          <span>음소거 하기</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className={styles.level}
                      onClick={handleVolumeChange}
                      onMouseMove={handleVolumeChange}
                      onTouchStart={handleVolumeTouchStart}
                      onTouchMove={handleVolumeTouchMove}
                      onTouchEnd={handleVolumeTouchEnd}
                    >
                      <s>
                        <i style={{ width: `${volume}%` }} />
                      </s>
                    </button>
                  </div>
                )}
                <div className={styles.playlist}>
                  <button
                    type="button"
                    className={isPlaylistVisible ? styles.visible : undefined}
                    onClick={handleTogglePlaylistVisibility}
                  >
                    <PlaylistIcon />
                    <span>{isPlaylistVisible ? '재생목록 숨기기' : '재생목록 보기'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.started}>
            <button type="button">
              <div className={styles['music-info']}>
                <div className={styles.thumbnail}>
                  <MusicIcon />
                </div>
                <div className={styles.info}>
                  <strong>어떤 노래를 듣고 싶으세요?</strong>
                  <cite>밤과 어울리는 곡을 추천해 드려요</cite>
                </div>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
