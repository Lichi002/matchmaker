'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Recommendation {
  id: string;
  name: string;
  gender: string;
  birthDate: string;
  currentCity: string;
  education: string;
  occupation: string;
  height: number;
  personality: string;
  hobbies: string;
  matchScore: number;
}

export default function Recommendations() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/recommendations', {
        credentials: 'include',
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || '获取推荐失败');
      }

      const data = await response.json();
      console.log('推荐数据:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('返回数据格式错误');
      }

      setRecommendations(data);
    } catch (err) {
      console.error('获取推荐失败:', err);
      setError(err instanceof Error ? err.message : '获取推荐失败');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    return new Date().getFullYear() - new Date(birthDate).getFullYear();
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
          <button
            onClick={() => {
              setError('');
              fetchRecommendations();
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">为您推荐</h1>
          <p className="mt-4 text-lg text-gray-600">
            根据您的个人资料，我们为您精选了以下最匹配的对象
          </p>
          {recommendations.length === 0 && (
            <p className="mt-4 text-gray-500">
              暂时没有找到匹配的对象，请稍后再试
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">{recommendation.name}</h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    匹配度: {Math.round(recommendation.matchScore * 100)}%
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <span className="w-20 flex-shrink-0">年龄：</span>
                    <span>{calculateAge(recommendation.birthDate)}岁</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-20 flex-shrink-0">身高：</span>
                    <span>{recommendation.height}cm</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-20 flex-shrink-0">学历：</span>
                    <span>{recommendation.education}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-20 flex-shrink-0">职业：</span>
                    <span>{recommendation.occupation || '未设置'}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="w-20 flex-shrink-0">所在地：</span>
                    <span>{recommendation.currentCity}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-gray-700 mb-2">兴趣爱好：</div>
                  <div className="flex flex-wrap gap-2">
                    {recommendation.hobbies.split(',').filter(Boolean).map((hobby, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => router.push(`/profile/${recommendation.id}`)}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    查看详细资料
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 