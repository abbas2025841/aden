import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const AVIATIONSTACK_API_KEY = Deno.env.get("AVIATIONSTACK_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface AviationFlight {
  airline: { name: string | null };
  flight: { number: string | null };
  departure: {
    airport: string | null;
    iata: string | null;
    scheduled: string | null;
  };
  arrival: {
    airport: string | null;
    iata: string | null;
    scheduled: string | null;
  };
  flight_status: string | null;
}

serve(async () => {
  if (!AVIATIONSTACK_API_KEY) {
    console.error("AVIATIONSTACK_API_KEY is not set");
    return new Response("Missing API key", { status: 500 });
  }

  try {
    // رحلات من عدن
    const fromAdenUrl =
      `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_API_KEY}&dep_iata=ADE`;
    // رحلات إلى عدن
    const toAdenUrl =
      `http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_API_KEY}&arr_iata=ADE`;

    const [fromRes, toRes] = await Promise.all([
      fetch(fromAdenUrl),
      fetch(toAdenUrl),
    ]);

    if (!fromRes.ok) {
      const text = await fromRes.text();
      console.error("Error from aviationstack (from ADE):", text);
    }
    if (!toRes.ok) {
      const text = await toRes.text();
      console.error("Error from aviationstack (to ADE):", text);
    }

    const fromData = (await fromRes.json()) as { data?: AviationFlight[] };
    const toData = (await toRes.json()) as { data?: AviationFlight[] };

    const flights: any[] = [];

    const now = new Date().toISOString();

    const normalize = (
      item: AviationFlight,
      direction: "from_aden" | "to_aden",
    ) => {
      const airline = item.airline?.name ?? "غير معروف";
      const flightNumber = item.flight?.number ?? "N/A";

      const depAirport = item.departure?.airport ?? "";
      const depIata = item.departure?.iata ?? "";
      const depTime = item.departure?.scheduled ?? now;

      const arrAirport = item.arrival?.airport ?? "";
      const arrIata = item.arrival?.iata ?? "";
      const arrTime = item.arrival?.scheduled ?? now;

      // تحويل الأسماء لتشبه تنسيقك الحالي: "عدن (ADE)"
      const from_city =
        direction === "from_aden"
          ? `عدن (ADE)`
          : `${arrAirport || arrIata} (${arrIata || ""})`.trim();
      const to_city =
        direction === "from_aden"
          ? `${arrAirport || arrIata} (${arrIata || ""})`.trim()
          : `عدن (ADE)`;

      const from_iata = direction === "from_aden" ? "ADE" : arrIata || "";
      const to_iata = direction === "from_aden" ? arrIata || "" : "ADE";

      // مدة تقديرية بسيطة (يمكن تحسينها لاحقاً)
      const duration = "غير محدد";

      // السعر / التقييم / الفئة ليست موجودة في aviationstack
      // سنضع قيم تقريبية افتراضية يمكنك تعديلها لاحقاً.
      const price = 0;
      const currency = "ريال يمني";
      const stops = 0;
      const flightClass = "اقتصادي";
      const available = item.flight_status !== "cancelled";
      const rating = 4.5;

      const features = [
        "وجبة خفيفة",
        "حقائب 20 كيلو",
        "تأمين سفر",
      ];

      flights.push({
        direction,
        airline,
        flight_number: flightNumber,
        from_city,
        from_iata,
        to_city,
        to_iata,
        departure_time: depTime,
        arrival_time: arrTime,
        duration,
        price,
        currency,
        stops,
        class: flightClass,
        available,
        rating,
        features,
        source: "aviationstack",
        last_updated: now,
      });
    };

    (fromData.data || []).forEach((item) => normalize(item, "from_aden"));
    (toData.data || []).forEach((item) => normalize(item, "to_aden"));

    // مسح البيانات القديمة ثم إدخال الجديدة
    const deleteRes = await fetch(
      `${SUPABASE_URL}/rest/v1/flights_aden`,
      {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
      },
    );
    if (!deleteRes.ok) {
      const text = await deleteRes.text();
      console.error("Error deleting old flights_aden:", text);
    }

    if (flights.length > 0) {
      const insertRes = await fetch(
        `${SUPABASE_URL}/rest/v1/flights_aden`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
            Prefer: "return=minimal",
          },
          body: JSON.stringify(flights),
        },
      );

      if (!insertRes.ok) {
        const text = await insertRes.text();
        console.error("Error inserting flights_aden:", text);
        return new Response("Error inserting data", { status: 500 });
      }
    }

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("Unexpected error in fetch-aden-flights:", err);
    return new Response("Server error", { status: 500 });
  }
});