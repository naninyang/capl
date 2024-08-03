import { atom, AtomEffect } from 'recoil';

const localStorageEffect =
  (key: string): AtomEffect<any> =>
  ({ setSelf, onSet }) => {
    if (typeof window !== 'undefined') {
      const savedValue = localStorage.getItem(key);
      if (savedValue !== null) {
        setSelf(JSON.parse(savedValue));
      }

      onSet((newValue, _, isReset) => {
        if (isReset) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, JSON.stringify(newValue));
        }
      });
    }
  };

export const playlistState = atom({
  key: 'playlistState',
  default: {} as Record<string, string>,
  effects: [localStorageEffect('playlistState')],
});

export const currentPlaylistTitleState = atom({
  key: 'currentPlaylistTitleState',
  default: '',
  effects: [
    ({ setSelf, onSet }) => {
      if (typeof window !== 'undefined') {
        const savedValue = localStorage.getItem('currentPlaylistTitle');
        if (savedValue !== null) {
          setSelf(savedValue);
        }

        onSet((newValue, _, isReset) => {
          if (isReset) {
            localStorage.removeItem('currentPlaylistTitle');
          } else {
            localStorage.setItem('currentPlaylistTitle', newValue);
          }
        });
      }
    },
  ],
});

export const currentTrackIndexState = atom<number>({
  key: 'currentTrackIndexState',
  default: 0,
  effects: [localStorageEffect('currentTrackIndex')],
});

export const musicModeState = atom<boolean>({
  key: 'musicModeState',
  default: true,
  effects: [localStorageEffect('musicMode')],
});

export const carplayModeState = atom<boolean>({
  key: 'carplayModeState',
  default: false,
  effects: [localStorageEffect('carplayMode')],
});
