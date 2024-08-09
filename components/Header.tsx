import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Anchor from './Anchor';
import styles from '@/styles/Header.module.sass';
import { useDesktop, useMobile } from './MediaQuery';
import { CaplLogo, CrossIcon, SearchIcon } from './Icons';

export default function Header() {
  const router = useRouter();
  const isMobile = useMobile();
  const isDesktop = useDesktop();
  const [isSearch, setIsSearch] = useState<boolean>(false);
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const { q } = router.query;

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

  const handleCancel = () => {
    setQuery('');
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.length >= 1) {
      router.push(`/search?q=${query}`);
    }
  };

  useEffect(() => {
    if (q) {
      setQuery(`${q}`);
    }
  }, [q]);

  return (
    <header className={styles.header}>
      {router.pathname !== '/search' && (
        <>
          {isMobile && (
            <>
              <Anchor href="/">
                <CaplLogo />
                <span>플레이리스트 페이지로 이동</span>
              </Anchor>
              <button type="button" className={styles['search-button']} onClick={handleSearchShow}>
                <SearchIcon />
                <span>검색기능 사용하기</span>
              </button>
            </>
          )}
          {isDesktop && (
            <button type="button" className={styles['search-button']} onClick={handleSearchShow}>
              <span>노래 검색</span> <SearchIcon />
              <i>검색기능 사용하기</i>
            </button>
          )}
        </>
      )}
      {(router.pathname === '/search' || isSearch) && (
        <form
          className={router.pathname === '/search' || isSearchActive ? styles['search-form'] : undefined}
          onSubmit={handleSubmit}
        >
          <fieldset>
            <legend>검색 폼</legend>
            <input
              type="search"
              placeholder="찾으려는 앨범명, 가수명, 곡명을 입력하세요"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className={styles['button-group']}>
              {router.pathname !== '/search' ? (
                <button type="button" className={styles['search-cancel']} onClick={handleSearchHidden}>
                  <CrossIcon />
                  <span>검색취소</span>
                </button>
              ) : (
                <button
                  type="button"
                  className={styles['search-cancel']}
                  disabled={query.length < 1}
                  onClick={handleCancel}
                >
                  <CrossIcon />
                  <span>키워드 삭제</span>
                </button>
              )}
              <button type="submit" className={styles['search-submit']} disabled={query.length < 1}>
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
