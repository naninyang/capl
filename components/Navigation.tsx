import {
  useLandscapeDesktop,
  useLandscapeMobile,
  usePortraitDesktop,
  usePortraitMobile,
} from "./MediaQuery";
import styles from "@/styles/Navigation.module.sass";

export default function Navigation() {
  const isLandscapeMobile = useLandscapeMobile();
  const isPortraitMobile = usePortraitMobile();
  const isLandscapeDesktop = useLandscapeDesktop();
  const isPortraitDesktop = usePortraitDesktop();
  return (
    <>
      {(isLandscapeMobile || isPortraitMobile) && (
        <nav className={styles["navigation-short"]}>
          <div className={styles.container}>메뉴</div>
        </nav>
      )}
      {(isLandscapeDesktop || isPortraitDesktop) && (
        <nav className={styles["navigation-long"]}>
          <div className={styles.container}>메뉴</div>
        </nav>
      )}
    </>
  );
}
