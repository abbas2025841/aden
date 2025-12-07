# Design Document - Greeting Card Enhancement

## Overview

تصميم شامل لتحسين مكون بطاقة الترحيب (GreetingSection) في الصفحة الرئيسية لتطبيق عدن لايف. سيتم استخدام تأثيرات وتصاميم حديثة مستوحاة من ReactBits و Uiverse لإنشاء تجربة مستخدم جذابة ومتحركة مع الحفاظ على الأداء والوصول.

### Design Goals

1. **Visual Appeal**: إنشاء بطاقة ترحيب جذابة بصرياً مع تأثيرات حديثة
2. **Performance**: الحفاظ على أداء عالي (60 FPS) مع تأثيرات سلسة
3. **Accessibility**: ضمان التوافق مع معايير WCAG AA
4. **RTL Support**: دعم كامل للغة العربية واتجاه RTL
5. **Responsiveness**: تجربة متسقة على جميع أحجام الشاشات
6. **Dark Mode**: دعم كامل للوضع الداكن مع ألوان مناسبة

## Architecture

### Component Structure

```
GreetingSection (Container)
├── GreetingHeader (Title + Icon)
│   ├── AnimatedIcon (Sun/Moon with pulse)
│   └── GreetingText (Time-based greeting)
├── WelcomeMessage (Subtitle)
├── InfoCards (Grid Container)
│   ├── LocationCard (MapPin + City)
│   ├── TimeCard (Clock + Current Time)
│   └── WeatherCard (Weather Icon + Temp)
└── MessageCard (Heart + Welcome Message)
```

### Technology Stack

- **React 18**: Functional components with hooks
- **TypeScript**: Type-safe component props
- **Tailwind CSS**: Utility-first styling
- **CSS Variables**: Design system tokens
- **Framer Motion** (optional): Advanced animations
- **Lucide React**: Icon library

## Components and Interfaces

### 1. GreetingSection Component

المكون الرئيسي الذي يحتوي على جميع العناصر.

```typescript
interface GreetingSectionProps {
  className?: string;
  showWeather?: boolean;
  showTime?: boolean;
  showLocation?: boolean;
  animated?: boolean;
}

export default function GreetingSection({
  className = '',
  showWeather = true,
  showTime = true,
  showLocation = true,
  animated = true,
}: GreetingSectionProps): JSX.Element;
```

**Features:**
- Glassmorphism effect with backdrop-blur
- Gradient background with smooth transitions
- Hover effect with elevation
- Fade-in animation on mount
- Responsive padding and spacing

### 2. GreetingHeader Component

عرض التحية المناسبة للوقت مع أيقونة متحركة.

```typescript
interface GreetingHeaderProps {
  className?: string;
  animated?: boolean;
}

interface GreetingData {
  text: string;
  icon: React.ReactNode;
  iconColor: string;
}

function getGreetingData(hour: number): GreetingData;
```

**Features:**
- Time-based greeting (صباح الخير / مساء الخير)
- Animated icon with pulse effect
- Smooth color transitions
- Gradient text effect

### 3. InfoCards Component

عرض ثلاث بطاقات معلومات (الموقع، الوقت، الطقس).

```typescript
interface InfoCardsProps {
  showWeather?: boolean;
  showTime?: boolean;
  showLocation?: boolean;
  animated?: boolean;
}

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  delay?: number;
}
```

**Features:**
- Stagger animation (تأخير تدريجي)
- Hover scale effect (1.05)
- Glassmorphism with backdrop-blur
- Color-coded icons
- Auto-update for time

### 4. MessageCard Component

عرض رسالة ترحيبية دافئة مع أيقونة قلب.

```typescript
interface MessageCardProps {
  message?: string;
  animated?: boolean;
  className?: string;
}
```

**Features:**
- Pulsing heart icon
- Shimmer effect every 3 seconds
- Gradient background (red to pink)
- Hover bounce effect
- Smooth transitions

## Data Models

### Greeting Time Ranges

