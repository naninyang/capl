import { ArtistData, ArtistNameProps } from '@/types';
import { useEffect, useState } from 'react';

const ArtistName = ({ artistId }: ArtistNameProps) => {
  const [artistNames, setArtistNames] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const artistIds = artistId;
    const artistPromises = artistIds.map(async (artistId: any) => {
      const artistResponse = await fetch(`/api/artist?id=${artistId}`);
      const artistResult = await artistResponse.json();
      return artistResult.name;
    });

    const artistNames = await Promise.all(artistPromises);
    setArtistNames(artistNames);
  };

  return <cite>{artistNames.join(', ')}</cite>;
};

export default ArtistName;
