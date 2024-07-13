import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AlbumsData, ArtistsData, MusicsData, PlaylistsData, SearchResult } from '@/types';
import Header from '@/components/Header';
import styles from '@/styles/Search.module.sass';
import { MoreLinkIcon, PlayMusicIcon, SearchIcon } from '@/components/Icons';
import Anchor from '@/components/Anchor';
import Image from 'next/image';
import AlbumInfo from '@/components/AlbumInfo';
import ArtistName from '@/components/ArtistName';
import { useLandscapeDesktop, usePortraitDesktop } from '@/components/MediaQuery';

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
                          <Anchor href="/">
                            <strong>{music.title}</strong>
                            <ArtistName artistId={music.artist} />
                          </Anchor>
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
                          <Anchor href="/">
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
                      <Anchor href="">
                        아티스트 <MoreLinkIcon />
                      </Anchor>
                    </h2>
                    <div className={styles.more}>
                      <Anchor href="">더보기</Anchor>
                    </div>
                  </div>
                  {Array.isArray(data.artistData) && (
                    <div className={styles['artist-items']}>
                      {data.artistData.map((artist: ArtistsData) => (
                        <div className={styles.item} key={artist.idx}>
                          <Anchor href="/">
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
                      <Anchor href="">
                        플레이리스트 <MoreLinkIcon />
                      </Anchor>
                    </h2>
                    <div className={styles.more}>
                      <Anchor href="">더보기</Anchor>
                    </div>
                  </div>
                  {Array.isArray(data.playlistData) && (
                    <div className={styles['artist-items']}>
                      {data.playlistData.map((playlist: PlaylistsData) => (
                        <div className={styles.item} key={playlist.idx}>
                          <Anchor href="/">
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
          )}
        </div>
      </main>
    </>
  );
}
