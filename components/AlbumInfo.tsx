import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { AlbumInfoProps, AlbumsData } from '@/types';
import Anchor from './Anchor';
import { useTablet } from './MediaQuery';
import { MoreInfoIcon } from './Icons';

const AlbumInfo = ({ albumId }: AlbumInfoProps) => {
  const isTablet = useTablet();
  const [data, setData] = useState<AlbumsData | null>(null);
  const [artistNames, setArtistNames] = useState<string[]>([]);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    fetchData(albumId);
    if ('popover' in HTMLElement.prototype) {
      const button = buttonRef.current;
      const popover = popoverRef.current;

      const handleButtonClick = () => {
        if (popover?.hasAttribute('popover-open')) {
          button?.classList.remove('popover');
          popover.removeAttribute('popover-open');
        } else {
          button?.classList.add('popover');
          popover?.setAttribute('popover-open', '');
        }
      };

      const handleClickOutside = (event: MouseEvent) => {
        if (button && popover && !button.contains(event.target as Node) && !popover.contains(event.target as Node)) {
          popover.removeAttribute('popover-open');
        }
      };

      if (button && popover) {
        button.addEventListener('click', handleButtonClick);
        document.addEventListener('click', handleClickOutside);
      }

      return () => {
        if (button && popover) {
          button.removeEventListener('click', handleButtonClick);
          document.removeEventListener('click', handleClickOutside);
        }
      };
    }
  }, [albumId]);

  const fetchData = async (id: number) => {
    const response = await fetch(`/api/album?id=${id}`);
    const result: AlbumsData = await response.json();
    console.log('result: ', result);
    setData(result);

    const artistIds = result.artist;
    console.log('artistIds: ', artistIds);
    const artistPromises = artistIds.map(async (artistId: number) => {
      const artistResponse = await fetch(`/api/artist?id=${artistId}`);
      const artistResult = await artistResponse.json();
      return artistResult.name;
    });

    const artistNames = await Promise.all(artistPromises);
    setArtistNames(artistNames);
  };

  const router = useRouter();

  return (
    <>
      {isTablet && (
        <span>
          <Anchor href={`/album/${data?.idx}`}>
            {data?.title} ({data?.release})
          </Anchor>
        </span>
      )}
      {router.pathname !== '/album/[albumId]' && (
        <>
          <div className="popover-button">
            <button type="button" popover-target="popover" ref={buttonRef}>
              <MoreInfoIcon />
              <span>앨범 정보보기</span>
            </button>
          </div>
          <div className="popover-content" ref={popoverRef}>
            <strong>
              {data?.title} ({data?.release})
            </strong>
            <cite>{artistNames.join(', ')}</cite>
          </div>
        </>
      )}
    </>
  );
};

export default AlbumInfo;
