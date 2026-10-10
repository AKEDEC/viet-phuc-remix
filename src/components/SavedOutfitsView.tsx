import React, { useState } from 'react';
import { UserOutfit } from '../types';
import {
  GARMENTS,
  OCCASIONS,
  COLOR_PALETTES,
  REMIX_STYLES,
  ACCESSORIES,
} from '../data/vietPhucData';
import {
  Trash2,
  Sparkles,
  ArrowRight,
  Download,
  Share2,
  Plus,
  Eye,
  Columns3,
  LayoutGrid,
  ShieldCheck,
  AlertTriangle,
  Palette,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { LookbookExportModal } from './LookbookExportModal';
import { generateVietPhucFallbackSvg } from '../utils/fallbackImageGenerator';

interface SavedOutfitsViewProps {
  savedOutfits: UserOutfit[];
  onLoadOutfit: (outfit: UserOutfit) => void;
  onDeleteOutfit: (id: string) => void;
  onGoToStudio: () => void;
  onAddCurrentStudioOutfit?: () => void;
  canAddCurrentOutfit?: boolean;
}

export const SavedOutfitsView: React.FC<SavedOutfitsViewProps> = ({
  savedOutfits,
  onLoadOutfit,
  onDeleteOutfit,
  onGoToStudio,
  onAddCurrentStudioOutfit,
  canAddCurrentOutfit = true,
}) => {
  const [viewMode, setViewMode] = useState<'compare' | 'grid'>('compare');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Maximum 3 saved outfits constraint
  const MAX_SLOTS = 3;
  const usedSlotsCount = savedOutfits.length;

  if (savedOutfits.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
          <Columns3 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-stone-800">Tủ đồ so sánh đang trống</h3>
          <p className="text-xs text-stone-500 leading-relaxed">
            Bạn có thể lưu <strong>tối đa 3 bộ phối</strong> để xem so sánh song song các tiêu chí (phom dáng, bảng màu, phụ kiện, điểm văn hóa) và xuất thành 1 ảnh Lookbook để chia sẻ.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
          {canAddCurrentOutfit && onAddCurrentStudioOutfit && (
            <button
              onClick={onAddCurrentStudioOutfit}
              className="h-11 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>Lưu bộ đang phối tại Studio</span>
            </button>
          )}

          <button
            onClick={onGoToStudio}
            className="h-11 px-5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-medium text-xs inline-flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Đến Studio 3 Bước</span>
          </button>
        </div>
      </div>
    );
  }

  // Create array of 3 slots (filled or empty)
  const slots: (UserOutfit | null)[] = [
    savedOutfits[0] || null,
    savedOutfits[1] || null,
    savedOutfits[2] || null,
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>So Sánh & Tủ Đồ Cá Nhân</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-700 font-bold">
              Đã lưu {usedSlotsCount}/{MAX_SLOTS} bộ phối tối đa
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
            So Sánh Cạnh Nhau & Xuất Lookbook Di Sản
          </h2>
          <p className="text-xs text-stone-600 max-w-xl">
            Lưu tối đa 3 bộ phối để đặt cạnh nhau so sánh chi tiết phom dáng, hòa sắc, phụ kiện và điểm cố vấn văn hóa. Xuất thành một ảnh lookbook duy nhất để lưu về hoặc chia sẻ bạn bè.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Switch View Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs">
            <button
              onClick={() => setViewMode('compare')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'compare'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5 text-rose-600" />
              <span>So Sánh Cạnh Nhau</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-stone-600" />
              <span>Dạng Lưới ({usedSlotsCount})</span>
            </button>
          </div>

          {/* Export Lookbook Image Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="h-10 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-rose-100" />
            <span>Xuất Lookbook Thành 1 Ảnh</span>
          </button>
        </div>
      </div>

      {/* Slot Status Bar */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {[0, 1, 2].map((idx) => {
          const outfit = slots[idx];
          return (
            <div
              key={idx}
              className={`p-2.5 sm:p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
                outfit
                  ? 'bg-rose-50/50 border-rose-200 text-rose-900'
                  : 'bg-stone-50 border-dashed border-stone-300 text-stone-400'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                    outfit ? 'bg-rose-600 text-white' : 'bg-stone-200 text-stone-500'
                  }`}
                >
                  {idx + 1}
                </span>
                <span className="font-semibold truncate">
                  {outfit ? outfit.customName || `Bộ phối 0${idx + 1}` : 'Slot trống'}
                </span>
              </div>

              {outfit ? (
                <button
                  onClick={() => onDeleteOutfit(outfit.id)}
                  className="p-1 text-stone-400 hover:text-rose-600 transition-colors shrink-0"
                  title="Xóa bộ phối"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              ) : (
                canAddCurrentOutfit && onAddCurrentStudioOutfit && (
                  <button
                    onClick={onAddCurrentStudioOutfit}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 underline shrink-0"
                  >
                    + Thêm
                  </button>
                )
              )}
            </div>
          );
        })}
      </div>

      {/* VIEW 1: SIDE-BY-SIDE COMPARISON (XEM SO SÁNH CẠNH NHAU) */}
      {viewMode === 'compare' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
          {/* Comparison Container */}
          <div className="overflow-x-auto pb-4">
            <div className="min-w-[850px] p-4 sm:p-6">
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {slots.map((outfit, idx) => {
                  if (!outfit) {
                    // Empty Slot Card
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="rounded-2xl border-2 border-dashed border-stone-300 bg-stone-50/60 p-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[550px]"
                      >
                        <div className="w-12 h-12 rounded-full bg-stone-200/80 flex items-center justify-center text-stone-400">
                          <Plus className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                            Slot So Sánh 0{idx + 1}
                          </p>
                          <h4 className="text-sm font-bold text-stone-700">Chưa có bản phối</h4>
                          <p className="text-xs text-stone-500 max-w-[200px]">
                            Lưu thêm bản phối từ Studio 3 bước để xem so sánh song song với các bộ khác.
                          </p>
                        </div>

                        {canAddCurrentOutfit && onAddCurrentStudioOutfit ? (
                          <button
                            onClick={onAddCurrentStudioOutfit}
                            className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Lưu bộ hiện tại vào đây</span>
                          </button>
                        ) : (
                          <button
                            onClick={onGoToStudio}
                            className="h-9 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-medium flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                            <span>Tạo thêm bản phối mới</span>
                          </button>
                        )}
                      </div>
                    );
                  }

                  // Active Outfit Column
                  const garment = GARMENTS.find((g) => g.id === outfit.garmentId);
                  const occasion = OCCASIONS.find((o) => o.id === outfit.occasionId);
                  const palette = COLOR_PALETTES.find((p) => p.id === outfit.colorPaletteId);
                  const remixStyle = REMIX_STYLES.find((s) => s.id === outfit.remixStyleId);
                  const accessoryNames = outfit.selectedAccessories
                    .map((id) => ACCESSORIES.find((a) => a.id === id)?.name)
                    .filter(Boolean);

                  const outfitImgUrl =
                    outfit.imageUrl ||
                    generateVietPhucFallbackSvg({
                      garmentId: outfit.garmentId,
                      garmentName: garment?.name || 'Cổ phục',
                      garmentEra: garment?.era || '',
                      garmentRegion: garment?.region || '',
                      outfitTitle: outfit.customName || `${garment?.name} Remix`,
                      primaryColor: palette?.primary || '#8B1E1E',
                      secondaryColor: palette?.secondary || '#EAB308',
                      accentColor: palette?.accent || '#D97706',
                      patternType: outfit.patternType,
                      occasionName: occasion?.name || '',
                      accessories: accessoryNames as string[],
                    });

                  const culturalScore = outfit.culturalScore ?? (outfit.culturalWarning ? 68 : 95);
                  const isWarning = outfit.culturalWarning || culturalScore < 80;

                  return (
                    <div
                      key={outfit.id}
                      className="rounded-2xl border border-stone-200 bg-white p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-rose-300 transition-all"
                    >
                      {/* Column Header & Slot Badge */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-white px-2 py-0.5 rounded-md">
                            BỘ PHỐI 0{idx + 1}
                          </span>
                          <button
                            onClick={() => onDeleteOutfit(outfit.id)}
                            className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-colors"
                            title="Xóa bản phối khỏi so sánh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Title & Occasion */}
                        <div>
                          <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md inline-block mb-1">
                            {occasion?.name || 'Dịp mặc'}
                          </span>
                          <h3 className="text-base font-bold text-stone-900 leading-snug line-clamp-1">
                            {outfit.customName || garment?.name}
                          </h3>
                        </div>

                        {/* Image Preview */}
                        <div className="relative aspect-[3/4] max-h-56 w-full rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center">
                          <img
                            src={outfitImgUrl}
                            alt={outfit.customName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-stone-900/70 text-white text-[10px] px-2 py-0.5 rounded-md backdrop-blur-xs font-medium">
                            {garment?.dynasty}
                          </div>
                        </div>
                      </div>

                      {/* Synchronized Comparison Attributes */}
                      <div className="space-y-3 text-xs divide-y divide-stone-100">
                        {/* 1. Garment & Dynasty */}
                        <div className="pt-2">
                          <span className="text-stone-400 font-medium block text-[11px]">Cổ phục & Triều đại</span>
                          <p className="font-bold text-stone-800">
                            {garment?.name}
                          </p>
                          <p className="text-[11px] text-stone-500">{garment?.era}</p>
                        </div>

                        {/* 2. Color Palette & Swatches */}
                        <div className="pt-2">
                          <span className="text-stone-400 font-medium block text-[11px]">Bảng màu chủ đạo</span>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span
                              className="w-4 h-4 rounded-full border border-stone-200 shadow-2xs"
                              style={{ backgroundColor: palette?.primary }}
                              title={`Chính: ${palette?.primary}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-stone-200 shadow-2xs"
                              style={{ backgroundColor: palette?.secondary }}
                              title={`Phụ: ${palette?.secondary}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-stone-200 shadow-2xs"
                              style={{ backgroundColor: palette?.accent }}
                              title={`Điểm xuyết: ${palette?.accent}`}
                            />
                            <span className="font-semibold text-stone-700 ml-1">
                              {palette?.name}
                            </span>
                          </div>
                        </div>

                        {/* 3. Heritage Pattern */}
                        <div className="pt-2">
                          <span className="text-stone-400 font-medium block text-[11px]">Họa tiết truyền thống</span>
                          <p className="font-semibold text-stone-800">
                            {outfit.patternType === 'thuy-ba'
                              ? 'Thủy Ba (Sóng nước)'
                              : outfit.patternType === 'hoa-sen'
                              ? 'Liên Hoa (Cánh sen)'
                              : outfit.patternType === 'may-ngu-sac'
                              ? 'Mây Ngũ Sắc'
                              : outfit.patternType === 'hoi-van'
                              ? 'Hồi Văn Cổ Điển'
                              : 'Đũi Trơn Tối Giản'}
                          </p>
                        </div>

                        {/* 4. Remix Accessories */}
                        <div className="pt-2">
                          <span className="text-stone-400 font-medium block text-[11px]">Phụ kiện Remix</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {accessoryNames.length > 0 ? (
                              accessoryNames.slice(0, 3).map((acc, aIdx) => (
                                <span
                                  key={aIdx}
                                  className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded border border-stone-200"
                                >
                                  {acc}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-stone-500 italic">Nguyên bản tối giản</span>
                            )}
                          </div>
                        </div>

                        {/* 5. Remix Style & Rule */}
                        <div className="pt-2">
                          <span className="text-stone-400 font-medium block text-[11px]">Phong cách thiết kế</span>
                          <p className="font-bold text-stone-800">{remixStyle?.name}</p>
                          <p className="text-[10px] text-stone-500">{remixStyle?.keyRule}</p>
                        </div>

                        {/* 6. Cultural Advisor Assessment */}
                        <div className="pt-2">
                          <span className="text-stone-400 font-medium block text-[11px]">Cố vấn văn hóa</span>
                          <div
                            className={`p-2 rounded-lg mt-1 text-[11px] flex items-center gap-1.5 ${
                              isWarning
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {isWarning ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            ) : (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            )}
                            <span className="font-semibold">
                              {culturalScore}/100 · {isWarning ? 'Cảnh báo lệch gu' : 'Chuẩn mực di sản'}
                            </span>
                          </div>
                        </div>

                        {/* 7. Student Rental Budget */}
                        <div className="pt-2">
                          <span className="text-stone-400 font-medium block text-[11px]">Dự toán thuê sinh viên</span>
                          <p className="font-bold text-stone-800">120k - 250k / buổi</p>
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="pt-3 border-t border-stone-100 space-y-2">
                        <button
                          onClick={() => onLoadOutfit(outfit)}
                          className="w-full h-9 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                        >
                          <span>Mở Trong Studio</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: GRID VIEW (DẠNG LƯỚI) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedOutfits.map((outfit, idx) => {
            const garment = GARMENTS.find((g) => g.id === outfit.garmentId);
            const occasion = OCCASIONS.find((o) => o.id === outfit.occasionId);
            const palette = COLOR_PALETTES.find((p) => p.id === outfit.colorPaletteId);
            const remixStyle = REMIX_STYLES.find((s) => s.id === outfit.remixStyleId);
            const accessoryNames = outfit.selectedAccessories
              .map((id) => ACCESSORIES.find((a) => a.id === id)?.name)
              .filter(Boolean);

            return (
              <div
                key={outfit.id}
                className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-rose-300 transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold bg-stone-900 text-white px-2 py-0.5 rounded">
                        Slot {idx + 1}
                      </span>
                      <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        {occasion?.name || 'Dịp mặc'}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteOutfit(outfit.id)}
                      className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-colors"
                      title="Xóa bản phối"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 mb-1">
                    {outfit.customName || garment?.name}
                  </h3>
                  <p className="text-xs text-stone-400 font-medium mb-3">
                    {remixStyle?.name} · {palette?.name}
                  </p>

                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs mb-3 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-400">Tone màu:</span>
                      <div className="flex items-center gap-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block border border-white"
                          style={{ backgroundColor: palette?.primary }}
                        />
                        <span className="font-medium text-stone-700">{palette?.name}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-stone-400">Phụ kiện: </span>
                      <span className="text-stone-700">
                        {accessoryNames.length > 0 ? accessoryNames.join(', ') : 'Nguyên bản tối giản'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400">
                    Lưu ngày {new Date(outfit.createdAt).toLocaleDateString('vi-VN')}
                  </span>

                  <button
                    onClick={() => onLoadOutfit(outfit)}
                    className="h-9 px-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center gap-1.5 transition-all"
                  >
                    <span>Mở Trong Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lookbook Export Single-Image Modal */}
      <LookbookExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        savedOutfits={savedOutfits}
      />
    </div>
  );
};
