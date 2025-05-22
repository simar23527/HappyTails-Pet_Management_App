import React, { createContext, useContext, useState } from 'react';

// Context for the tabs
interface TabsContextType {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
}

// Tabs component
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  className?: string;
}

const Tabs = ({ defaultValue, className = '', children, ...props }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// TabsList component
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const TabsList = ({ className = '', children, ...props }: TabsListProps) => {
  return (
    <div 
      className={`inline-flex items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// TabsTrigger component
interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  className?: string;
}

const TabsTrigger = ({ value, className = '', children, ...props }: TabsTriggerProps) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`
        inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50
        ${isActive ? 'bg-white text-purple-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}
        ${className}
      `}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
};

// TabsContent component
interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  className?: string;
}

const TabsContent = ({ value, className = '', children, ...props }: TabsContentProps) => {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${className}`}
      tabIndex={0}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent }; 