import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'VocaVoca — 시나리오 영단어',
    short_name: 'VocaVoca',
    description: '시나리오 기반 영단어 암기 PWA. 사용자가 직접 목표·일정·콘텐츠를 정해 쓰는 범용 학습 앱.',
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
