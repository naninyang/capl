import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { PlaylistsData } from '@/types';
import { playlistState } from '@/recoil/atom';
import Anchor from '@/components/Anchor';
import Header from '@/components/Header';
import styles from '@/styles/Home.module.sass';
import { useLandscapeDesktop, usePortraitDesktop } from '@/components/MediaQuery';
import { PlayMusicIcon, PlaylistCurrentMenuIcon } from '@/components/Icons';

export default function Home({
  playlists,
  error,
  currentPage,
}: {
  playlists: any;
  error: string;
  currentPage: number;
}) {
  const [playlist, setPlaylist] = useRecoilState(playlistState);

  const isLandscapeDesktop = useLandscapeDesktop();
  const isPortraitDesktop = usePortraitDesktop();

  const handlePlaylist = (data: any) => {
    const newTitle = data.title;
    const newList = JSON.stringify(data.list);

    if (playlist[newTitle] && playlist[newTitle] === newList) {
      alert('이미 재생목록에 등록되어 있습니다.');
    } else {
      setPlaylist((prevPlaylist: any) => ({
        ...prevPlaylist,
        [newTitle]: newList,
      }));
    }
  };

  return (
    <>
      <main className={`primary ${styles.home}`}>
        <Header />
        <div className="present">
          <h1>
            <PlaylistCurrentMenuIcon /> CAPL 추천 플레이리스트
          </h1>
          {error ? (
            <div className="error">
              <p>데이터를 불러오는데 실패했습니다.</p>
              <button onClick={() => window.location.reload()}>다시 시도</button>
            </div>
          ) : (
            <>
              {Array.isArray(playlists) && (
                <div className={styles.content}>
                  {playlists.map((playlist: PlaylistsData) => (
                    <div className={styles.item} key={playlist.idx}>
                      <Anchor href={`/playlist/${playlist.idx}`}>
                        <Image
                          src={`https://cdn.dev1stud.io/capl/playlist/${playlist.id}.svg`}
                          width={272}
                          height={272}
                          unoptimized
                          priority
                          alt={playlist.title}
                        />
                        <span>플레이리스트 재생</span>
                      </Anchor>
                      {(isLandscapeDesktop || isPortraitDesktop) && (
                        <button type="button" onClick={() => handlePlaylist(playlist)}>
                          <i>
                            <PlayMusicIcon />
                          </i>
                          <span>플레이리스트 재생</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const currentPage = Number(context.query.page) || 1;
  let playlists = null;
  let error = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/playlist?page=${currentPage}&pageSize=6`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    playlists = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : 'An unknown error occurred';
  }

  return {
    props: {
      playlists,
      error,
      currentPage,
    },
  };
};
