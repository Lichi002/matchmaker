import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 获取用户照片
export async function GET(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    
    const photos = await prisma.photo.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(photos);
  } catch (error) {
    console.error('获取照片失败:', error);
    return NextResponse.json({ error: '获取照片失败' }, { status: 500 });
  }
}

// 上传照片
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const { url, caption, isMain } = await request.json();

    if (!url) {
      return NextResponse.json({ error: '请提供照片URL' }, { status: 400 });
    }

    // 如果设置为主照片，先将其他照片的isMain设为false
    if (isMain) {
      await prisma.photo.updateMany({
        where: { userId: decoded.userId },
        data: { isMain: false },
      });
    }

    const photo = await prisma.photo.create({
      data: {
        url,
        caption,
        isMain: isMain || false,
        userId: decoded.userId,
      },
    });

    return NextResponse.json(photo);
  } catch (error) {
    console.error('上传照片失败:', error);
    return NextResponse.json({ error: '上传照片失败' }, { status: 500 });
  }
}

// 删除照片
export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('id');

    if (!photoId) {
      return NextResponse.json({ error: '请提供照片ID' }, { status: 400 });
    }

    // 验证照片所有权
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo || photo.userId !== decoded.userId) {
      return NextResponse.json({ error: '无权删除此照片' }, { status: 403 });
    }

    await prisma.photo.delete({
      where: { id: photoId },
    });

    return NextResponse.json({ message: '照片已删除' });
  } catch (error) {
    console.error('删除照片失败:', error);
    return NextResponse.json({ error: '删除照片失败' }, { status: 500 });
  }
} 