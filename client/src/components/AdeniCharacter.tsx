import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AdeniCharacterProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  talking?: boolean;
  mood?: 'happy' | 'thinking' | 'listening' | 'speaking';
  className?: string;
  onClick?: () => void;
}

export const AdeniCharacter: React.FC<AdeniCharacterProps> = ({
  size = 'md',
  animated = true,
  talking = false,
  mood = 'happy',
  className,
  onClick,
}) => {
  const [eyeBlink, setEyeBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  // تأثير الرمش
  useEffect(() => {
    if (!animated) return;

    const blinkInterval = setInterval(() => {
      setEyeBlink(true);
      setTimeout(() => setEyeBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, [animated]);

  // تأثير الكلام
  useEffect(() => {
    if (!talking) {
      setMouthOpen(false);
      return;
    }

    const talkInterval = setInterval(() => {
      setMouthOpen(prev => !prev);
    }, 200 + Math.random() * 100);

    return () => clearInterval(talkInterval);
  }, [talking]);

  const getMoodClasses = () => {
    switch (mood) {
      case 'thinking':
        return {
          eyeColor: 'fill-blue-400',
          mouthShape: 'M35,65 Q45,60 55,65',
          eyebrow: 'M30,45 Q40,40 50,45',
        };
      case 'listening':
        return {
          eyeColor: 'fill-green-400',
          mouthShape: 'M35,65 Q45,70 55,65',
          eyebrow: 'M30,45 Q40,50 50,45',
        };
      case 'speaking':
        return {
          eyeColor: 'fill-purple-400',
          mouthShape: mouthOpen ? 'M35,65 Q45,75 55,65' : 'M35,65 Q45,60 55,65',
          eyebrow: 'M30,45 Q40,40 50,45',
        };
      default: // happy
        return {
          eyeColor: 'fill-blue-500',
          mouthShape: 'M35,65 Q45,70 55,65',
          eyebrow: 'M30,45 Q40,50 50,45',
        };
    }
  };

  const moodClasses = getMoodClasses();

  return (
    <div
      className={cn(
        'relative cursor-pointer transition-transform hover:scale-105',
        sizeClasses[size],
        className
      )}
      onClick={onClick}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
      >
        {/* العمامة/الغترة */}
        <g>
          {/* العمامة الأساسية */}
          <ellipse
            cx="50"
            cy="25"
            rx="35"
            ry="15"
            className="fill-blue-600"
          />
          {/* طية العمامة */}
          <ellipse
            cx="50"
            cy="20"
            rx="30"
            ry="12"
            className="fill-blue-700"
          />
          {/* عقدة العمامة */}
          <circle
            cx="70"
            cy="25"
            r="8"
            className="fill-blue-800"
          />
        </g>

        {/* الوجه */}
        <circle
          cx="50"
          cy="55"
          r="25"
          className="fill-yellow-100"
          stroke="currentColor"
          strokeWidth="1"
        />

        {/* العينان */}
        <g>
          {/* العين اليسرى */}
          <ellipse
            cx="42"
            cy="50"
            rx="4"
            ry={eyeBlink ? "1" : "6"}
            className={moodClasses.eyeColor}
          />
          {/* العين اليمنى */}
          <ellipse
            cx="58"
            cy="50"
            rx="4"
            ry={eyeBlink ? "1" : "6"}
            className={moodClasses.eyeColor}
          />
          
          {/* بؤبؤ العينين */}
          <circle cx="42" cy="50" r="2" className="fill-black" />
          <circle cx="58" cy="50" r="2" className="fill-black" />
          
          {/* لمعان العينين */}
          <circle cx="43" cy="49" r="1" className="fill-white" />
          <circle cx="59" cy="49" r="1" className="fill-white" />
        </g>

        {/* الحاجبان */}
        <g>
          <path
            d={moodClasses.eyebrow}
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="stroke-gray-700"
          />
        </g>

        {/* الأنف */}
        <ellipse
          cx="50"
          cy="58"
          rx="2"
          ry="3"
          className="fill-yellow-200"
        />

        {/* الفم */}
        <path
          d={moodClasses.mouthShape}
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="stroke-red-400"
        />

        {/* اللحية الخفيفة */}
        <g>
          <ellipse
            cx="50"
            cy="75"
            rx="12"
            ry="8"
            className="fill-gray-300"
            opacity="0.6"
          />
        </g>

        {/* الثوب الأزرق */}
        <g>
          {/* الجسم */}
          <rect
            x="35"
            y="80"
            width="30"
            height="20"
            className="fill-blue-500"
            rx="5"
          />
          {/* الياقة */}
          <rect
            x="40"
            y="80"
            width="20"
            height="5"
            className="fill-blue-600"
            rx="2"
          />
          {/* الأزرار */}
          <circle cx="50" cy="85" r="1" className="fill-yellow-400" />
          <circle cx="50" cy="90" r="1" className="fill-yellow-400" />
          <circle cx="50" cy="95" r="1" className="fill-yellow-400" />
        </g>

        {/* تأثيرات الحركة */}
        {animated && (
          <g>
            {/* خطوط الحركة عند الكلام */}
            {talking && (
              <>
                <path
                  d="M25,65 Q20,60 15,65"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  className="stroke-blue-300 opacity-60"
                />
                <path
                  d="M75,65 Q80,60 85,65"
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  className="stroke-blue-300 opacity-60"
                />
              </>
            )}
            
            {/* تأثير التفكير */}
            {mood === 'thinking' && (
              <g>
                <circle cx="75" cy="30" r="2" className="fill-blue-300 opacity-60" />
                <circle cx="80" cy="25" r="1.5" className="fill-blue-300 opacity-40" />
                <circle cx="85" cy="20" r="1" className="fill-blue-300 opacity-20" />
              </g>
            )}
          </g>
        )}
      </svg>

      {/* تأثير النقر */}
      {onClick && (
        <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 hover:opacity-10 transition-opacity" />
      )}
    </div>
  );
};

// مكون الشخصية مع الحالات المختلفة
export const AdeniCharacterWithStates: React.FC<AdeniCharacterProps> = (props) => {
  const [currentMood, setCurrentMood] = useState<'happy' | 'thinking' | 'listening' | 'speaking'>('happy');

  useEffect(() => {
    const moods: Array<'happy' | 'thinking' | 'listening' | 'speaking'> = ['happy', 'thinking', 'listening', 'speaking'];
    const interval = setInterval(() => {
      setCurrentMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AdeniCharacter
      {...props}
      mood={currentMood}
      talking={currentMood === 'speaking'}
    />
  );
};

// مكون الشخصية التفاعلية
export const InteractiveAdeniCharacter: React.FC<AdeniCharacterProps> = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 1000);
      }}
    >
      <AdeniCharacter
        {...props}
        mood={isClicked ? 'speaking' : isHovered ? 'thinking' : 'happy'}
        talking={isClicked}
        animated={true}
      />
    </div>
  );
};

export default AdeniCharacter;
