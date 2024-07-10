import styles from "@/styles/Footer.module.sass";
import Anchor from "./Anchor";
import { GithubSiteIcon, StudioLogo, StudioSiteIcon } from "./Icons";
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.misc}>
          <ul>
            <li>
              <Anchor href='/notice'>공지사항</Anchor>
            </li>
            <li>
              <Anchor href='/contact'>문의하기</Anchor>
            </li>
            <li>
              <Anchor href='/licenses'>저작권 안내</Anchor>
            </li>
          </ul>
        </div>
        <hr />
        <div className={styles.copyright}>
          <p>
            <span>&copy;</span> <StudioLogo />
            <i>DEV1L.studios</i>
          </p>
          <ul>
            <li>
              <Anchor href='https://dev1stud.io'>
                <StudioSiteIcon />
                <span>DEV1L.studios</span>
              </Anchor>
            </li>
            <li>
              <Anchor href='https://github.com/naninyang/capl'>
                <GithubSiteIcon />
                <span>Github 카플 저장소</span>
              </Anchor>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
