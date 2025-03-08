import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
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

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 移除敏感信息
    const { password, ...profile } = user;

    return NextResponse.json(profile);
  } catch (error) {
    console.error('获取用户资料错误:', error);
    return NextResponse.json(
      { error: '获取用户资料失败' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
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

    // 获取请求数据
    const data = await request.json();

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        name: data.name,
        gender: data.gender,
        birthDate: new Date(data.birthDate),
        birthPlace: data.birthPlace,
        currentCity: data.currentCity,
        education: data.education,
        carAndHouse: data.carAndHouse,
        industry: data.industry,
        occupation: data.occupation,
        annualIncome: data.annualIncome,
        height: data.height,
        weight: data.weight,
        personality: data.personality,
        hobbies: data.hobbies,
        mbti: data.mbti || null,
      },
    });

    // 移除敏感信息
    const { password, ...profile } = updatedUser;

    return NextResponse.json(profile);
  } catch (error) {
    console.error('更新用户资料错误:', error);
    return NextResponse.json(
      { error: '更新用户资料失败' },
      { status: 500 }
    );
  }
} 