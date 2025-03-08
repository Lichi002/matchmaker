import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // 验证输入
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 密码加密
    const hashedPassword = await hash(password, 12);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender: '',
        birthDate: new Date(),
        birthPlace: '',
        currentCity: '',
        education: '',
        carAndHouse: '{}',  // 空对象的JSON字符串
        industry: '',
        occupation: '',
        annualIncome: '',
        height: 170,  // 默认值
        weight: 60,   // 默认值
        personality: '',
        hobbies: '',  // 空字符串，之后可以用逗号分隔多个爱好
        photos: '',   // 空字符串，之后可以用逗号分隔多个照片URL
      },
    });

    return NextResponse.json(
      { message: '注册成功', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('注册错误:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
} 