```typescript
enum TimeOfDay {
  MORNING = 'morning',    // 5:00 - 11:59
  AFTERNOON = 'afternoon', // 12:00 - 16:59
  EVENING = 'evening',     // 17:00 - 20:59
  NIGHT = 'night'          // 21:00 - 4:59
}

interface TimeRange {
  start: number;
  end: number;
  greeting: string;
  icon: 'sun' | 'moon' | 'sunset';
  iconColor: string;
}

const TIME_RANGES: Record<TimeOfDay, TimeRange> = {
  [TimeOfDay.MORNING]: {
    start: 5,
    end: 11,
    greeting: 'صباح الخير',
    icon: 'sun',
    iconColor: 'text-yellow-500'
  },
  [TimeOfDay.AFTERNOON]: {
    start: 12,
    end: 16,
    greeting: 'مساء الخير',
    icon: 'sun',
    iconColor: 'text-orange-500'
  },
  [TimeOfDay.EVENING]: {
    start: 17,
    end: 20,
    greeting: 'مساء الخير',
    icon: 'sunset',
    iconColor: 'text-orange-600'
  },
  [TimeOfDay.NIGHT]: {
    start: 21,
    end: 4,
    greeting: 'مساء الخير',
    icon: 'moon',
    iconColor: 'text-blue-500'
  }
};
```

### Animation Configuration

```typescript
interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
  type: 'fade' | 'slide' | 'scale' | 'bounce';
}

const ANIMATION_CONFIGS = {
  fadeIn: {
    duration: 500,
    delay: 0,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    type: 'fade' as const
  },
  stagger: {
    duration: 300,
    delay: 100, // per item
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    type: 'fade' as const
  },
  hover: {
    duration: 300,
    delay: 0,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
    type: 'scale' as const
  },
  pulse: {
    duration: 2000,
    delay: 0,
    easing: 'ease-in-out',
    type: 'scale' as const
  }
};
```

### Color Scheme

```typescript
interface ColorScheme {
  light: {
    background: string;
    backgroundHover: string;
    border: string;
    text: string;
    textSecondary: string;
  };
  dark: {
    background: string;
    backgroundHover: string;
    border: string;
    text: string;
    textSecondary: string;
  };
}

const GREETING_COLORS: ColorScheme = {
  light: {
    background: 'from-blue-50 via-indigo-50 to-purple-50',
    backgroundHover: 'from-blue-100 via-indigo-100 to-purple-100',
    border: 'border-blue-200',
    text: 'text-gray-800',
    textSecondary: 'text-gray-600'
  },
  dark: {
    background: 'from-gray-800 via-gray-700 to-gray-900',
    backgroundHover: 'from-gray-700 via-gray-600 to-gray-800',
    border: 'border-gray-600',
    text: 'text-white',
    textSecondary: 'text-gray-300'
  }
};
```

## Design Patterns

### 1. Glassmorphism Effect

```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}

.dark .glass-card {
  background: rgba(17, 24, 39, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### 2. Gradient Animations

```css
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animated-gradient {
  background: linear-gradient(
    270deg,
    var(--color-primary-blue),
    var(--color-primary-purple),
    var(--color-primary-pink)
  );
  background-size: 200% 200%;
  animation: gradient-shift 10s ease infinite;
}
```

### 3. Shimmer Effect

```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 3s infinite;
}
```

### 4. Stagger Animation

```typescript
const staggerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: 'easeOut'
    }
  })
};

// Usage
{items.map((item, index) => (
  <motion.div
    key={index}
    custom={index}
    initial="hidden"
    animate="visible"
    variants={staggerVariants}
  >
    {item}
  </motion.div>
))}
```

### 5. Hover Effects

```css
.hover-lift {
  transition: transform var(--transition-normal),
              box-shadow var(--transition-normal);
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover);
}

.hover-scale {
  transition: transform var(--transition-normal);
}

.hover-scale:hover {
  transform: scale(1.05);
}

.hover-bounce {
  transition: transform var(--transition-normal);
}

