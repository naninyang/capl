export const GenreName = (name: string) => {
  const names: { [key: string]: string } = {
    electronic: '일렉트로닉/EDM',
    dance: '댄스',
    hiphop: '힙합/랩',
    rock: '록',
    ballad: '발라드',
    fork: '포크',
    soul: 'R&B/소울',
    trot: '트로트/성인음악',
    kpop: 'K-POP',
    jpop: 'J-POP',
  };
  return names[name] || '';
};
