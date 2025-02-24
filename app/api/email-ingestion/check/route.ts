import { NextResponse } from "next/server";
import { checkEmails } from "@/utils/emailHandler";

export async function POST(req: Request) { // Accept the request parameter
  try {
    await checkEmails();
    return NextResponse.json({ message: "Inbox checked successfully" });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
