// FILE: src/app/fonts.ts
import localFont from 'next/font/local';

export const spaceGrotesk = localFont({
  src: [
    {
      path: '../../public/fonts/SpaceGrotesk-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SpaceGrotesk-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SpaceGrotesk-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SpaceGrotesk-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SpaceGrotesk-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-space-grotesk',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
});
