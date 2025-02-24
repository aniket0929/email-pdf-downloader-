import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch all email configurations
export async function GET() {
  try {
    const configs = await prisma.emailIngestionConfig.findMany();
    return NextResponse.json(configs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch configurations" }, { status: 500 });
  }
}

// POST: Add a new email configuration
export async function POST(request: Request) {
  try {
    const { email, connectionType, host, username, password } = await request.json();
    if (!email || !host || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newConfig = await prisma.emailIngestionConfig.create({
      data: { emailAddress: email, connectionType, host, username, password },
    });

    return NextResponse.json(newConfig);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add configuration" }, { status: 500 });
  }
}

// DELETE: Remove an email configuration
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
      const id = parseInt(params.id, 10);
  
      if (isNaN(id)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
      }
  
      // Check if the config exists
      const config = await prisma.emailIngestionConfig.findUnique({ where: { id } });
      if (!config) {
        return NextResponse.json({ error: "Configuration not found" }, { status: 404 });
      }
  
      await prisma.emailIngestionConfig.delete({ where: { id } });
      return NextResponse.json({ message: "Configuration deleted successfully" });
    } catch (error) {
      return NextResponse.json({ error: "Failed to delete configuration" }, { status: 500 });
    }
  }
  