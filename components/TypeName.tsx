export const TypeName = (name: string) => {
  const names: { [key: string]: string } = {
    origin: 'M/V',
    music: '노래 전용',
    live: '라이브 영상',
    cover: '커버곡',
  };
  return names[name] || '';
};
