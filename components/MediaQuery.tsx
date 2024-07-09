import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

export function useLandscapeDesktop() {
  const [isLandscapeDesktop, setIsLandscapeDesktop] = useState(false);
  const landscapeDesktop = useMediaQuery({
    query: `(min-aspect-ratio: 1/1) and (min-width: ${1151 / 16}rem)`,
  });
  useEffect(() => {
    setIsLandscapeDesktop(landscapeDesktop);
  }, [landscapeDesktop]);
  return isLandscapeDesktop;
}

export function usePortraitDesktop() {
  const [isPortraitDesktop, setIsPortraitDesktop] = useState(false);
  const portraitDesktop = useMediaQuery({
    query: `(max-aspect-ratio: 1/1) and (min-width: ${576 / 16}rem)`,
  });
  useEffect(() => {
    setIsPortraitDesktop(portraitDesktop);
  }, [portraitDesktop]);
  return isPortraitDesktop;
}

export function useLandscapeMobile() {
  const [isLandscapeMobile, setIsLandscapeMobile] = useState(false);
  const landscapeMobile = useMediaQuery({
    query: `(min-aspect-ratio: 1/1) and (max-width: ${1150 / 16}rem)`,
  });
  useEffect(() => {
    setIsLandscapeMobile(landscapeMobile);
  }, [landscapeMobile]);
  return isLandscapeMobile;
}

export function usePortraitMobile() {
  const [isPortraitMobile, setIsPortraitMobile] = useState(false);
  const portraitMobile = useMediaQuery({
    query: `(max-aspect-ratio: 1/1) and (max-width: ${575 / 16}rem)`,
  });
  useEffect(() => {
    setIsPortraitMobile(portraitMobile);
  }, [portraitMobile]);
  return isPortraitMobile;
}
