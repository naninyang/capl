import styles from '@/styles/Music.module.sass';
import { MusicIcon } from './Icons';

export default function Music() {
  return (
    <div className={`${styles.music} ${styles.day}`}>
      <div className={styles['music-player']}>뮤직 플레이어</div>
      <div className={styles['music-bar']}>
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
      </div>
    </div>
  );
}
