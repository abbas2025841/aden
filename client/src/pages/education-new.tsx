import { useState } from "react";
import { useLocation } from "wouter";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, MapPin, Phone, Users } from "lucide-react";

export default function EducationNewPage() {
  const [, setLocation] = useLocation();

  const educationServices = [];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-6 max-w-md">
        <div className="text-center mb-8">
          <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">الخدمات التعليمية</h1>
          <p className="text-gray-600">اكتشف المؤسسات التعليمية في عدن</p>
        </div>

        <div className="grid gap-4">
          {educationServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{service.name}</span>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {service.status}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{service.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{service.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{service.students} طالب</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button onClick={() => setLocation("/")} className="w-full">
            العودة للرئيسية
          </Button>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
