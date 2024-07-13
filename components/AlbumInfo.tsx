import { AlbumData, AlbumInfoProps, AlbumsData } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { MoreInfoIcon } from './Icons';

const AlbumInfo = ({ albumId }: AlbumInfoProps) => {
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
          popover.removeAttribute('popover-open');
        } else {
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

      // Clean-up function
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
    setData(result);

    const artistIds = result.artist;
    const artistPromises = artistIds.map(async (artistId: number) => {
      const artistResponse = await fetch(`/api/artist?id=${artistId}`);
      const artistResult = await artistResponse.json();
      return artistResult.name;
    });

    const artistNames = await Promise.all(artistPromises);
    setArtistNames(artistNames);
  };

  return (
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
  );
};

export default AlbumInfo;