import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const EXCHANGE_API_KEY = Deno.env.get("EXCHANGE_RATES_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
serve(async () => {
  if (!EXCHANGE_API_KEY) {
    console.error("EXCHANGE_RATES_API_KEY is not set");
    return new Response("Missing API key", { status: 500 });
  }

  try 
    const url = `https://api.exchangeratesapi.io/v1/latest?access_key=${EXCHANGE_API_KEY}&base=USD`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      console.error("Error from exchangeratesapi:", text);
      return new Response("Error fetching rates", { status: 500 });
    }

    const data = await res.json();
    const base = data.base || "USD";
    const rates = data.rates || {};

    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/currency_rates_daily`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        base,
        rates,
      }),
    });

    if (!insertRes.ok) {
      const text = await insertRes.text();
      console.error("Error inserting into currency_rates_daily:", text);
      return new Response("Error inserting data", { status: 500 });
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response("Server error", { status: 500 });
  }
});