import React from 'react';
import { Sparkles, BookmarkCheck } from 'lucide-react';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  savedCount: number;
  onOpenCardSummary: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  onOpenCardSummary,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face) */}
        <div 
          onClick={() => onSelectTab('remix')}
          className="flex items-center gap-2.5 cursor-pointer shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 via-rose-700 to-amber-600 flex items-center justify-center text-white shadow-sm shadow-rose-900/10">
            <span className="font-serif font-bold text-lg leading-none tracking-tight">V</span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap">
              Việt phục Remix
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-stone-400 font-normal">
              · Gen Z Heritage Studio
            </span>
          </div>
        </div>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => onSelectTab('remix')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              currentTab === 'remix' ? 'text-rose-700 font-semibold' : ''
            }`}
          >
            Phối Đồ 3 Bước
          </button>
          <button
            onClick={() => onSelectTab('lookbook')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              currentTab === 'lookbook' ? 'text-rose-700 font-semibold' : ''
            }`}
          >
            Lookbook Sinh Viên
          </button>
          <button
            onClick={() => onSelectTab('guide')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              currentTab === 'guide' ? 'text-rose-700 font-semibold' : ''
            }`}
          >
            Cẩm Nang & Địa Chỉ Thuê
          </button>
          <button
            onClick={() => onSelectTab('saved')}
            className={`transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 flex items-center gap-1.5 ${
              currentTab === 'saved' ? 'text-rose-700 font-semibold' : ''
            }`}
          >
            <span>So Sánh & Tủ Đồ</span>
            <span className="text-xs text-rose-700 font-mono font-bold">
              ({savedCount}/3)
            </span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenCardSummary}
            className="h-10 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-4 h-4 text-rose-200" />
            <span>Thẻ Phối Đồ</span>
          </button>
        </div>
      </div>
    </header>
  );
};
