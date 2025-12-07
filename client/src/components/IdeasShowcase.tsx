import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  ChevronLeft, 
  ChevronRight, 
  Star,
  Users,
  TrendingUp,
  Heart
} from 'lucide-react';

const IdeasShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const ideas = [
    {
      id: 2,
      title: 'ورشة البرمجة للشباب',
      description: 'تعلم البرمجة وتطوير التطبيقات مع أفضل المطورين في عدن',
      category: 'تعليمي',
      participants: 89,
      rating: 4.9,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 3,
      title: 'مشروع دعم الأسر المحتاجة',
      description: 'ساهم في توفير الغذاء والملابس للأسر المحتاجة في عدن',
      category: 'إنساني',
      participants: 203,
      rating: 4.7,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 4,
      title: 'مهرجان التراث العدني',
      description: 'احتفل بتراث عدن العريق من خلال فعاليات ثقافية متنوعة',
      category: 'ثقافي',
      participants: 312,
      rating: 4.6,
      icon: Star,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  const nextIdea = () => {
    setCurrentIndex((prev) => (prev + 1) % ideas.length);
  };

  const prevIdea = () => {
    setCurrentIndex((prev) => (prev - 1 + ideas.length) % ideas.length);
  };

  const currentIdea = ideas[currentIndex];
  const IconComponent = currentIdea.icon;

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-lg font-bold text-gray-800">
            <Lightbulb className="w-5 h-5 text-yellow-500 ml-2" />
            أفكار عدن
          </CardTitle>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Button
              variant="outline"
              size="sm"
              onClick={prevIdea}
              className="p-2"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextIdea}
              className="p-2"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={`p-4 rounded-lg ${currentIdea.bgColor} transition-all duration-300`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <IconComponent className={`w-6 h-6 ${currentIdea.color} ml-2`} />
              <span className={`text-sm font-medium px-2 py-1 rounded-full bg-white ${currentIdea.color}`}>
                {currentIdea.category}
              </span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-500 ml-1" />
              {currentIdea.rating}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {currentIdea.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {currentIdea.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 ml-1" />
              {currentIdea.participants} مشارك
            </div>
            <Button size="sm" className="text-xs">
              انضم الآن
            </Button>
          </div>
        </div>
        
        {/* مؤشرات الصفحات */}
        <div className="flex justify-center mt-4 space-x-2 rtl:space-x-reverse">
          {ideas.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeasShowcase;