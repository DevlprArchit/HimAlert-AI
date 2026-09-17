import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cx: "34671dd3e5b214437",
    status: "active",
    name: "HimAlert Disaster Intelligence Search Engine",
  });
}
