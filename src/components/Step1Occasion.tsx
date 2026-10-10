import React from 'react';
import { OCCASIONS, GARMENTS } from '../data/vietPhucData';
import { Occasion } from '../types';
import { GraduationCap, Presentation, Camera, Coffee, Sparkles, Flame, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Step1OccasionProps {
  selectedOccasionId: string;
  onSelectOccasion: (occasion: Occasion) => void;
  onNextStep: () => void;
}

export const Step1Occasion: React.FC<Step1OccasionProps> = ({
  selectedOccasionId,
  onSelectOccasion,
  onNextStep,
}) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-rose-600" />;
      case 'Presentation':
        return <Presentation className="w-5 h-5 text-amber-600" />;
      case 'Camera':
        return <Camera className="w-5 h-5 text-emerald-600" />;
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-teal-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-rose-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-rose-600" />;
    }
  };

  const selectedOccasion = OCCASIONS.find((o) => o.id === selectedOccasionId);

  return (
    <div className="space-y-6">
      {/* Header text */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span>Bước 01</span>
          <span aria-hidden="true">·</span>
          <span>Định vị bối cảnh</span>
          <span aria-hidden="true">·</span>
          <span>Phong thái sinh viên</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
          Bạn chuẩn bị diện Việt phục vào dịp nào?
        </h2>
        <p className="text-sm text-stone-600 max-w-2xl">
          Mỗi dịp xuất hiện đòi hỏi tính linh hoạt và mức độ trang trọng khác nhau. Chọn dịp để nhận đề xuất cổ phục chuẩn gu nhất.
        </p>
      </div>

      {/* Occasions grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {OCCASIONS.map((occasion) => {
          const isSelected = occasion.id === selectedOccasionId;
          const recommendedNames = occasion.recommendedGarments
            .map((id) => GARMENTS.find((g) => g.id === id)?.name)
            .filter(Boolean)
            .join(', ');

          return (
            <div
              key={occasion.id}
              onClick={() => onSelectOccasion(occasion)}
              className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-rose-50/70 border-rose-400 shadow-sm ring-2 ring-rose-300/40'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center shrink-0">
                    {getIcon(occasion.icon)}
                  </div>
                  
                  <div className="flex items-center gap-2 text-right">
                    <span className="text-xs font-medium text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md">
                      {occasion.badge}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-stone-900 mb-1">
                  {occasion.name}
                </h3>
                <p className="text-xs text-stone-500 mb-3 line-clamp-2">
                  {occasion.subtitle}
                </p>

                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-600 mb-3 space-y-1">
                  <p className="font-medium text-stone-700">Vibe sinh viên:</p>
                  <p className="text-stone-500 line-clamp-2">{occasion.vibe}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                <span className="text-stone-500 font-medium">Cổ phục đề xuất: </span>
                <span className="text-stone-700">{recommendedNames}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <div className="text-xs text-stone-500">
          Đang chọn: <strong className="text-stone-800">{selectedOccasion?.name}</strong>
        </div>

        <button
          onClick={onNextStep}
          className="h-11 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <span>Tiếp: Chọn Cổ Phục</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
