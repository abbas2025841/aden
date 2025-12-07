import { Card } from "@/components/EnhancedUI";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card 
        title="404 - الصفحة غير موجودة"
        description="عذراً، الصفحة التي تبحث عنها غير موجودة. تحقق من الرابط أو عد إلى الصفحة الرئيسية."
        icon={<AlertCircle className="h-8 w-8 text-red-500" />}
        className="w-full max-w-md mx-4"
      />
    </div>
  );
}
