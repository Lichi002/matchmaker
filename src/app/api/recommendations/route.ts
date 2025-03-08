import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 计算用户匹配度的函数
function calculateMatchScore(user1: any, user2: any): number {
  let score = 0;
  const weights = {
    education: 0.2,
    age: 0.15,
    height: 0.1,
    personality: 0.2,
    hobbies: 0.2,
    location: 0.15,
  };

  // 教育匹配度
  const educationLevels = ['高中', '专科', '本科', '硕士', '博士'];
  const edu1 = educationLevels.indexOf(user1.education);
  const edu2 = educationLevels.indexOf(user2.education);
  if (edu1 !== -1 && edu2 !== -1) {
    score += weights.education * (1 - Math.abs(edu1 - edu2) / educationLevels.length);
  }

  // 年龄匹配度
  const age1 = new Date().getFullYear() - new Date(user1.birthDate).getFullYear();
  const age2 = new Date().getFullYear() - new Date(user2.birthDate).getFullYear();
  const ageDiff = Math.abs(age1 - age2);
  score += weights.age * (1 - Math.min(ageDiff / 10, 1));

  // 身高匹配度
  const heightDiff = Math.abs(user1.height - user2.height);
  score += weights.height * (1 - Math.min(heightDiff / 30, 1));

  // 性格匹配度（MBTI）
  if (user1.mbti && user2.mbti) {
    const mbtiScore = user1.mbti === user2.mbti ? 1 : 
      (user1.mbti.slice(0, 2) === user2.mbti.slice(0, 2) ? 0.5 : 0.2);
    score += weights.personality * mbtiScore;
  }

  // 兴趣爱好匹配度
  const hobbies1 = user1.hobbies.split(',').filter(Boolean);
  const hobbies2 = user2.hobbies.split(',').filter(Boolean);
  const commonHobbies = hobbies1.filter((h: string) => hobbies2.includes(h));
  if (hobbies1.length && hobbies2.length) {
    score += weights.hobbies * (commonHobbies.length / Math.max(hobbies1.length, hobbies2.length));
  }

  // 地理位置匹配度
  if (user1.currentCity === user2.currentCity) {
    score += weights.location;
  }

  return score;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
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

    // 获取当前用户
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: '用户不存在' },
        { status: 404 }
      );
    }

    // 获取所有异性用户
    const potentialMatches = await prisma.user.findMany({
      where: {
        id: { not: currentUser.id },
        gender: currentUser.gender === '男' ? '女' : '男',
      },
    });

    // 计算匹配度并排序
    const recommendations = potentialMatches
      .map(user => {
        const { password, ...profile } = user;
        const matchScore = calculateMatchScore(currentUser, user);
        return {
          ...profile,
          matchScore,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10); // 只返回前10个最匹配的用户

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('获取推荐失败:', error);
    return NextResponse.json(
      { error: '获取推荐失败' },
      { status: 500 }
    );
  }
} 