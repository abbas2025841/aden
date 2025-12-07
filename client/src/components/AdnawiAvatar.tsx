import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdeniCharacter } from './AdeniCharacter';

interface AdnawiAvatarProps {
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
}

const AdnawiAvatar: React.FC<AdnawiAvatarProps> = ({
  isSpeaking = false,
  size = 'md',
  className = '',
  onClick
}) => {
  const [mood, setMood] = useState<'happy' | 'thinking' | 'listening' | 'speaking'>('happy');
  const [isAnimating, setIsAnimating] = useState(false);

  // تحديث الحالة حسب النشاط
  useEffect(() => {
    if (isSpeaking) {
      setMood('speaking');
      setIsAnimating(true);
    } else {
      setMood('happy');
      setIsAnimating(false);
    }
  }, [isSpeaking]);

  // تأثيرات الحركة
  const containerVariants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    speaking: {
      scale: [1, 1.05, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    },
    thinking: {
      scale: [1, 1.02, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    }
  };

  // تأثيرات الإضاءة
  const glowVariants = {
    idle: {
      opacity: 0,
      scale: 1,
    },
    speaking: {
      opacity: [0, 0.3, 0],
      scale: [1, 1.2, 1],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse" as const,
      }
    }
  };

  return (
    <div 
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
    >
      {/* تأثير الإضاءة */}
      <motion.div
        className="absolute inset-0 rounded-full bg-blue-400"
        variants={glowVariants}
        animate={isSpeaking ? 'speaking' : 'idle'}
        style={{
          filter: 'blur(8px)',
        }}
      />
      
      {/* الشخصية */}
      <motion.div
        variants={containerVariants}
        animate={isSpeaking ? 'speaking' : isAnimating ? 'thinking' : 'idle'}
        className="relative z-10"
      >
        <AdeniCharacter
          size={size}
          animated={true}
          talking={isSpeaking}
          mood={mood}
        />
      </motion.div>

      {/* مؤشر الحالة */}
      {isSpeaking && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [1, 0.7, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}

      {/* تأثيرات إضافية */}
      {isSpeaking && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-400"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      )}
    </div>
  );
};

export default AdnawiAvatar;
