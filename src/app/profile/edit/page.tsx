'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

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
}

export default function EditProfile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
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
      // 确保所有字段都有默认值
      setFormData({
        ...data,
        gender: data.gender || '',
        birthDate: data.birthDate || '',
        currentCity: data.currentCity || '',
        education: data.education || '',
        carAndHouse: data.carAndHouse || '{}',
        industry: data.industry || '',
        occupation: data.occupation || '',
        annualIncome: data.annualIncome || '',
        height: data.height || null,
        weight: data.weight || null,
        personality: data.personality || '',
        hobbies: data.hobbies || '',
        mbti: data.mbti || '',
      });
    } catch (error) {
      console.error('获取个人资料失败:', error);
      setError('获取个人资料失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    try {
      setSaving(true);
      setError('');

      // 处理数据类型转换
      const dataToSubmit = {
        ...formData,
        birthDate: formData.birthDate ? new Date(formData.birthDate).toISOString() : null,
        height: formData.height ? Number(formData.height) : null,
        weight: formData.weight ? Number(formData.weight) : null,
      };

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '保存失败');
      }

      router.push('/profile');
    } catch (error) {
      console.error('保存个人资料失败:', error);
      setError(error instanceof Error ? error.message : '保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!formData) return;

    if (name === 'hobbies') {
      // 处理兴趣爱好，确保是逗号分隔的字符串
      const hobbies = value.split(',').map(hobby => hobby.trim()).filter(Boolean).join(',');
      setFormData(prev => prev ? { ...prev, [name]: hobbies } : null);
    } else if (name === 'height' || name === 'weight') {
      // 处理数字类型的字段
      const numValue = value === '' ? null : parseInt(value, 10);
      setFormData(prev => prev ? { ...prev, [name]: numValue } : null);
    } else {
      setFormData(prev => prev ? { ...prev, [name]: value } : null);
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

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-red-600">加载失败</div>
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

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">编辑个人资料</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
                {error}
              </div>
            )}

            {/* 基本信息 */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">基本信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">姓名</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">性别</label>
                  <select
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">请选择</option>
                    <option value="male">男</option>
                    <option value="female">女</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">出生日期</label>
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">籍贯</label>
                  <input
                    type="text"
                    name="birthPlace"
                    value={formData.birthPlace}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">现居城市</label>
                  <input
                    type="text"
                    name="currentCity"
                    value={formData.currentCity || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* 教育和事业 */}
            <div className="space-y-6 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900">教育和事业</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">学历</label>
                  <select
                    name="education"
                    value={formData.education || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">请选择</option>
                    <option value="高中">高中</option>
                    <option value="专科">专科</option>
                    <option value="本科">本科</option>
                    <option value="硕士">硕士</option>
                    <option value="博士">博士</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">行业</label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">职业</label>
                  <input
                    type="text"
                    name="occupation"
                    value={formData.occupation || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">年收入</label>
                  <select
                    name="annualIncome"
                    value={formData.annualIncome || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">请选择</option>
                    <option value="10万以下">10万以下</option>
                    <option value="10-20万">10-20万</option>
                    <option value="20-30万">20-30万</option>
                    <option value="30-50万">30-50万</option>
                    <option value="50万以上">50万以上</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 个性特征 */}
            <div className="space-y-6 border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900">个性特征</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">身高 (cm)</label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">体重 (kg)</label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">性格特征</label>
                  <input
                    type="text"
                    name="personality"
                    value={formData.personality || ''}
                    onChange={handleChange}
                    placeholder="例如：开朗、善良、独立..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">MBTI性格</label>
                  <select
                    name="mbti"
                    value={formData.mbti || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">请选择</option>
                    <option value="INTJ">INTJ - 建筑师</option>
                    <option value="INTP">INTP - 逻辑学家</option>
                    <option value="ENTJ">ENTJ - 指挥官</option>
                    <option value="ENTP">ENTP - 辩论家</option>
                    <option value="INFJ">INFJ - 提倡者</option>
                    <option value="INFP">INFP - 调停者</option>
                    <option value="ENFJ">ENFJ - 主人公</option>
                    <option value="ENFP">ENFP - 竞选者</option>
                    <option value="ISTJ">ISTJ - 物流师</option>
                    <option value="ISFJ">ISFJ - 守卫者</option>
                    <option value="ESTJ">ESTJ - 总经理</option>
                    <option value="ESFJ">ESFJ - 执政官</option>
                    <option value="ISTP">ISTP - 鉴赏家</option>
                    <option value="ISFP">ISFP - 探险家</option>
                    <option value="ESTP">ESTP - 企业家</option>
                    <option value="ESFP">ESFP - 表演者</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">兴趣爱好</label>
                  <input
                    type="text"
                    name="hobbies"
                    value={formData.hobbies || ''}
                    onChange={handleChange}
                    placeholder="用逗号分隔多个兴趣爱好"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-sm text-gray-500">例如：阅读,旅行,摄影,音乐</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/profile')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 