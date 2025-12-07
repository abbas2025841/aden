export interface AssistantMessage {
  id: number;
  message: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const assistantMessages: AssistantMessage[] = [
  {
    id: 1,
    message: "شيخ ياكربمه! شكلك محتاج مساعدة اليوم 👀",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 2,
    message: "يا أخي باين عليك مخزن وتدور أزرار التطبيق 😅",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 3,
    message: "يا ساتر! انته تدردح فوق الشاشة، أقلب أنا أبوه وأهنيك ✨",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 4,
    message: "عادك داخل التطبيق ولا قدك ضايع؟ أنا هنا من زمان أتفرج 👋",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 5,
    message: "أهاا! شكلك تحاول تسوي نفسك خبير، ولا تشل هم أنا فداك 🤓",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 6,
    message: "والله بيني وبينك حسيتك محتاج دفعة زر كذا، قول وأنا ألبيك 🚀",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 7,
    message: "هادي ضغطة غلط ولا قصدك؟ عادي.. أنا هنا أغطي فضيحتك 😂",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 8,
    message: "أوووه.. خليتني زي الدرويش أتفرج، يلا عطني أمر 😁",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 9,
    message: "عدني معك.. مش محتاج GPS، أنا البركة بعيني 🤩",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 10,
    message: "أها بو الشباب! باختصر عليك، أنا أكثر من جوجل لك 🌴",
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// دالة لاختيار رسالة عشوائية من الرسائل النشطة
export const getRandomMessage = (): string => {
  const activeMessages = assistantMessages.filter(msg => msg.active);
  if (activeMessages.length === 0) {
    return "مرحباً! أنا عدني، كيف يمكنني مساعدتك؟";
  }
  
  const randomIndex = Math.floor(Math.random() * activeMessages.length);
  return activeMessages[randomIndex].message;
};

// دالة لإضافة رسالة جديدة
export const addMessage = (message: string): AssistantMessage => {
  const newMessage: AssistantMessage = {
    id: Math.max(...assistantMessages.map(m => m.id)) + 1,
    message,
    active: true,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  assistantMessages.push(newMessage);
  return newMessage;
};

// دالة لتحديث رسالة موجودة
export const updateMessage = (id: number, message: string, active: boolean): boolean => {
  const messageIndex = assistantMessages.findIndex(msg => msg.id === id);
  if (messageIndex === -1) return false;
  
  assistantMessages[messageIndex] = {
    ...assistantMessages[messageIndex],
    message,
    active,
    updatedAt: new Date()
  };
  
  return true;
};

// دالة لحذف رسالة
export const deleteMessage = (id: number): boolean => {
  const messageIndex = assistantMessages.findIndex(msg => msg.id === id);
  if (messageIndex === -1) return false;
  
  assistantMessages.splice(messageIndex, 1);
  return true;
};

// دالة للحصول على جميع الرسائل
export const getAllMessages = (): AssistantMessage[] => {
  return [...assistantMessages];
};

// دالة للحصول على الرسائل النشطة فقط
export const getActiveMessages = (): AssistantMessage[] => {
  return assistantMessages.filter(msg => msg.active);
};
