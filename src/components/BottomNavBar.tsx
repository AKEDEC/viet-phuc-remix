import React from 'react';
import { TabType } from '../types';
import { Sparkles, Compass, BookOpen, Bookmark } from 'lucide-react';

interface BottomNavBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  savedCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
}) => {
  const tabs = [
    {
      id: 'remix' as TabType,
      label: 'Phối Đồ',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'lookbook' as TabType,
      label: 'Lookbook',
      icon: <Compass className="w-5 h-5" />,
    },
    {
      id: 'guide' as TabType,
      label: 'Cẩm Nang',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      id: 'saved' as TabType,
      label: 'So Sánh',
      icon: <Bookmark className="w-5 h-5" />,
      badge: savedCount > 0 ? `${savedCount}/3` : null,
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1 safe-area-pb">
      <div className="grid grid-cols-4 items-center h-14">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors relative ${
                isActive ? 'text-rose-600' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge !== null && (
                  <span className="absolute -top-1 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[11px] font-medium mt-0.5 ${isActive ? 'font-bold' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
