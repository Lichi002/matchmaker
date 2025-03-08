import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from './components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '缘分匹配 - 寻找你的命中注定',
  description: '一个现代化的相亲交友平台，帮助你找到命中注定的那个人。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Navbar />

        {children}

        <footer className="bg-white">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
              <div className="flex space-x-6 md:order-2">
                <a href="/about" className="text-gray-400 hover:text-gray-500">
                  关于我们
                </a>
                <a href="/privacy" className="text-gray-400 hover:text-gray-500">
                  隐私政策
                </a>
                <a href="/terms" className="text-gray-400 hover:text-gray-500">
                  服务条款
                </a>
              </div>
              <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
                &copy; 2024 缘分匹配. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
} 