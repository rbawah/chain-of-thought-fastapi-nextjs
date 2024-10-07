// import { ReactNode } from 'react';
// import clsx from 'clsx';
// import { GeistSans } from 'geist/font/sans';
// import { GeistMono } from 'geist/font/mono';
// import './globals.css';

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <body
//         className={clsx(
//           'font-sans antialiased',
//           GeistSans.variable,
//           GeistMono.variable
//         )}
//       >
//             {children}
//         {/* <main>{children}</main> */}
//       </body>
//     </html>
//     )
// }


"use client";

import clsx from 'clsx';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { AppProvider } from '@/app/lib/contexts/model-context';
import Header from './components/header';
import Sidebar from './components/sidebar';
import Footer from './components/footer';


// export const metadata = {
//   title: 'Dashboard',
//   description: 'Next.js Dashboard Layout',
// };

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

  return (
    <html lang="en" suppressHydrationWarning>
      {/* <body
      className="h-screen"
      > */}

      <body
         className={clsx(
           'font-sans antialiased h-screen',
           GeistSans.variable,
           GeistMono.variable
         )}
      >
        <AppProvider>
        <Sidebar />
          <div className="ml-64 flex-1 overflow-auto p-8 bg-gray-200 h-full dark:bg-neutral-800 dark:text-white">
            <div className="">
              <Header />
            </div>
            <div>
              {children}
            </div>
            <Footer />
          </div>
          </AppProvider>
      </body>
    </html>
  );
}
