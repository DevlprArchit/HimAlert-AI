import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json({ error: "Missing lat/lon" }, { status: 400 });
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,showers,wind_speed_10m,surface_pressure,visibility&hourly=temperature_2m,relative_humidity_2m,precipitation,rain,showers,precipitation_probability,surface_pressure,visibility,wind_speed_10m,soil_moisture_0_to_7cm&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code&timezone=Asia/Kolkata`;

  try {
    const res = await fetch(url, { next: { revalidate: 120 } });
    if (!res.ok) {
      throw new Error(`Open-Meteo returned status ${res.status}`);
    }
    const data = await res.json();

    const current = data.current || {};
    const hourly = data.hourly || {};
    const times = hourly.time || [];
    const precipitation = hourly.precipitation || [];
    const rain = hourly.rain || [];
    const showers = hourly.showers || [];
    const probability = hourly.precipitation_probability || [];
    const soil_moisture = hourly.soil_moisture_0_to_7cm || [];

    const currentTimeStr = current.time || "";
    let startIdx = 0;
    if (currentTimeStr && times.length > 0) {
      const prefix = currentTimeStr.slice(0, 13);
      const found = times.findIndex((t: string) => t.startsWith(prefix));
      if (found !== -1) startIdx = found;
    }

    const next24Hours = [];
    const endIdx = Math.min(times.length, startIdx + 24);
    for (let i = startIdx; i < endIdx; i++) {
      next24Hours.push({
        time: times[i],
        precipitation: precipitation[i] ?? 0.0,
        rain: rain[i] ?? 0.0,
        showers: showers[i] ?? 0.0,
        precipitation_probability: probability[i] ?? 0,
        soil_moisture: soil_moisture[i] ?? 0.45,
      });
    }

    const rainfall24h = precipitation.slice(startIdx, startIdx + 24).reduce((a: number, b: number) => a + (b || 0), 0);
    const maxHourlyRain = Math.max(...(precipitation.slice(startIdx, startIdx + 24) || [0]), 0);
    const maxRainProbability = Math.max(...(probability.slice(startIdx, startIdx + 24) || [0]), 0);

    return NextResponse.json({
      location: { latitude: Number(lat), longitude: Number(lon) },
      current: {
        temperature: current.temperature_2m ?? 21.0,
        humidity: current.relative_humidity_2m ?? 60,
        precipitation: current.precipitation ?? 0.0,
        rain: current.rain ?? 0.0,
        showers: current.showers ?? 0.0,
        wind_speed: current.wind_speed_10m ?? 5.0,
        pressure: current.surface_pressure ?? 1012,
        visibility: current.visibility ?? 10000,
        soil_moisture: soil_moisture[startIdx] ?? 0.45,
      },
      forecast: {
        rainfall_next_24h: +(rainfall24h.toFixed(2)),
        max_hourly_rain: +(maxHourlyRain.toFixed(2)),
        max_rain_probability: maxRainProbability,
        hours: next24Hours,
      },
      daily: data.daily || [],
      source: "Open-Meteo",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
