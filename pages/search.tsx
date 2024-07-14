import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AlbumsData, ArtistsData, MusicsData, PlaylistsData, SearchResult } from '@/types';
import Anchor from '@/components/Anchor';
import Header from '@/components/Header';
import AlbumInfo from '@/components/AlbumInfo';
import ArtistName from '@/components/ArtistName';
import MusicList from '@/components/MusicList';
import AlbumList from '@/components/AlbumList';
import ArtistList from '@/components/ArtistList';
import styles from '@/styles/Search.module.sass';
import { useLandscapeDesktop, usePortraitDesktop } from '@/components/MediaQuery';
import { MoreLinkIcon, PlayMusicIcon, SearchIcon } from '@/components/Icons';
import PlaylistList from '@/components/PlaylistList';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const { s } = router.query;
  const [query, setQuery] = useState<string>('');
  const [data, setData] = useState<SearchResult | null>(null);
  const isLandscapeDesktop = useLandscapeDesktop();
  const isPortraitDesktop = usePortraitDesktop();

  useEffect(() => {
    if (q) {
      setQuery(Array.isArray(q) ? q[0] : q);
      fetchData(Array.isArray(q) ? q[0] : q);
    }
  }, [q]);

  const fetchData = async (keyword: string) => {
    if (s) {
      const response = await fetch(`/api/search?keyword=${keyword}&search=${s}`);
      const result: SearchResult = await response.json();
      setData(result);
    } else {
      const response = await fetch(`/api/search?keyword=${keyword}`);
      const result: SearchResult = await response.json();
      setData(result);
    }
  };

  return (
    <>
      <main className={`primary ${styles.search}`}>
        <Header />
        <div className="present">
          <h1>
            <SearchIcon /> ‘{query}’ {s === 'music' && '노래'}
            {s === 'album' && '앨범'}
            {s === 'artist' && '아티스트'}
            {s === 'playlist' && '플레이리스트'} 검색 결과
          </h1>
          {data && (
            <>
              {!s ? (
                <div className={styles.content}>
                  {data.musicData.length > 0 && (
                    <section>
                      <div className={styles.headline}>
                        <h2>
                          <Anchor href={`/search?q=${query}&s=music`}>
                            노래 <MoreLinkIcon />
                          </Anchor>
                        </h2>
                        <div className={styles.more}>
                          <Anchor href={`/search?q=${query}&s=music`}>더보기</Anchor>
                        </div>
                      </div>
                      {Array.isArray(data.musicData) && (
                        <div className={styles['music-items']}>
                          {data.musicData.map((music: MusicsData) => (
                            <div className={styles.item} key={music.idx}>
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
                              <div className={styles.info}>
                                <strong>{music.title}</strong>
                                <ArtistName artistId={music.artist} />
                              </div>
                              <AlbumInfo albumId={music.album} />
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}
                  {data.albumData.length > 0 && (
                    <section>
                      <div className={styles.headline}>
                        <h2>
                          <Anchor href={`/search?q=${query}&s=album`}>
                            앨범 <MoreLinkIcon />
                          </Anchor>
                        </h2>
                        <div className={styles.more}>
                          <Anchor href={`/search?q=${query}&s=album`}>더보기</Anchor>
                        </div>
                      </div>
                      {Array.isArray(data.albumData) && (
                        <div className={styles['album-items']}>
                          {data.albumData.map((album: AlbumsData) => (
                            <div className={styles.item} key={album.idx}>
                              <Anchor href={`/album/${album.idx}`}>
                                <Image
                                  src={`https://cdn.dev1stud.io/capl/album/thm-${album.id}.webp`}
                                  width={260}
                                  height={260}
                                  unoptimized
                                  priority
                                  alt=""
                                />
                                <div className={styles.info}>
                                  <strong>{album.title}</strong>
                                  <ArtistName artistId={album.artist} />
                                </div>
                              </Anchor>
                              {(isLandscapeDesktop || isPortraitDesktop) && (
                                <button type="button">
                                  <i>
                                    <PlayMusicIcon />
                                  </i>
                                  <span>앨범 전곡 재생</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </section>
                  )}
                  {data.artistData.length > 0 && (
                    <section>
                      <div className={styles.headline}>
                        <h2>
                          <Anchor href={`/search?q=${query}&s=artist`}>
                            아티스트 <MoreLinkIcon />
                          </Anchor>
                        </h2>
                        <div className={styles.more}>
                          <Anchor href={`/search?q=${query}&s=artist`}>더보기</Anchor>
                        </div>
                      </div>
                      {Array.isArray(data.artistData) && (
                        <div className={styles['artist-items']}>
                          {data.artistData.map((artist: ArtistsData) => (
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
                    </section>
                  )}
                  {data.playlistData.length > 0 && (
                    <section>
                      <div className={styles.headline}>
                        <h2>
                          <Anchor href={`/search?q=${query}&s=playlist`}>
                            플레이리스트 <MoreLinkIcon />
                          </Anchor>
                        </h2>
                        <div className={styles.more}>
                          <Anchor href={`/search?q=${query}&s=playlist`}>더보기</Anchor>
                        </div>
                      </div>
                      {Array.isArray(data.playlistData) && (
                        <div className={styles['playlist-items']}>
                          {data.playlistData.map((playlist: PlaylistsData) => (
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
                    </section>
                  )}
                </div>
              ) : (
                <>
                  {s === 'music' && <MusicList musicData={data.musicData} />}
                  {s === 'album' && <AlbumList albumData={data.albumData} />}
                  {s === 'artist' && <ArtistList artistData={data.artistData} />}
                  {s === 'playlist' && <PlaylistList playlistData={data.playlistData} />}
                </>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}
