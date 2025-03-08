import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import qiniu from 'qiniu';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  console.log('开始处理上传凭证请求...');
  console.log('当前环境:', process.env.NODE_ENV);
  
  try {
    // 获取token
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    // 验证token
    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };

    // 配置七牛云
    const accessKey = process.env.QINIU_ACCESS_KEY;
    const secretKey = process.env.QINIU_SECRET_KEY;
    const bucket = process.env.QINIU_BUCKET;

    console.log('所有可用的环境变量键:', Object.keys(process.env));
    console.log('环境变量检查:', {
      hasAccessKey: !!accessKey,
      hasSecretKey: !!secretKey,
      hasBucket: !!bucket,
      accessKeyPrefix: accessKey?.substring(0, 5),
      envPath: process.cwd() + '/.env',
      envLocalPath: process.cwd() + '/.env.local'
    });

    if (!accessKey || !secretKey || !bucket) {
      throw new Error('七牛云配置缺失');
    }

    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const putPolicy = new qiniu.rs.PutPolicy({
      scope: bucket,
      expires: 7200
    });

    const uploadToken = putPolicy.uploadToken(mac);

    return NextResponse.json({ uploadToken });
  } catch (error) {
    console.error('获取上传凭证失败:', error);
    console.error('错误堆栈:', error instanceof Error ? error.stack : '未知错误');
    return NextResponse.json(
      { error: '获取上传凭证失败' },
      { status: 500 }
    );
  }
} 