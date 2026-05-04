import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'DevAgent OS — AI Multi-Agent Dev Assistant',
  description:
    'AI-powered multi-agent development assistant built with Next.js, Claude API, and MongoDB. 6 specialized agents: Dev, Debug, QA, UI/UX, Designer, Orchestrator.',
  keywords: [
    'AI agents',
    'Next.js',
    'Claude API',
    'development assistant',
    'multi-agent',
    'TypeScript',
    'React',
  ],
  authors: [{ name: "Thomas Bourc'his", url: 'https://devagent-os.vercel.app' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'DevAgent OS — AI Multi-Agent Dev Assistant',
    description:
      'AI-powered multi-agent development assistant built with Next.js, Claude API, and MongoDB. 5 specialized agents coordinated by an orchestrator.',
    url: 'https://devagent-os.vercel.app',
    siteName: 'DevAgent OS',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'DevAgent OS — AI Multi-Agent Dev Assistant',
    description: 'AI-powered multi-agent development assistant — Next.js, Claude API, MongoDB.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className={`${inter.variable} h-full antialiased`}>
      <body className='min-h-full flex flex-col'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
