import { useEffect, useState } from 'react';
import { ArtistNameProps } from '@/types';
import Anchor from './Anchor';
import { useTablet } from './MediaQuery';

const ArtistName = ({ artistId }: ArtistNameProps) => {
  const [artistData, setArtistData] = useState<{ name: string; idx: number; otherName: string }[]>([]);
  const isTablet = useTablet();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const artistIds = artistId;
    const artistPromises = artistIds.map(async (artistId: any) => {
      const artistResponse = await fetch(`/api/artist?id=${artistId}`);
      const artistResult = await artistResponse.json();
      return { name: artistResult.name, idx: artistResult.idx, otherName: artistResult.otherName };
    });

    const artistData = await Promise.all(artistPromises);
    setArtistData(artistData);
  };

  return (
    <cite>
      {artistData.map((artist, index) => (
        <span key={artist.idx}>
          {isTablet ? (
            <>
              <Anchor href={`/artist/${artist.idx}`}>
                {artist.name} ({artist.otherName})
              </Anchor>
              {index < artistData.length - 1 && ', '}
            </>
          ) : (
            <cite>
              {artist.name}
              {index < artistData.length - 1 && ', '}
            </cite>
          )}
        </span>
      ))}
    </cite>
  );
};

export default ArtistName;
