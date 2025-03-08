import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    verify(token.value, process.env.JWT_SECRET || 'your-secret-key');

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        photos: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 移除敏感信息
    const { password, email, ...profile } = user;

    return NextResponse.json(profile);
  } catch (error) {
    console.error('获取用户资料失败:', error);
    return NextResponse.json(
      { error: '获取用户资料失败' },
      { status: 500 }
    );
  }
} 