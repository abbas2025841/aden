# Design System Files

هذا المجلد يحتوي على جميع ملفات نظام التصميم للتطبيق.

## الملفات

### 1. `variables.css`
يحتوي على جميع CSS Variables المستخدمة في التطبيق:
- الألوان (Primary, Background, Card, Categories)
- المسافات (Spacing)
- Border Radius
- Transitions
- Shadows
- Breakpoints
- Z-Index Layers

**الاستخدام**:
```css
.my-element {
  color: var(--color-primary-purple);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  transition: all var(--transition-normal);
}
```

### 2. `theme.ts`
TypeScript theme object مع type safety:
- نفس القيم من `variables.css`
- TypeScript types
- Helper functions

**الاستخدام**:
```typescript
import { theme, getCategoryColor, getCategoryBgClass } from '@/styles/theme';

const color = getCategoryColor('mathematics'); // '#2563EB'
const bgClass = getCategoryBgClass('arabic'); // 'bg-green-600'
```

### 3. `global.css`
الأنماط العامة للتطبيق:
- RTL Support
- Base Styles
- Typography
- Utility Classes

**الاستخدام**:
```tsx
<div className="container">
  <div className="grid-responsive">
    <div className="line-clamp-2">نص طويل...</div>
  </div>
</div>
```

### 4. `animations.css`
جميع الـ animations والـ keyframes:
- Keyframes (fadeIn, pulse, slideIn, etc.)
- Animation Utility Classes
- Transition Classes
- Hover Effects
- Loading States

**الاستخدام**:
```tsx
<div className="animate-fadeIn hover-lift">
  محتوى مع animation
</div>
```

### 5. `index.ts`
نقطة دخول واحدة لجميع الأنماط:

**الاستخدام**:
```typescript
// Import all styles
import '@/styles';

// Or import specific utilities
import { theme, getCategoryColor } from '@/styles';
```

## القواعد

### 1. استخدام CSS Variables فقط
❌ **خطأ**:
```css
.element {
  color: #8B5CF6;
  padding: 16px;
}
```

✅ **صحيح**:
```css
.element {
  color: var(--color-primary-purple);
  padding: var(--spacing-md);
}
```

### 2. دعم RTL
جميع الأنماط يجب أن تدعم RTL:

```css
/* استخدم logical properties */
.element {
  margin-inline-start: var(--spacing-md); /* بدلاً من margin-left */
  padding-inline-end: var(--spacing-sm); /* بدلاً من padding-right */
}

/* أو استخدم RTL-specific styles */
[dir="rtl"] .element {
  text-align: right;
}
```

### 3. Responsive Design
استخدم الـ breakpoints المحددة:

```css
/* Mobile first */
.element {
  font-size: 14px;
}

/* Tablet */
@media (min-width: 540px) {
  .element {
    font-size: 16px;
  }
}

/* Desktop */
@media (min-width: 768px) {
  .element {
    font-size: 18px;
  }
}
```

### 4. Animations
استخدم الـ animations المحددة مسبقاً:

```tsx
// Utility classes
<div className="animate-fadeIn duration-normal">...</div>

// Custom animations
<div style={{ animation: 'fadeIn 300ms ease-out' }}>...</div>
```

### 5. Accessibility
احترم تفضيلات المستخدم:

```css
/* يتم تطبيقه تلقائياً في animations.css */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Helper Functions

### `getCategoryColor(category)`
يرجع لون الفئة بصيغة hex:
```typescript
getCategoryColor('mathematics') // '#2563EB'
```

### `getCategoryBgClass(category)`
يرجع Tailwind class للخلفية:
```typescript
getCategoryBgClass('arabic') // 'bg-green-600'
```

### `getGridColumns(width)`
يرجع عدد الأعمدة حسب عرض الشاشة:
```typescript
getGridColumns(400) // 2 (mobile)
getGridColumns(600) // 3 (tablet)
getGridColumns(800) // 4 (desktop)
```

### `isMobile(width)`, `isTablet(width)`, `isDesktop(width)`
للتحقق من نوع الجهاز:
```typescript
isMobile(400) // true
isTablet(600) // true
isDesktop(800) // true
```

### `cssVar(variable)`
لإنشاء CSS variable string:
```typescript
cssVar('color-primary-purple') // 'var(--color-primary-purple)'
```

### `createTransition(properties, duration)`
لإنشاء transition string:
```typescript
createTransition(['color', 'background'], 'fast')
// 'color 150ms ease-out, background 150ms ease-out'
```

## أمثلة

### مثال 1: بطاقة كتاب
```tsx
import { getCategoryBgClass } from '@/styles';

<div className="hover-lift transition-all">
  <div className={`${getCategoryBgClass(book.category)} p-md rounded-lg`}>
    <h3 className="line-clamp-2">{book.title}</h3>
  </div>
</div>
```

### مثال 2: Grid متجاوب
```tsx
<div className="grid-responsive gap-md">
  {books.map(book => (
    <BookCard key={book.id} book={book} />
  ))}
</div>
```

### مثال 3: Loading Skeleton
```tsx
<div className="skeleton animate-pulse" style={{ height: '200px' }} />
```

### مثال 4: Modal Animation
```tsx
<div className="modal-enter">
  <div className="animate-scaleIn">
    محتوى Modal
  </div>
</div>
```

## التحديثات المستقبلية

عند إضافة ألوان أو قيم جديدة:
1. أضف القيمة في `variables.css`
2. أضف القيمة في `theme.ts`
3. حدّث التوثيق في هذا الملف
4. اختبر على جميع الأحجام (mobile, tablet, desktop)
5. تأكد من دعم RTL

## الدعم

للأسئلة أو المشاكل، راجع:
- Design Document: `.kiro/specs/digital-library-redesign/design.md`
- Requirements: `.kiro/specs/digital-library-redesign/requirements.md`
