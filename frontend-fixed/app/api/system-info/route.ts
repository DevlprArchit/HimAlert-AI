import { NextResponse } from "next/server";
import os from "os";

export async function GET() {
  const nets = os.networkInterfaces();
  const ips: { interface: string; ip: string }[] = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        ips.push({ interface: name, ip: net.address });
      }
    }
  }

  return NextResponse.json({
    hostname: os.hostname(),
    ips,
    port: 3000,
    mobileUrls: ips.map((item) => `http://${item.ip}:3000`),
  });
}