.hover-bounce:hover {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

## Styling System

### CSS Variables Usage

```typescript
// استخدام المتغيرات من variables.css
const styles = {
  container: {
    padding: 'var(--spacing-md)',
    borderRadius: 'var(--radius-xl)',
    transition: 'var(--transition-normal)',
  },
  card: {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    boxShadow: 'var(--shadow-card)',
  },
  cardHover: {
    background: 'var(--card-bg-hover)',
    boxShadow: 'var(--shadow-card-hover)',
  }
};
```

### Tailwind Classes

```typescript
const tailwindClasses = {
  container: 'p-4 rounded-xl transition-all duration-300',
  gradient: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
  gradientDark: 'dark:from-gray-800 dark:via-gray-700 dark:to-gray-900',
  glass: 'backdrop-blur-md bg-white/10 dark:bg-gray-900/70',
  border: 'border border-blue-100 dark:border-gray-600',
  shadow: 'shadow-sm hover:shadow-xl',
  text: 'text-gray-800 dark:text-white',
  textSecondary: 'text-gray-600 dark:text-gray-300',
};
```

### Responsive Design

```typescript
const responsiveClasses = {
  container: {
    mobile: 'p-3 text-sm',
    tablet: 'p-4 text-base',
    desktop: 'p-6 text-lg max-w-3xl mx-auto'
  },
  grid: {
    mobile: 'grid-cols-3 gap-2',
    tablet: 'grid-cols-3 gap-3',
    desktop: 'grid-cols-3 gap-4'
  },
  icon: {
    mobile: 'w-4 h-4',
    tablet: 'w-5 h-5',
    desktop: 'w-6 h-6'
  }
};
```

## Error Handling

### Graceful Degradation

```typescript
// إذا فشل تحميل الطقس
function WeatherCardWithFallback() {
  const { data, error, isLoading } = useWeather();
  
  if (error) {
    return (
      <div className="info-card">
        <Cloud className="w-4 h-4 text-gray-400" />
        <span className="text-xs">--°</span>
      </div>
    );
  }
  
  if (isLoading) {
    return <WeatherCardSkeleton />;
  }
  
  return <WeatherCard data={data} />;
}
```

### Animation Fallbacks

```typescript
// تعطيل التأثيرات إذا كان المستخدم يفضل reduced motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

const animationProps = prefersReducedMotion
  ? {}
  : {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5 }
    };
```

### Browser Compatibility

```typescript
// التحقق من دعم backdrop-filter
const supportsBackdropFilter = CSS.supports('backdrop-filter', 'blur(10px)');

const glassStyles = supportsBackdropFilter
  ? 'backdrop-blur-md bg-white/10'
  : 'bg-white/80'; // fallback
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Time-based greeting accuracy
*For any* hour of the day (0-23), the greeting text and icon should match the correct time range (morning: 5-11, afternoon: 12-16, evening: 17-20, night: 21-4)
**Validates: Requirements 1.2**

### Property 2: Animation duration constraint
*For all* CSS transitions and animations in the component, the duration should not exceed 500ms
**Validates: Requirements 5.1**

### Property 3: Reduced motion compliance
*For any* user with prefers-reduced-motion enabled, all animations should be disabled or reduced to minimal duration (< 10ms)
**Validates: Requirements 5.2**

### Property 4: Color contrast compliance
*For all* text elements in both light and dark modes, the contrast ratio against their background should be >= 4.5:1 (WCAG AA)
**Validates: Requirements 1.5, 3.5, 6.1**

### Property 5: Time auto-update
*For any* time display, when one minute passes, the displayed time should update to reflect the new current time
**Validates: Requirements 2.4**

### Property 6: Shimmer effect timing
*For any* shimmer animation on the message card, the effect should repeat every 3 seconds (±100ms tolerance)
**Validates: Requirements 3.3**

### Property 7: Aspect ratio preservation
*For all* screen sizes (320px to 1920px), the visual proportions of card elements should maintain their relative aspect ratios
**Validates: Requirements 4.5**

### Property 8: ARIA label completeness
*For all* interactive and informational elements, appropriate aria-labels or aria-describedby attributes should be present
**Validates: Requirements 6.2, 6.5**

### Property 9: RTL icon positioning
*For any* icon-text pair, when direction is RTL, icons should appear on the correct side (opposite of LTR)
**Validates: Requirements 7.2**

### Property 10: RTL animation direction
*For any* directional animation (slide-left, slide-right), when direction is RTL, the animation direction should be reversed
**Validates: Requirements 7.3**

### Property 11: First Contentful Paint performance
*For any* initial render of the greeting card, the FCP (First Contentful Paint) should occur within 500ms
**Validates: Requirements 8.1**

### Property 12: Animation frame rate
*For all* running animations, the frame rate should maintain >= 60 FPS (frame time <= 16.67ms)
**Validates: Requirements 8.2**

### Property 13: Re-render optimization
*For any* prop change that doesn't affect the greeting card's output, the component should not re-render (using React.memo)
**Validates: Requirements 8.5**

## Testing Strategy

### Unit Tests

سنستخدم **Vitest** و **React Testing Library** لاختبار المكونات.

```typescript
// GreetingSection.test.tsx
describe('GreetingSection', () => {
  it('should render greeting based on time', () => {
    // Test morning greeting
    vi.setSystemTime(new Date('2024-01-01 09:00:00'));
    render(<GreetingSection />);
    expect(screen.getByText('صباح الخير')).toBeInTheDocument();
    
    // Test evening greeting
    vi.setSystemTime(new Date('2024-01-01 18:00:00'));
    render(<GreetingSection />);
    expect(screen.getByText('مساء الخير')).toBeInTheDocument();
  });
  
  it('should show all info cards by default', () => {
    render(<GreetingSection />);
    expect(screen.getByText('عدن')).toBeInTheDocument();
    expect(screen.getByRole('time')).toBeInTheDocument();
  });
  
  it('should apply hover effects', async () => {
    render(<GreetingSection />);
    const card = screen.getByTestId('greeting-card');
    
    await userEvent.hover(card);
    expect(card).toHaveClass('hover:shadow-xl');
  });
  
  it('should support dark mode', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <GreetingSection />
      </ThemeProvider>
    );
    const card = screen.getByTestId('greeting-card');
    expect(card).toHaveClass('dark:from-gray-800');
  });
});
```

### Accessibility Tests

```typescript
describe('GreetingSection Accessibility', () => {
  it('should have proper ARIA labels', () => {
    render(<GreetingSection />);
    expect(screen.getByLabelText('بطاقة الترحيب')).toBeInTheDocument();
    expect(screen.getByLabelText('الموقع الحالي')).toBeInTheDocument();
  });
  
  it('should have sufficient color contrast', async () => {
    const { container } = render(<GreetingSection />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should be keyboard navigable', async () => {
    render(<GreetingSection />);
    await userEvent.tab();
    // Test focus indicators
  });
});
```

### Performance Tests

```typescript
describe('GreetingSection Performance', () => {
  it('should render within 500ms', async () => {
    const startTime = performance.now();
    render(<GreetingSection />);
    const endTime = performance.now();
    
    expect(endTime - startTime).toBeLessThan(500);
  });
  
  it('should not cause unnecessary re-renders', () => {
    const { rerender } = render(<GreetingSection />);
    const renderCount = React.useRef(0);
    
    // Simulate prop changes
    rerender(<GreetingSection />);
    expect(renderCount.current).toBe(1);
  });
  
  it('should maintain 60 FPS during animations', async () => {
    // Test animation performance
  });
});
```

### Visual Regression Tests

```typescript
describe('GreetingSection Visual', () => {
  it('should match snapshot in light mode', () => {
    const { container } = render(<GreetingSection />);
    expect(container).toMatchSnapshot();
  });
  
  it('should match snapshot in dark mode', () => {
    const { container } = render(
      <ThemeProvider defaultTheme="dark">
        <GreetingSection />
      </ThemeProvider>
    );
    expect(container).toMatchSnapshot();
  });
});
```

## Performance Optimization

### 1. React.memo

```typescript
export const GreetingSection = React.memo(function GreetingSection(props) {
  // Component logic
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.showWeather === nextProps.showWeather &&
         prevProps.showTime === nextProps.showTime;
});
```

### 2. useMemo for Expensive Calculations

```typescript
const greetingData = useMemo(() => {
  const hour = new Date().getHours();
  return getGreetingData(hour);
}, []); // Only calculate once on mount
```

### 3. useCallback for Event Handlers

```typescript
const handleCardHover = useCallback((cardId: string) => {
  // Handle hover
}, []);
```

### 4. CSS Transforms for Animations

```css
/* ✅ Good - GPU accelerated */
.card {
  transform: translateY(-4px);
  transition: transform 300ms;
}

/* ❌ Bad - causes reflow */
.card {
  top: -4px;
  transition: top 300ms;
}
```

### 5. Lazy Loading

```typescript
// تحميل WeatherCard فقط عند الحاجة
const WeatherCard = React.lazy(() => import('./WeatherCard'));

<Suspense fallback={<WeatherCardSkeleton />}>
  {showWeather && <WeatherCard />}
</Suspense>
```

## Accessibility Features

### 1. ARIA Labels

```tsx
<div
  role="region"
  aria-label="بطاقة الترحيب"
  aria-describedby="greeting-description"
>
  <h1 id="greeting-title">صباح الخير في عدن</h1>
  <p id="greeting-description">مرحباً بك في تطبيق عدن لايف</p>
</div>
```

### 2. Keyboard Navigation

```tsx
<div
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  {/* Content */}
</div>
```

### 3. Focus Indicators

```css
*:focus-visible {
  outline: 2px solid var(--color-primary-purple);
  outline-offset: 2px;
  border-radius: var(--radius-md);
}
```

### 4. Color Contrast

```typescript
// التأكد من نسبة التباين >= 4.5:1
const textColors = {
  onLight: 'text-gray-800', // Contrast ratio: 12.63:1
  onDark: 'text-white',     // Contrast ratio: 21:1
  onPurple: 'text-white',   // Contrast ratio: 4.52:1
};
```

### 5. Screen Reader Support

```tsx
<span className="sr-only">
  الوقت الحالي: {currentTime}
</span>
<time dateTime={isoTime} aria-label={`الساعة ${currentTime}`}>
  {displayTime}
</time>
```

## RTL Support

### 1. Logical Properties

```css
/* ✅ Good - RTL compatible */
.card {
  margin-inline-start: var(--spacing-md);
  padding-inline-end: var(--spacing-sm);
  text-align: start;
}

/* ❌ Bad - Not RTL compatible */
.card {
  margin-left: 16px;
  padding-right: 8px;
  text-align: left;
}
```

### 2. Icon Positioning

```tsx
<div className="flex items-center gap-2">
  <span className="order-last rtl:order-first">
    <Icon />
  </span>
  <span>النص</span>
</div>
```

### 3. Animation Direction

```css
/* Reverse animations in RTL */
[dir="rtl"] .slide-in-right {
  animation-name: slideInLeft;
}

[dir="rtl"] .slide-in-left {
  animation-name: slideInRight;
}
```

## Implementation Notes

### Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1",
    "next-themes": "^0.2.1",
    "clsx": "^2.0.0"
  },
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "vitest": "^0.34.0",
    "axe-core": "^4.7.2"
  }
}
```

### File Structure

```
client/src/
├── components/
│   ├── GreetingSection/
│   │   ├── index.tsx (main component)
│   │   ├── GreetingHeader.tsx
│   │   ├── InfoCards.tsx
│   │   ├── MessageCard.tsx
│   │   ├── animations.ts
│   │   ├── styles.ts
│   │   └── types.ts
│   └── WeatherCard.tsx (existing)
├── hooks/
│   ├── useGreeting.ts
│   └── useTime.ts
├── styles/
│   ├── variables.css (existing)
│   └── animations.css (new)
└── utils/
    └── time.ts
```

### Browser Support

- Chrome/Edge: 90+
- Firefox: 88+
- Safari: 14+
- Mobile Safari: 14+
- Android Chrome: 90+

### Performance Targets

- First Contentful Paint (FCP): < 500ms
- Time to Interactive (TTI): < 1s
- Animation Frame Rate: 60 FPS
- Bundle Size Impact: < 10 KB (gzipped)

## Future Enhancements

1. **Personalization**: حفظ تفضيلات المستخدم للتحية
2. **Dynamic Backgrounds**: خلفيات متغيرة حسب الوقت/الطقس
3. **Micro-interactions**: تأثيرات إضافية عند التفاعل
4. **Sound Effects**: أصوات خفيفة عند التفاعل (اختياري)
5. **Haptic Feedback**: اهتزاز خفيف على الموبايل
6. **Seasonal Themes**: تصاميم موسمية (رمضان، أعياد، إلخ)

## References

- ReactBits: https://www.reactbits.dev/get-started/index
- Uiverse: https://uiverse.io/
- Framer Motion: https://www.framer.com/motion/
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- CSS Tricks - Glassmorphism: https://css-tricks.com/glassmorphism/
