'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: string;
  birthDate: string;
  birthPlace: string;
  currentCity: string;
  education: string;
  carAndHouse: string;
  industry: string;
  occupation: string;
  annualIncome: string;
  height: number;
  weight: number;
  personality: string;
  hobbies: string;
  mbti: string | null;
  photos: string;
}

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        if (response.status === 401) {
          // 未登录，重定向到登录页
          router.push('/login');
          return;
        }
        throw new Error('获取个人资料失败');
      }
      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取个人资料失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const carAndHouseData = JSON.parse(profile.carAndHouse || '{}');
  const hobbies = profile.hobbies.split(',').filter(Boolean);
  const photos = profile.photos.split(',').filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* 头部信息 */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{profile.name}的个人资料</h1>
          </div>

          {/* 基本信息 */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">基本信息</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">姓名</label>
                    <div className="mt-1 text-gray-900">{profile.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">性别</label>
                    <div className="mt-1 text-gray-900">{profile.gender || '未设置'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">出生日期</label>
                    <div className="mt-1 text-gray-900">
                      {new Date(profile.birthDate).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">籍贯</label>
                    <div className="mt-1 text-gray-900">{profile.birthPlace || '未设置'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">现居城市</label>
                    <div className="mt-1 text-gray-900">{profile.currentCity || '未设置'}</div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">教育和事业</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">学历</label>
                    <div className="mt-1 text-gray-900">{profile.education || '未设置'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">行业</label>
                    <div className="mt-1 text-gray-900">{profile.industry || '未设置'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">职业</label>
                    <div className="mt-1 text-gray-900">{profile.occupation || '未设置'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">年收入</label>
                    <div className="mt-1 text-gray-900">{profile.annualIncome || '未设置'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 个性特征 */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">个性特征</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">身高</label>
                    <div className="mt-1 text-gray-900">{profile.height}cm</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">体重</label>
                    <div className="mt-1 text-gray-900">{profile.weight}kg</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">性格特征</label>
                    <div className="mt-1 text-gray-900">{profile.personality || '未设置'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">MBTI性格</label>
                    <div className="mt-1 text-gray-900">{profile.mbti || '未设置'}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">房车情况</label>
                    <div className="mt-1 text-gray-900">
                      {carAndHouseData.car ? '有车' : '无车'} | {carAndHouseData.house ? '有房' : '无房'}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">兴趣爱好</label>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {hobbies.length > 0 ? (
                        hobbies.map((hobby) => (
                          <span
                            key={hobby}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                          >
                            {hobby}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">未设置</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 照片墙 */}
            {photos.length > 0 && (
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">照片墙</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="aspect-w-1 aspect-h-1">
                      <img
                        src={photo}
                        alt={`照片 ${index + 1}`}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 编辑按钮 */}
            <div className="border-t pt-6 flex justify-end">
              <button
                onClick={() => router.push('/profile/edit')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                编辑资料
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 