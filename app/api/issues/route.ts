import { prisma } from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createIssueSchema } from "../../validationSchemas";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createIssueSchema.safeParse(body);
  if (!validation.success)
    return NextResponse.json(validation.error.format(), { status: 400 });
    
  const newIssue = await prisma.issue.create({
    data: { 
      title: body.title, 
      description: body.description,
      system: body.system,
      category: body.category
   },
  });
  return NextResponse.json(newIssue, { status: 201 });
}

export async function GET() {
  try {
    const issues = await prisma.issue.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(issues);
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
    return NextResponse.json(
      { error: 'Ошибка сервера при загрузке аудитов' },
      { status: 500 }
    );
  }
}