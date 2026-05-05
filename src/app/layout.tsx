import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ServiceWorkerRegistrar } from '@/components/ServiceWorkerRegistrar';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});
const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'VocaVoca — 시나리오 영단어',
  description: '시나리오 기반 영단어 암기 PWA. 사용자가 직접 목표·일정·콘텐츠를 정해 쓰는 범용 학습 앱.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'VocaVoca',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF7F0' },
    { media: '(prefers-color-scheme: dark)', color: '#14110E' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

const THEME_INIT_SCRIPT = `(function(){try{
var ACCENT={amber:{l:'#E8743C',ls:'#FCE6D6',d:'#F08651',ds:'#3A2418'},eucalyptus:{l:'#5B7553',ls:'#DDE5D2',d:'#8FAE82',ds:'#25301F'},coral:{l:'#D9534F',ls:'#F8DAD8',d:'#E26B66',ds:'#3A1E1C'},sky:{l:'#3F7BA8',ls:'#D6E4F0',d:'#6BA0CC',ds:'#1B2A38'}};
function apply(){
var t=localStorage.getItem('vv:theme');
var c=localStorage.getItem('vv:accent')||'amber';
var h=document.documentElement;
h.classList.remove('vv-light','vv-dark');
if(t==='light')h.classList.add('vv-light');
else if(t==='dark')h.classList.add('vv-dark');
var a=ACCENT[c]||ACCENT.amber;
var dark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
h.style.setProperty('--vv-amber',dark?a.d:a.l);
h.style.setProperty('--vv-amber-soft',dark?a.ds:a.ls);
}
apply();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',apply);
}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ko"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
