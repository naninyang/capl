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
