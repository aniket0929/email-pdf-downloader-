// app/api/email-ingestion/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all email configurations
export async function GET() {
  const configs = await prisma.emailIngestionConfig.findMany();
  return NextResponse.json(configs);
}

// POST: Add a new email configuration
export async function POST(request: Request) {
  const { email, connectionType, host, username, password } = await request.json();
  const newConfig = await prisma.emailIngestionConfig.create({
    data: { emailAddress: email, connectionType, host, username, password },
  });
  return NextResponse.json(newConfig);
}

// DELETE: Remove an email configuration
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.emailIngestionConfig.delete({ where: { id } });
  return NextResponse.json({ message: "Configuration deleted" });
}