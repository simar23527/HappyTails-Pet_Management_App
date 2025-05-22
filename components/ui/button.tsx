import React, { forwardRef } from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'link';
  asChild?: boolean;
  className?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', asChild = false, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variantStyles = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 border-gray-300 hover:bg-gray-100",
      link: "text-primary underline-offset-4 hover:underline p-0 text-purple-600",
    };
    
    const Comp = asChild ? (props.children as React.ReactElement) : 'button';
    const buttonProps = asChild ? { ...props, className: undefined, ref: undefined } : props;

    // @ts-ignore - the Comp type is complex and TypeScript is complaining
    return (
      <Comp 
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        ref={ref}
        {...buttonProps}
      />
    );
  }
);

Button.displayName = "Button";

export { Button }; 