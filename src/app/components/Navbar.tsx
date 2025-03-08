'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 检查是否有token来判断登录状态
    const checkLoginStatus = () => {
      console.log('检查登录状态...');
      console.log('当前所有 cookies:', document.cookie);
      
      const cookies = document.cookie.split(';');
      console.log('解析后的 cookies:', cookies);
      
      const token = cookies.find(cookie => {
        const trimmedCookie = cookie.trim();
        console.log('检查 cookie:', trimmedCookie);
        return trimmedCookie.startsWith('token=');
      });
      
      console.log('找到的 token:', token);
      console.log('设置登录状态为:', !!token);
      
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();

    // 添加定期检查登录状态
    const intervalId = setInterval(checkLoginStatus, 5000); // 改为每5秒检查一次

    // 添加事件监听器以检测cookie变化
    const handleStorageChange = (e: StorageEvent) => {
      console.log('Storage changed:', e);
      if (e.key === 'token') {
        checkLoginStatus();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    console.log('执行登出操作...');
    // 删除cookie
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    setIsLoggedIn(false);
    router.push('/login');
  };

  console.log('当前登录状态:', isLoggedIn);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                缘分天空
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/recommendations"
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600"
                  >
                    推荐匹配
                  </Link>
                  <Link
                    href="/profile"
                    className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-blue-600"
                  >
                    个人资料
                  </Link>
                </>
              ) : null}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                退出登录
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  登录
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  注册
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 