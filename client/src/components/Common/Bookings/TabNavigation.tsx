import React from 'react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;  
  firstTab:string;
  secondTab:string
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange,secondTab,firstTab }) => {
  return (
    <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => onTabChange(firstTab)}
            className={`pb-4 px-4 text-sm font-medium relative ${
              activeTab === firstTab
                ? 'text-[#ff8800] border-b-2 border-[#ff8800]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming Sessions
          </button>
          <button
            onClick={() => onTabChange(secondTab)}
            className={`pb-4 px-4 text-sm font-medium relative ${
              activeTab === secondTab
                ? 'text-[#ff8800] border-b-2 border-[#ff8800]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Session History
          </button>
        </div>
  );
};

export default TabNavigation;