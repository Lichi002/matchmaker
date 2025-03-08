import { useState } from 'react';
import type { Education, IncomeRange } from '../../types/user';

export default function RegisterForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    birthDate: '',
    birthPlace: '',
    currentCity: '',
    education: '',
    industry: '',
    occupation: '',
    annualIncome: '',
    height: '',
    weight: '',
    personality: '',
    hobbies: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4].map(num => (
            <div
              key={num}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= num ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">基本信息</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名/昵称
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              性别
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">请选择</option>
              <option value="male">男</option>
              <option value="female">女</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              出生日期
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              下一步
            </button>
          </div>
        </div>
      )}

      {/* 其他步骤的表单将在后续添加 */}
    </div>
  );
} 