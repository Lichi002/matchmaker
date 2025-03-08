'use client';

import { useState } from 'react';
import Image from 'next/image';
const qiniu = require('qiniu-js');

interface Photo {
  id: string;
  url: string;
  caption: string | null;
  isMain: boolean;
}

interface QiniuResponse {
  key: string;
}

interface QiniuProgress {
  total: {
    percent: number;
  };
}

interface PhotoUploadProps {
  photos: Photo[];
  onPhotoUpload: (url: string, caption: string, isMain: boolean) => Promise<void>;
  onPhotoDelete: (photoId: string) => Promise<void>;
  onSetMainPhoto: (photoId: string) => Promise<void>;
}

export default function PhotoUpload({
  photos,
  onPhotoUpload,
  onPhotoDelete,
  onSetMainPhoto,
}: PhotoUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('照片大小不能超过5MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const uploadToQiniu = async (file: File) => {
    try {
      console.log('开始获取上传凭证...');
      
      // 获取上传凭证
      const tokenResponse = await fetch('/api/upload/token', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      console.log('上传凭证请求状态:', tokenResponse.status);
      
      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('获取上传凭证失败:', {
          status: tokenResponse.status,
          statusText: tokenResponse.statusText,
          error: errorText
        });
        throw new Error(`获取上传凭证失败: ${tokenResponse.status} ${errorText}`);
      }

      const data = await tokenResponse.json();
      console.log('上传凭证响应数据:', data);

      if (!data.uploadToken) {
        console.error('上传凭证格式错误:', data);
        throw new Error('获取上传凭证失败：凭证格式无效');
      }

      // 生成唯一的文件名
      const ext = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`;

      console.log('开始上传文件:', {
        fileName,
        fileSize: file.size,
        fileType: file.type,
        domain: process.env.NEXT_PUBLIC_QINIU_DOMAIN
      });

      // 配置上传
      console.log('初始化七牛云上传配置...');

      // 创建上传实例
      const config = {
        useCdnDomain: true,
        region: 'z2' // 华南区
      };
      
      const putExtra = {
        fname: file.name,
        mimeType: file.type
      };

      const observable = qiniu.upload(file, fileName, data.uploadToken, putExtra, config);

      console.log('开始上传过程...');

      // 返回 Promise
      return new Promise((resolve, reject) => {
        const subscription = observable.subscribe({
          next: (res: any) => {
            const percent = Math.floor(res.total.percent);
            setUploadProgress(percent);
            console.log('上传进度:', percent);
          },
          error: (err: any) => {
            console.error('上传过程中出错:', err);
            reject(err);
          },
          complete: (res: any) => {
            console.log('上传完成:', res);
            const domain = process.env.NEXT_PUBLIC_QINIU_DOMAIN;
            const url = `${domain}/${res.key}`;
            resolve(url);
          }
        });
      });
    } catch (error) {
      console.error('上传到七牛云失败:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('请选择要上传的照片');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setUploadProgress(0);

      const imageUrl = await uploadToQiniu(selectedFile);
      await onPhotoUpload(imageUrl as string, caption, photos.length === 0);

      setSelectedFile(null);
      setCaption('');
      setUploadProgress(0);
    } catch (error) {
      setError(error instanceof Error ? error.message : '上传照片失败，请重试');
      console.error('上传失败:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map(photo => (
          <div
            key={photo.id}
            className="relative bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="relative aspect-w-3 aspect-h-4">
              <Image
                src={photo.url}
                alt={photo.caption || '个人照片'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
            <div className="p-4 space-y-2">
              {photo.caption && (
                <p className="text-sm text-gray-500">{photo.caption}</p>
              )}
              <div className="flex justify-between">
                {!photo.isMain && (
                  <button
                    onClick={() => onSetMainPhoto(photo.id)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    设为主照
                  </button>
                )}
                {photo.isMain && (
                  <span className="text-sm text-green-600">主照片</span>
                )}
                <button
                  onClick={() => onPhotoDelete(photo.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            选择照片
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            照片说明
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="添加照片说明（可选）"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {uploading && (
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  上传进度
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {uploadProgress}%
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{ width: `${uploadProgress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
              />
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {uploading ? '上传中...' : '上传照片'}
        </button>
      </div>
    </div>
  );
} 