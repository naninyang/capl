import { useState } from "react";
import Anchor from "./Anchor";
import { CaplLogo, CloseIcon, SearchIcon } from "./Icons";
import { useLandscapeMobile, usePortraitMobile } from "./MediaQuery";
import styles from "@/styles/Header.module.sass";

export default function Header() {
  const [isSearch, setIsSearch] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const isLandscapeMobile = useLandscapeMobile();
  const isPortraitMobile = usePortraitMobile();

  const handleSearchShow = () => {
    setIsSearch(true);
    setIsSearchActive(true);
  };

  const handleSearchHidden = () => {
    setIsSearchActive(false);
    setTimeout(() => {
      setIsSearch(false);
    }, 300);
  };

  return (
    <header className={styles.header}>
      {(isLandscapeMobile || isPortraitMobile) && (
        <Anchor href='/'>
          <CaplLogo />
          <span>플레이리스트 페이지로 이동</span>
        </Anchor>
      )}
      <button
        type='button'
        className={styles["search-button"]}
        onClick={handleSearchShow}
      >
        <SearchIcon />
        <span>검색기능 사용하기</span>
      </button>
      {isSearch && (
        <form className={isSearchActive ? styles["search-form"] : undefined}>
          <fieldset>
            <legend>검색 폼</legend>
            <input
              type='search'
              placeholder='찾으려는 앨범명, 가수명, 곡명을 입력하세요'
            />
            <div className={styles["button-group"]}>
              <button
                type='button'
                className={styles["search-cancel"]}
                onClick={handleSearchHidden}
              >
                <CloseIcon />
                <span>검색취소</span>
              </button>
              <button type='submit' className={styles["search-submit"]}>
                <SearchIcon />
                <span>검색하기</span>
              </button>
            </div>
          </fieldset>
        </form>
      )}
    </header>
  );
}
