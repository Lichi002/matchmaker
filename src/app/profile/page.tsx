'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PhotoUpload from '../components/PhotoUpload';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: string | null;
  birthDate: string | null;
  birthPlace: string;
  currentCity: string | null;
  education: string | null;
  carAndHouse: string;
  industry: string;
  occupation: string | null;
  annualIncome: string | null;
  height: number | null;
  weight: number | null;
  personality: string | null;
  hobbies: string | null;
  mbti: string | null;
  photos: string | null;
}

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  isMain: boolean;
}

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
    fetchPhotos();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        throw new Error('获取个人资料失败');
      }

      const data = await response.json();
      setProfile(data);
      setLoading(false);
    } catch (error) {
      console.error('获取个人资料失败:', error);
      setError('获取个人资料失败，请重试');
      setLoading(false);
    }
  };

  const fetchPhotos = async () => {
    try {
      const response = await fetch('/api/user/photos', {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('获取照片失败');
      }

      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('获取照片失败:', error);
    }
  };

  const handlePhotoUpload = async (url: string, caption: string, isMain: boolean) => {
    try {
      const response = await fetch('/api/user/photos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ url, caption, isMain }),
      });

      if (!response.ok) {
        throw new Error('保存照片失败');
      }

      const newPhoto = await response.json();
      setPhotos(prev => [...prev, newPhoto]);
    } catch (error) {
      console.error('保存照片失败:', error);
      throw error;
    }
  };

  const handlePhotoDelete = async (photoId: string) => {
    try {
      const response = await fetch(`/api/user/photos?id=${photoId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('删除照片失败');
      }

      setPhotos(prev => prev.filter(photo => photo.id !== photoId));
    } catch (error) {
      console.error('删除照片失败:', error);
    }
  };

  const handleSetMainPhoto = async (photoId: string) => {
    try {
      const response = await fetch(`/api/user/photos/${photoId}/main`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('设置主照片失败');
      }

      setPhotos(prev => prev.map(photo => ({
        ...photo,
        isMain: photo.id === photoId
      })));
    } catch (error) {
      console.error('设置主照片失败:', error);
    }
  };

  if (loading) {
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
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-700">未找到个人资料</div>
          <button
            onClick={() => router.push('/profile/edit')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            完善个人资料
          </button>
        </div>
      </div>
    );
  }

  const carAndHouseData = JSON.parse(profile.carAndHouse || '{}');
  const hobbies = profile.hobbies?.split(',').filter(Boolean) || [];
  const birthDate = profile.birthDate ? new Date(profile.birthDate).toLocaleDateString('zh-CN') : '未设置';

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* 头部信息 */}
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{profile.name}的个人资料</h1>
          </div>

          {/* 照片墙 */}
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">照片管理</h2>
            <PhotoUpload
              photos={photos}
              onPhotoUpload={handlePhotoUpload}
              onPhotoDelete={handlePhotoDelete}
              onSetMainPhoto={handleSetMainPhoto}
            />
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
                    <div className="mt-1 text-gray-900">{birthDate}</div>
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
                    <div className="mt-1 text-gray-900">{profile.height ? `${profile.height}cm` : '未设置'}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">体重</label>
                    <div className="mt-1 text-gray-900">{profile.weight ? `${profile.weight}kg` : '未设置'}</div>
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
                        src={photo.url}
                        alt={`照片 ${index + 1}`}
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 编辑按钮 */}
          <div className="p-6 border-t flex justify-end">
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
  );
} 