import { useRouter } from "next/router";
import Anchor from "./Anchor";
import {
  CaplLogo,
  CautionMenuIcon,
  ChartCurrentMenuIcon,
  ChartDefaultMenuIcon,
  ContactMenuIcon,
  NewlyCurrentMenuIcon,
  NewlyDefaultMenuIcon,
  NoticeMenuIcon,
  PlaylistCurrentMenuIcon,
  PlaylistDefaultMenuIcon,
  ServiceMenuIcon,
} from "./Icons";
import styles from "@/styles/Navigation.module.sass";
import {
  useLandscapeDesktop,
  useLandscapeMobile,
  usePortraitDesktop,
  usePortraitMobile,
} from "./MediaQuery";

export default function Navigation() {
  const router = useRouter();
  const isLandscapeMobile = useLandscapeMobile();
  const isPortraitMobile = usePortraitMobile();
  const isLandscapeDesktop = useLandscapeDesktop();
  const isPortraitDesktop = usePortraitDesktop();
  return (
    <>
      {(isLandscapeMobile || isPortraitMobile) && (
        <nav className={styles["navigation-short"]}>
          <ol>
            <li
              className={router.pathname === "/" ? styles.current : undefined}
            >
              <Anchor href='/'>
                {router.pathname === "/" ? (
                  <PlaylistCurrentMenuIcon />
                ) : (
                  <PlaylistDefaultMenuIcon />
                )}
                플레이리스트
              </Anchor>
            </li>
            <li
              className={
                router.pathname === "/chart" ? styles.current : undefined
              }
            >
              <Anchor href='/'>
                {router.pathname === "/chart" ? (
                  <ChartCurrentMenuIcon />
                ) : (
                  <ChartDefaultMenuIcon />
                )}
                차트
              </Anchor>
            </li>
            <li
              className={
                router.pathname === "/newly" ? styles.current : undefined
              }
            >
              <Anchor href='/'>
                {router.pathname === "/newly" ? (
                  <NewlyCurrentMenuIcon />
                ) : (
                  <NewlyDefaultMenuIcon />
                )}
                최근등록
              </Anchor>
            </li>
          </ol>
        </nav>
      )}
      {(isLandscapeDesktop || isPortraitDesktop) && (
        <nav className={styles["navigation-long"]}>
          <div className={styles.menu}>
            <h1>
              <Anchor href='/'>
                <CaplLogo />
                <span>플레이리스트 페이지로 이동</span>
              </Anchor>
            </h1>
            <div className={styles["menu-container"]}>
              <ol>
                <li
                  className={
                    router.pathname === "/" ? styles.current : undefined
                  }
                >
                  <Anchor href='/'>
                    {router.pathname === "/" ? (
                      <PlaylistCurrentMenuIcon />
                    ) : (
                      <PlaylistDefaultMenuIcon />
                    )}
                    플레이리스트
                  </Anchor>
                </li>
                <li
                  className={
                    router.pathname === "/chart" ? styles.current : undefined
                  }
                >
                  <Anchor href='/'>
                    {router.pathname === "/chart" ? (
                      <ChartCurrentMenuIcon />
                    ) : (
                      <ChartDefaultMenuIcon />
                    )}
                    차트
                  </Anchor>
                </li>
                <li
                  className={
                    router.pathname === "/newly" ? styles.current : undefined
                  }
                >
                  <Anchor href='/'>
                    {router.pathname === "/newly" ? (
                      <NewlyCurrentMenuIcon />
                    ) : (
                      <NewlyDefaultMenuIcon />
                    )}
                    최근등록
                  </Anchor>
                </li>
              </ol>
              <hr />
              <ol>
                <li>
                  <Anchor href='/service'>
                    <ServiceMenuIcon />
                    서비스 소개
                  </Anchor>
                </li>
                <li>
                  <Anchor href='/notice'>
                    <NoticeMenuIcon />
                    공지사항
                  </Anchor>
                </li>
                <li>
                  <Anchor href='/contact'>
                    <ContactMenuIcon />
                    문의하기
                  </Anchor>
                </li>
                <li>
                  <Anchor href='/licenses'>
                    <ContactMenuIcon />
                    저작권 안내
                  </Anchor>
                </li>
                <li>
                  <Anchor href='/caution'>
                    <CautionMenuIcon />
                    유의사항
                  </Anchor>
                </li>
              </ol>
            </div>
          </div>
          <div className={styles.misc}>
            <ul>
              <li className={styles["open-sources"]}>
                <Anchor href='open-sources'>오픈소스</Anchor>
              </li>
              <li className={styles["get-app"]}>
                <Anchor href='get-app'>앱 설치</Anchor>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}
