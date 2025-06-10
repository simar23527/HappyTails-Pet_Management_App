import React from 'react';

interface SelectProps {
  className?: string;
  children?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ className = '', children, ...props }) => (
  <select
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  >
    {children}
  </select>
);

export const SelectContent: React.FC<{ children: React.ReactNode }> = ({ children, ...props }) => (
  <div {...props}>{children}</div>
);

export const SelectItem: React.FC<{ children: React.ReactNode; value: string }> = ({ children, value, ...props }) => (
  <option value={value} {...props}>{children}</option>
);

export const SelectTrigger: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = '', ...props }) => (
  <div className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 ${className}`} {...props}>
    {children}
  </div>
);

export const SelectValue: React.FC<{ placeholder?: string }> = ({ placeholder, ...props }) => (
  <span className="text-gray-500" {...props}>{placeholder}</span>
); 
