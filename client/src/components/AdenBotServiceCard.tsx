import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';

const AdenBotServiceCard: React.FC = () => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                مساعد عدن الذكي
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                اسألني عن أي شيء في عدن
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="flex items-center text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2 animate-pulse"></div>
              متاح الآن
            </div>
            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
              <MessageCircle className="w-4 h-4 ml-1" />
              تحدث معي
            </Button>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Sparkles className="w-4 h-4 ml-2 text-purple-500" />
            <span>يمكنني مساعدتك في العثور على الخدمات، الإجابة على الأسئلة، وتقديم المعلومات المحدثة</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdenBotServiceCard;

