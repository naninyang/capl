import { GetServerSideProps } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import { PlaylistCurrentMenuIcon } from "@/components/Icons";
import { PlaylistsData } from "@/types";
import styles from "@/styles/Home.module.sass";

export default function Home({
  playlists,
  error,
  currentPage,
}: {
  playlists: any;
  error: string;
  currentPage: number;
}) {
  return (
    <>
      <main className={`primary ${styles.home}`}>
        <Header />
        <div className='present'>
          <h1>
            <PlaylistCurrentMenuIcon /> CAPL 추천 플레이리스트
          </h1>
          {error ? (
            <div className='error'>
              <p>데이터를 불러오는데 실패했습니다.</p>
              <button onClick={() => window.location.reload()}>
                다시 시도
              </button>
            </div>
          ) : (
            <>
              {Array.isArray(playlists) && (
                <div className={styles.content}>
                  {playlists.map((playlist: PlaylistsData) => (
                    <div className={styles.item} key={playlist.idx}>
                      <Image
                        src={`https://cdn.dev1stud.io/capl/playlist/${playlist.id}.svg`}
                        width={272}
                        height={272}
                        unoptimized
                        priority
                        alt={playlist.title}
                      />
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
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/playlist?page=${currentPage}&pageSize=6`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    playlists = await response.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "An unknown error occurred";
  }

  return {
    props: {
      playlists,
      error,
      currentPage,
    },
  };
};
