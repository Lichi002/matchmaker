import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const decoded = verify(token.value, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const photoId = params.id;

    // 验证照片所有权
    const photo = await prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo || photo.userId !== decoded.userId) {
      return NextResponse.json({ error: '无权操作此照片' }, { status: 403 });
    }

    // 将所有照片的 isMain 设为 false
    await prisma.photo.updateMany({
      where: { userId: decoded.userId },
      data: { isMain: false },
    });

    // 设置选中的照片为主照片
    const updatedPhoto = await prisma.photo.update({
      where: { id: photoId },
      data: { isMain: true },
    });

    return NextResponse.json(updatedPhoto);
  } catch (error) {
    console.error('设置主照片失败:', error);
    return NextResponse.json({ error: '设置主照片失败' }, { status: 500 });
  }
}

// 保持 PUT 方法的兼容性
export { POST as PUT }; 