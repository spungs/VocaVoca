import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VocaVoca — 호주 워홀 영단어',
    short_name: 'VocaVoca',
    description: '호주 워킹홀리데이를 위한 시나리오 기반 영단어 암기 PWA',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF7F0',
    theme_color: '#E8743C',
    lang: 'ko',
    icons: [
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
