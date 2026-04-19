import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) 
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userRole = (session.user as any).role;
  if (!["ADMIN", "L3"].includes(userRole)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issue) {
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });
  }

  await prisma.issue.delete({
    where: { id: issue.id },
  });

  return NextResponse.json({ message: "Удалено успешно" });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { assignedToUserId, comment } = body;
  
  const issue = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
    include: { assignedToUser: true }
  });

  if (!issue) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const logsToCreate = [];

  if (body.assignedToUserId !== undefined && body.assignedToUserId !== issue.assignedToUserId) {
    const newUser = assignedToUserId ? await prisma.user.findUnique({ where: { id: assignedToUserId } }) : null;
    const oldName = issue.assignedToUser?.name || "Unassigned";
    const newName = newUser?.name || "Unassigned";
    logsToCreate.push({
      action: "ASSIGNMENT_CHANGED",
      oldValue: oldName, 
      newValue: newName, 
      comment: comment || null, 
      userId: (session.user as any).id,
    });
  }

  if (body.status && body.status !== issue.status) {
    logsToCreate.push({
      action: "STATUS_CHANGED",
      oldValue: issue.status,
      newValue: body.status,
      userId: (session.user as any).id,
    });
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: issue.id },
    data: {
      title: body.title,
      description: body.description,
      system: body.system,
      category: body.category, 
      status: body.status,
      criticality: body.criticality,
      assignedToUserId: assignedToUserId === "unassigned" ? null : assignedToUserId,
      
      cvssScore: body.cvssScore,
      dreadScore: body.dreadScore,
      dreadDamage: body.dreadDamage,
      dreadRepro: body.dreadRepro,
      dreadExploit: body.dreadExploit,
      dreadAffected: body.dreadAffected,
      dreadDiscover: body.dreadDiscover,
      cvssAV: body.cvssAV,
      cvssAC: body.cvssAC,
      cvssPR: body.cvssPR,
      cvssUI: body.cvssUI,
      cvssS: body.cvssS,
      cvssC: body.cvssC,
      cvssI: body.cvssI,
      cvssA: body.cvssA,

      history: logsToCreate.length > 0 ? { create: logsToCreate } : undefined
    }
  });

  return NextResponse.json(updatedIssue);
}