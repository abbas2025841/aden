import React from 'react';
import { motion } from 'framer-motion';

interface AdnawiAvatarProps {
  isSpeaking?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const AdnawiAvatar: React.FC<AdnawiAvatarProps> = ({ 
  isSpeaking = false, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const _textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* الخلفية المتحركة */}
      {isSpeaking && (
        <motion.div
          className="absolute inset-0 bg-blue-500 rounded-full opacity-30"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {/* الرأس الرئيسي */}
      <motion.div
        className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg`}
        animate={isSpeaking ? {
          scale: [1, 1.05, 1],
        } : {}}
        transition={{
          duration: 0.5,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut"
        }}
      >
        {/* الوجه */}
        <div className="relative">
          {/* العينان */}
          <div className="flex items-center gap-1 mb-1">
            <motion.div
              className="w-1 h-1 bg-white rounded-full"
              animate={isSpeaking ? {
                scaleY: [1, 0.5, 1],
              } : {}}
              transition={{
                duration: 0.3,
                repeat: isSpeaking ? Infinity : 0,
                delay: 0
              }}
            />
            <motion.div
              className="w-1 h-1 bg-white rounded-full"
              animate={isSpeaking ? {
                scaleY: [1, 0.5, 1],
              } : {}}
              transition={{
                duration: 0.3,
                repeat: isSpeaking ? Infinity : 0,
                delay: 0.1
              }}
            />
          </div>
          
          {/* الفم */}
          <motion.div
            className="w-2 h-1 bg-white rounded-full mx-auto"
            animate={isSpeaking ? {
              scaleX: [1, 1.2, 1],
              scaleY: [1, 0.8, 1],
            } : {}}
            transition={{
              duration: 0.4,
              repeat: isSpeaking ? Infinity : 0,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
      
      {/* النقاط المتحركة للكلام */}
      {isSpeaking && (
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1 h-1 bg-blue-500 rounded-full"
              animate={{
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdnawiAvatar;
