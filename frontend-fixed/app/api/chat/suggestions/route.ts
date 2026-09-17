import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    suggestions: [
      "What is the current flash flood threat in Mandi?",
      "Show historical flood events in Chamba from NASA MODIS archives",
      "Compare 2023 disaster monsoon rainfall with 2005",
      "Which river basin is currently rising closest to danger level?",
      "Where are the designated safe relief shelters in Dharamshala?",
      "Explain the NOAA DMSP-OLS nighttime lights radiometry trend in Shimla",
      "Give me an evacuation checklist for high-risk landslide zones",
      "Summarize the Beas and Sutlej hydrological breach baselines",
    ],
  });
}
