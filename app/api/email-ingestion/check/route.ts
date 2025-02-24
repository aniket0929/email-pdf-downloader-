// app/api/email-ingestion/check/route.ts
import { NextResponse } from "next/server";
import { checkEmails } from "@/utils/emailHandler";

export async function POST() {
  try {
    await checkEmails();
    return NextResponse.json({ message: "Inbox checked successfully" });
  } catch (error) {
    // Type assertion
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


