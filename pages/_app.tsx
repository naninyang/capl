import type { AppProps } from 'next/app';
import localFont from 'next/font/local';
import { RecoilRoot } from 'recoil';
import Music from '@/components/Music';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import '@/styles/globals.sass';
import {
  useLandscapeDesktop,
  useLandscapeMobile,
  usePortraitDesktop,
  usePortraitMobile,
} from '@/components/MediaQuery';

const Happiness = localFont({
  src: [
    {
      path: '../fonts/HappinessSansVF.woff2',
      style: 'normal',
    },
  ],
});

export default function App({ Component, pageProps }: AppProps) {
  const isLandscapeMobile = useLandscapeMobile();
  const isPortraitMobile = usePortraitMobile();
  const isLandscapeDesktop = useLandscapeDesktop();
  const isPortraitDesktop = usePortraitDesktop();
  return (
    <RecoilRoot>
      <style jsx global>
        {`
          body,
          pre,
          input,
          button,
          textarea,
          select {
            font-family: ${Happiness.style.fontFamily}, sans-serif;
          }
        `}
      </style>
      <div className="body">
        {(isLandscapeDesktop || isPortraitDesktop) && <Navigation />}
        <div className="content">
          <Component {...pageProps} />
          <Footer />
        </div>
      </div>
      {(isLandscapeMobile || isPortraitMobile) && <Navigation />}
      <Music />
    </RecoilRoot>
  );
}
