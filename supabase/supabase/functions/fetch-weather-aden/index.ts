import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const OPENWEATHER_API_KEY = Deno.env.get("OPENWEATHER_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// إحداثيات عدن
const ADEN_COORDINATES = {
  lat: 12.7855,
  lon: 45.0187,
};

serve(async () => {
  if (!OPENWEATHER_API_KEY) {
    console.error("OPENWEATHER_API_KEY is not set");
    return new Response("Missing API key", { status: 500 });
  }

  try {
    const url =
      `https://api.openweathermap.org/data/2.5/weather?lat=${ADEN_COORDINATES.lat}&lon=${ADEN_COORDINATES.lon}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=ar`;

    const res = await fetch(url);
    if (!res.ok) {
      const text = await res.text();
      console.error("Error from OpenWeather:", text);
      return new Response("Error fetching weather", { status: 500 });
    }

    const data = await res.json();

    const temperature = Math.round(data.main.temp);
    const condition = (data.weather?.[0]?.description as string) || "غير معروف";
    const humidity = data.main.humidity ?? null;
    const windSpeed = data.wind?.speed ?? null;
    const iconCode = (data.weather?.[0]?.icon as string) || "01d";

    const insertRes = await fetch(
      `${SUPABASE_URL}/rest/v1/weather_aden_hourly`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          temperature,
          condition,
          humidity,
          wind_speed: windSpeed,
          icon: iconCode,
          raw: data,
        }),
      },
    );

    if (!insertRes.ok) {
      const text = await insertRes.text();
      console.error("Error inserting into weather_aden_hourly:", text);
      return new Response("Error inserting data", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Unexpected error in fetch-weather-aden:", err);
    return new Response("Server error", { status: 500 });
  }
});
