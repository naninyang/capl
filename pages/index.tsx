import Header from "@/components/Header";
import { PlaylistCurrentMenuIcon } from "@/components/Icons";
import styles from "@/styles/Home.module.sass";

export default function Home() {
  return (
    <>
      <main className={styles.home}>
        <Header />
        <div className={styles.present}>
          <h1>
            <PlaylistCurrentMenuIcon /> CAPL 추천 플레이리스트
          </h1>
          <div className={styles.content}></div>
        </div>
      </main>
    </>
  );
}
