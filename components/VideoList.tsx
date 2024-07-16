import { MusicsData } from '@/types';
import ImageRender from './ImageRender';
import ArtistName from './ArtistName';
import styles from '@/styles/List.module.sass';
import { PlayMusicIcon } from './Icons';

type Props = {
  videoData: MusicsData[];
};

const VideoList = ({ videoData }: Props) => {
  return (
    <div className={styles['video-content']}>
      <div className={styles.videos}>
        <div className={styles.count}>
          <strong>{videoData.length.toLocaleString()}</strong>개 영상
        </div>
        {Array.isArray(videoData) && (
          <div className={styles['video-items']}>
            {videoData.map((video: MusicsData) => (
              <div className={styles.item} key={video.idx}>
                <button type="button">
                  <ImageRender imageUrl={`${video.videoId}`} width={260} height={145} type="video" />
                  <i>
                    <s>
                      <PlayMusicIcon />
                    </s>
                    <span>영상 재생하기</span>
                  </i>
                  <div className={styles.info}>
                    <strong>{video.title}</strong>
                    <ArtistName artistId={video.artist} />
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoList;
