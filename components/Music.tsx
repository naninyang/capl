import styles from "@/styles/Music.module.sass";
export default function Music() {
  return (
    <div className={styles.music}>
      <div className={styles["music-player"]}>뮤직 플레이어</div>
      <div className={styles["music-bar"]}>뮤직 바</div>
    </div>
  );
}
