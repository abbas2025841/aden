import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200",
        outlined: "bg-white border-2 border-gray-200 hover:border-primary",
        filled: "bg-primary/5 border-primary/20",
        elevated: "bg-white border-gray-200 shadow-lg",
        flat: "bg-white border-0 shadow-none",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
      interactive: {
        true: "cursor-pointer hover:shadow-md transition-shadow duration-200",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: false,
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  footer?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    interactive,
    title,
    description,
    icon,
    footer,
    loading = false,
    disabled = false,
    children,
    onClick,
    ...props 
  }, ref) => {
    const isInteractive = interactive || !!onClick;
    const isDisabled = disabled || loading;

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ 
            variant, 
            size, 
            interactive: isInteractive && !isDisabled,
            className 
          }),
          isDisabled && "opacity-50 cursor-not-allowed"
        )}
        onClick={isDisabled ? undefined : onClick}
        role={isInteractive ? "button" : undefined}
        tabIndex={isInteractive && !isDisabled ? 0 : undefined}
        onKeyDown={(e) => {
          if (isInteractive && !isDisabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick?.(e as any);
          }
        }}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        
        {(title || description || icon) && (
          <div className="flex items-start gap-4 mb-4">
            {icon && (
              <div className="flex-shrink-0 text-primary">
                {icon}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              {title && (
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {title}
                </h3>
              )}
              
              {description && (
                <p className="text-sm text-gray-600 line-clamp-3">
                  {description}
                </p>
              )}
            </div>
          </div>
        )}
        
        {children && (
          <div className="mb-4">
            {children}
          </div>
        )}
        
        {footer && (
          <div className="mt-auto pt-4 border-t border-gray-100">
            {footer}
          </div>
        )}
      </div>
    );
  }
);

Card.displayName = "Card";

// مكونات فرعية للبطاقة
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardDescription, 
  CardContent,
  cardVariants 
};
