import React from 'react';
import { GARMENTS, OCCASIONS } from '../data/vietPhucData';
import { Garment } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle2, Star, History, Sparkles } from 'lucide-react';

interface Step2GarmentProps {
  selectedGarmentId: string;
  selectedOccasionId: string;
  onSelectGarment: (garment: Garment) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const Step2Garment: React.FC<Step2GarmentProps> = ({
  selectedGarmentId,
  selectedOccasionId,
  onSelectGarment,
  onPrevStep,
  onNextStep,
}) => {
  const currentOccasion = OCCASIONS.find((o) => o.id === selectedOccasionId);
  const selectedGarment = GARMENTS.find((g) => g.id === selectedGarmentId);

  return (
    <div className="space-y-6">
      {/* Header text */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span>Bước 02</span>
          <span aria-hidden="true">·</span>
          <span>Chọn phom dáng di sản</span>
          <span aria-hidden="true">·</span>
          <span>Ý nghĩa lịch sử</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            Chọn loại trang phục truyền thống
          </h2>
          {currentOccasion && (
            <span className="text-xs font-medium text-rose-700 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200/60 w-fit">
              Dịp: {currentOccasion.name}
            </span>
          )}
        </div>
        <p className="text-sm text-stone-600 max-w-2xl">
          Mỗi loại cổ phục mang một dấu ấn thời đại và dáng vẻ riêng biệt. Hãy chọn trang phục bạn muốn làm tâm điểm cho bản phối của mình.
        </p>
      </div>

      {/* Garment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GARMENTS.map((garment) => {
          const isSelected = garment.id === selectedGarmentId;
          const isRecommended = currentOccasion?.recommendedGarments.includes(garment.id);

          return (
            <div
              key={garment.id}
              onClick={() => onSelectGarment(garment)}
              className={`p-4 sm:p-5 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-rose-50/70 border-rose-400 shadow-sm ring-2 ring-rose-300/40'
                  : 'bg-white hover:bg-stone-50 border-stone-200'
              }`}
            >
              <div>
                {/* Top badges */}
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md">
                      📍 {garment.region}
                    </span>
                    <span className="text-[11px] font-medium text-stone-500 bg-stone-100/70 px-2 py-0.5 rounded-md">
                      ⏳ {garment.era}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isRecommended && (
                      <span className="text-[11px] font-medium text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        Gợi ý
                      </span>
                    )}
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Garment title & alias */}
                <h3 className="text-lg font-bold text-stone-900 group-hover:text-rose-700 transition-colors">
                  {garment.name}
                </h3>
                <p className="text-xs text-stone-400 mb-2 font-medium">
                  {garment.alias}
                </p>

                {/* Nguồn gốc & Ý nghĩa (2-3 câu) */}
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs mb-3 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <History className="w-3.5 h-3.5 text-amber-700" />
                    <span>Nguồn gốc & Ý nghĩa di sản:</span>
                  </div>
                  <p className="text-stone-700 text-[11px] leading-relaxed">
                    {garment.originAndMeaning}
                  </p>
                </div>

                {/* Phụ kiện đi kèm đúng truyền thống */}
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs mb-3 space-y-1">
                  <p className="font-semibold text-stone-700 text-[11px]">
                    Phụ kiện đi kèm đúng truyền thống:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {garment.traditionalAccessories.map((acc, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-white text-stone-700 px-2 py-0.5 rounded border border-stone-200/80"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Dịp phù hợp */}
                <div className="text-[11px] text-stone-500 mb-3 space-y-1">
                  <strong className="text-stone-700">Dịp phù hợp truyền thống:</strong>
                  <p className="text-stone-600 leading-snug">
                    {garment.suitableOccasions.join(' · ')}
                  </p>
                </div>

                {/* Phom dáng & Cấu trúc */}
                <div className="text-[11px] text-stone-500 space-y-1 mb-3 pt-2 border-t border-stone-100">
                  <div>
                    <strong className="text-stone-700">Phom dáng:</strong> {garment.silhouette}
                  </div>
                  <div>
                    <strong className="text-stone-700">Cấu trúc nẹp/cổ:</strong> {garment.structureNote}
                  </div>
                </div>
              </div>

              {/* Bottom stats: Comfort & Versatility */}
              <div className="pt-3 border-t border-stone-100">
                <div className="grid grid-cols-2 gap-2 text-[11px] mb-2 text-stone-600">
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-stone-50">
                    <span>Độ thoải mái:</span>
                    <span className="font-semibold text-stone-800 flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {garment.comfortScore}/5
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded-lg bg-stone-50">
                    <span>Dễ mix Gen Z:</span>
                    <span className="font-semibold text-stone-800 flex items-center gap-0.5">
                      <Star className="w-3 h-3 text-rose-500 fill-rose-500" />
                      {garment.versatilityScore}/5
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {garment.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-stone-500 bg-stone-100/70 px-1.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <button
          onClick={onPrevStep}
          className="h-11 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium text-sm flex items-center gap-2 transition-all active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Bước 1</span>
        </button>

        <div className="text-xs text-stone-500 hidden sm:block">
          Đang chọn: <strong className="text-stone-800">{selectedGarment?.name}</strong>
        </div>

        <button
          onClick={onNextStep}
          className="h-11 px-5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <span>Tiếp: Remix & Phụ Kiện</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
