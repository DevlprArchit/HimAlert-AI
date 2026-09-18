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

  // Prioritize primary Wi-Fi and standard private LAN subnets (en0, 192.168.x.x)
  ips.sort((a, b) => {
    const isEn0A = a.interface === "en0" || a.interface.toLowerCase().includes("wlan");
    const isEn0B = b.interface === "en0" || b.interface.toLowerCase().includes("wlan");
    if (isEn0A && !isEn0B) return -1;
    if (!isEn0A && isEn0B) return 1;

    const is192A = a.ip.startsWith("192.168.");
    const is192B = b.ip.startsWith("192.168.");
    if (is192A && !is192B) return -1;
    if (!is192A && is192B) return 1;

    return 0;
  });

  return NextResponse.json({
    hostname: os.hostname(),
    ips,
    port: 3001,
    mobileUrls: ips.map((item) => `http://${item.ip}:3001`),
  });
}
