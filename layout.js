import { Space_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
});

export const metadata = {
  title: 'ROBROUX — Fuel Your Journey',
  description: 'The premier Roblox earning platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body className="bg-black text-white font-mono min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
