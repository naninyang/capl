import { useState } from 'react';
import { useRouter } from 'next/router';
import Anchor from './Anchor';
import styles from '@/styles/Navigation.module.sass';
import { useLandscapeDesktop, useLandscapeMobile, usePortraitDesktop, usePortraitMobile } from './MediaQuery';
import {
  CaplLogo,
  CautionMenuIcon,
  ChartCurrentMenuIcon,
  ChartDefaultMenuIcon,
  ContactMenuIcon,
  LicenseMenuIcon,
  MoreMenuIcon,
  NewlyCurrentMenuIcon,
  NewlyDefaultMenuIcon,
  NoticeMenuIcon,
  PlaylistCurrentMenuIcon,
  PlaylistDefaultMenuIcon,
  ServiceMenuIcon,
} from './Icons';

export default function Navigation() {
  const [isMore, setIsMore] = useState(false);
  const closeMore = () => {
    setIsMore(false);
  };

  const router = useRouter();
  const isLandscapeMobile = useLandscapeMobile();
  const isPortraitMobile = usePortraitMobile();
  const isLandscapeDesktop = useLandscapeDesktop();
  const isPortraitDesktop = usePortraitDesktop();
  return (
    <>
      {(isLandscapeMobile || isPortraitMobile) && (
        <>
          {isMore && (
            <div className={styles['navigation-more']}>
              <ol>
                <li>
                  <Anchor href="/service">
                    서비스 소개
                    <ServiceMenuIcon />
                  </Anchor>
                </li>
                <li>
                  <Anchor href="/notice">
                    공지사항
                    <NoticeMenuIcon />
                  </Anchor>
                </li>
                <li>
                  <Anchor href="/contact">
                    문의하기
                    <ContactMenuIcon />
                  </Anchor>
                </li>
                <li>
                  <Anchor href="/licenses">
                    저작권 안내
                    <LicenseMenuIcon />
                  </Anchor>
                </li>
                <li>
                  <Anchor href="/caution">
                    유의사항
                    <CautionMenuIcon />
                  </Anchor>
                </li>
              </ol>
              <hr />
              <ul>
                <li className={styles['open-sources']}>
                  <Anchor href="open-sources">오픈소스</Anchor>
                </li>
                <li className={styles['get-app']}>
                  <Anchor href="get-app">앱 설치</Anchor>
                </li>
              </ul>
            </div>
          )}
          <nav className={styles['navigation-short']}>
            <ol>
              <li className={router.pathname === '/' ? styles.current : undefined}>
                <Anchor href="/" onClick={closeMore}>
                  {router.pathname === '/' ? <PlaylistCurrentMenuIcon /> : <PlaylistDefaultMenuIcon />}
                  플레이리스트
                </Anchor>
              </li>
              <li className={router.pathname === '/chart' ? styles.current : undefined}>
                <Anchor href="/chart" onClick={closeMore}>
                  {router.pathname === '/chart' ? <ChartCurrentMenuIcon /> : <ChartDefaultMenuIcon />}
                  차트
                </Anchor>
              </li>
              <li className={router.pathname === '/newly' ? styles.current : undefined}>
                <Anchor href="/newly" onClick={closeMore}>
                  {router.pathname === '/newly' ? <NewlyCurrentMenuIcon /> : <NewlyDefaultMenuIcon />}
                  최근등록
                </Anchor>
              </li>
              <li>
                <button type="button" onClick={() => setIsMore((more) => !more)}>
                  <MoreMenuIcon />
                  더보기
                </button>
              </li>
            </ol>
          </nav>
        </>
      )}
      {(isLandscapeDesktop || isPortraitDesktop) && (
        <nav className={styles['navigation-long']}>
          <div className={styles.menu}>
            <h1>
              <Anchor href="/">
                <CaplLogo />
                <span>플레이리스트 페이지로 이동</span>
              </Anchor>
            </h1>
            <div className={styles['menu-container']}>
              <ol>
                <li className={router.pathname === '/' ? styles.current : undefined}>
                  <Anchor href="/">
                    {router.pathname === '/' ? <PlaylistCurrentMenuIcon /> : <PlaylistDefaultMenuIcon />}
                    플레이리스트
                  </Anchor>
                </li>
                <li className={router.pathname === '/chart' ? styles.current : undefined}>
                  <Anchor href="/chart">
                    {router.pathname === '/chart' ? <ChartCurrentMenuIcon /> : <ChartDefaultMenuIcon />}
                    차트
                  </Anchor>
                </li>
                <li className={router.pathname === '/newly' ? styles.current : undefined}>
                  <Anchor href="/newly">
                    {router.pathname === '/newly' ? <NewlyCurrentMenuIcon /> : <NewlyDefaultMenuIcon />}
                    최근등록
                  </Anchor>
                </li>
              </ol>
              <hr />
              <ol>
                <li>
                  <Anchor href="/service">
                    <ServiceMenuIcon />
                    서비스 소개
                  </Anchor>
                </li>
                <li>
                  <Anchor href="/notice">
                    <NoticeMenuIcon />
                    공지사항
                  </Anchor>
                </li>
                <li>
                  <Anchor href="/contact">
                    <ContactMenuIcon />
                    문의하기
                  </Anchor>
                </li>
                <li>
                  <Anchor href="/licenses">
                    <LicenseMenuIcon />
                    저작권 안내
                  </Anchor>
                </li>
                <li>
                  <Anchor href="/caution">
                    <CautionMenuIcon />
                    유의사항
                  </Anchor>
                </li>
              </ol>
            </div>
          </div>
          <div className={styles.misc}>
            <ul>
              <li className={styles['open-sources']}>
                <Anchor href="open-sources">오픈소스</Anchor>
              </li>
              <li className={styles['get-app']}>
                <Anchor href="get-app">앱 설치</Anchor>
              </li>
            </ul>
          </div>
        </nav>
      )}
    </>
  );
}
