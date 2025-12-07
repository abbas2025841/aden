import React, { useEffect, useState } from "react";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

interface HomeTank {
  id: string;
  name: string;
  capacity: string;
  material: string;
  price: string;
  seller: string;
  contact: string | null;
  location: string | null;
  district: string | null;
  status: string;
  created_at: string;
}

const HomeTanksTestPage: React.FC = () => {
  const [tanks, setTanks] = useState<HomeTank[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTanks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("home_tanks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTanks((data as HomeTank[]) || []);
    } catch (err: any) {
      console.error("Error fetching home_tanks:", err);
      setError(err.message || "حدث خطأ أثناء جلب البيانات");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTanks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white" dir="rtl">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-1">اختبار خزانات Supabase</h1>
            <p className="text-sm text-gray-300">
              هذه الصفحة لعرض كل السجلات من جدول <code>home_tanks</code> في Supabase.
            </p>
          </div>
          <Button
            onClick={fetchTanks}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "جاري التحديث..." : "تحديث"}
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/40 border border-red-700 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {tanks.length === 0 && !isLoading && !error && (
          <div className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-6 text-center text-gray-300">
            لا توجد سجلات بعد في جدول <code>home_tanks</code>.
          </div>
        )}

        {tanks.length > 0 && (
          <div className="space-y-3">
            {tanks.map((tank) => (
              <div
                key={tank.id}
                className="rounded-lg bg-gray-900 border border-gray-800 px-4 py-3 text-sm"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold">{tank.name}</div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      tank.status === "approved"
                        ? "bg-green-700 text-green-100"
                        : tank.status === "pending"
                        ? "bg-yellow-700 text-yellow-100"
                        : "bg-red-700 text-red-100"
                    }`}
                  >
                    {tank.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300">
                  <div>
                    <span className="font-semibold">السعة:</span> {tank.capacity}
                  </div>
                  <div>
                    <span className="font-semibold">المادة:</span> {tank.material}
                  </div>
                  <div>
                    <span className="font-semibold">السعر:</span> {tank.price}
                  </div>
                  <div>
                    <span className="font-semibold">المورد:</span> {tank.seller}
                  </div>
                  {tank.contact && (
                    <div>
                      <span className="font-semibold">التواصل:</span> {tank.contact}
                    </div>
                  )}
                  {tank.location && (
                    <div>
                      <span className="font-semibold">الموقع:</span> {tank.location}
                    </div>
                  )}
                  {tank.district && (
                    <div>
                      <span className="font-semibold">المديرية:</span> {tank.district}
                    </div>
                  )}
                  <div>
                    <span className="font-semibold">تاريخ الإضافة:</span>{" "}
                    {new Date(tank.created_at).toLocaleString("ar-SA")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HomeTanksTestPage;
