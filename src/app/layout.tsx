import type {Metadata} from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import AppLayout from '@/components/layout/AppLayout'; // Import AppLayout
import { APP_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: APP_NAME,
  description: `Track your habits and build a better you with ${APP_NAME}.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        {/* Conditionally render AppLayout or children directly if it's a special page like login/signup later */}
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
