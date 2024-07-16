import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { SearchResult } from '@/types';
import Anchor from '@/components/Anchor';
import Header from '@/components/Header';
import MusicSearch from '@/components/MusicSearch';
import VideoSearch from '@/components/VideoSearch';
import AlbumSearch from '@/components/AlbumSearch';
import PlaylistSearch from '@/components/PlaylistSearch';
import ArtistSearch from '@/components/ArtistSearch';
import MusicList from '@/components/MusicList';
import VideoList from '@/components/VideoList';
import AlbumList from '@/components/AlbumList';
import ArtistList from '@/components/ArtistList';
import PlaylistList from '@/components/PlaylistList';
import styles from '@/styles/Search.module.sass';
import { MoreLinkIcon, SearchIcon } from '@/components/Icons';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const { s } = router.query;
  const [query, setQuery] = useState<string>('');
  const [data, setData] = useState<SearchResult | null>(null);

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
            {s === 'video' && '영상'}
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
                      <MusicSearch musicData={data.musicData} />
                    </section>
                  )}
                  {data.videoData.length > 0 && (
                    <section>
                      <div className={styles.headline}>
                        <h2>
                          <Anchor href={`/search?q=${query}&s=video`}>
                            영상 <MoreLinkIcon />
                          </Anchor>
                        </h2>
                        <div className={styles.more}>
                          <Anchor href={`/search?q=${query}&s=video`}>더보기</Anchor>
                        </div>
                      </div>
                      <VideoSearch videoData={data.videoData} />
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
                      <AlbumSearch albumData={data.albumData} />
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
                      <ArtistSearch artistData={data.artistData} />
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
                      <PlaylistSearch playlistData={data.playlistData} />
                    </section>
                  )}
                </div>
              ) : (
                <>
                  {s === 'music' && <MusicList musicData={data.musicData} />}
                  {s === 'video' && <VideoList videoData={data.videoData} />}
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
