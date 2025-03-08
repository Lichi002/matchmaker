import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    console.log('开始处理注册请求');
    const { email, password, name } = await request.json();

    // 验证输入
    if (!email || !password || !name) {
      console.log('缺少必要字段:', { email: !!email, password: !!password, name: !!name });
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已被注册
    console.log('检查邮箱是否已被注册:', email);
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log('邮箱已被注册:', email);
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 加密密码
    console.log('开始加密密码');
    const hashedPassword = await hash(password, 12);

    // 创建用户
    console.log('开始创建用户');
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        birthPlace: '',  // 添加必填字段的默认值
        industry: '',    // 添加必填字段的默认值
        carAndHouse: '{}',
      },
    });

    console.log('用户创建成功:', user.id);

    return NextResponse.json(
      { message: '注册成功', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('注册过程中发生错误:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
} 