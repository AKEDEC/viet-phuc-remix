import React from 'react';
import { COLOR_PALETTES, ACCESSORIES, REMIX_STYLES } from '../data/vietPhucData';
import { ColorPalette, AccessoryItem, RemixStyle, Garment, Occasion } from '../types';
import { checkCulturalIntegrity } from '../utils/culturalAdvisor';
import {
  ArrowLeft,
  Sparkles,
  Check,
  Crown,
  Footprints,
  Layers,
  Sparkle,
  Shirt,
  ShoppingBag,
  Eye,
  Wind,
  Circle,
  AlertTriangle,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface Step3RemixProps {
  selectedPaletteId: string;
  selectedPattern: 'thuy-ba' | 'hoa-sen' | 'may-ngu-sac' | 'tron-toi-gian' | 'hoi-van';
  selectedAccessoryIds: string[];
  selectedRemixStyleId: string;
  activeGarment: Garment;
  activeOccasion: Occasion;
  onSelectPalette: (palette: ColorPalette) => void;
  onSelectPattern: (pattern: 'thuy-ba' | 'hoa-sen' | 'may-ngu-sac' | 'tron-toi-gian' | 'hoi-van') => void;
  onToggleAccessory: (id: string) => void;
  onSelectRemixStyle: (style: RemixStyle) => void;
  onPrevStep: () => void;
  onCompleteOutfit: () => void;
  onApplyCulturalReplacement?: (replacementIds: string[]) => void;
  isGeminiLoading?: boolean;
}

export const Step3Remix: React.FC<Step3RemixProps> = ({
  selectedPaletteId,
  selectedPattern,
  selectedAccessoryIds,
  selectedRemixStyleId,
  activeGarment,
  activeOccasion,
  onSelectPalette,
  onSelectPattern,
  onToggleAccessory,
  onSelectRemixStyle,
  onPrevStep,
  onCompleteOutfit,
  onApplyCulturalReplacement,
  isGeminiLoading,
}) => {
  const currentPalette =
    COLOR_PALETTES.find((p) => p.id === selectedPaletteId) || COLOR_PALETTES[0];
  const currentRemixStyle =
    REMIX_STYLES.find((s) => s.id === selectedRemixStyleId) || REMIX_STYLES[0];
  const currentAccessories = ACCESSORIES.filter((a) =>
    selectedAccessoryIds.includes(a.id)
  );

  const liveCulturalCheck = checkCulturalIntegrity({
    occasion: activeOccasion,
    garment: activeGarment,
    palette: currentPalette,
    pattern: selectedPattern,
    selectedAccessories: currentAccessories,
    remixStyle: currentRemixStyle,
  });
  const patterns: { id: 'thuy-ba' | 'hoa-sen' | 'may-ngu-sac' | 'tron-toi-gian' | 'hoi-van'; name: string; meaning: string }[] = [
    { id: 'thuy-ba', name: 'Thủy Ba (Sóng Nước)', meaning: 'Biểu tượng vương quyền, trường tồn và thăng tiến' },
    { id: 'hoa-sen', name: 'Liên Hoa (Cánh Sen)', meaning: 'Thanh khiết, trí tuệ và sự tao nhã người Việt' },
    { id: 'may-ngu-sac', name: 'Vân Ngũ Sắc (Mây Trời)', meaning: 'Phúc lành, thông tuệ và khí chất phiêu lãng' },
    { id: 'hoi-van', name: 'Hồi Văn Cổ Điển', meaning: 'Họa tiết kỷ hà kỷ niệm thời Lý - Trần - Lê' },
    { id: 'tron-toi-gian', name: 'Vải Đũi Trơn Tối Giản', meaning: 'Đậm chất mộc mạc, tôn vinh đường cắt may hiện đại' },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'head':
        return <Crown className="w-3.5 h-3.5 text-stone-600" />;
      case 'footwear':
        return <Footprints className="w-3.5 h-3.5 text-stone-600" />;
      case 'layer':
        return <Layers className="w-3.5 h-3.5 text-stone-600" />;
      default:
        return <Sparkle className="w-3.5 h-3.5 text-stone-600" />;
    }
  };

  const getAccessoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Footprints':
        return <Footprints className="w-4 h-4" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Eye':
        return <Eye className="w-4 h-4" />;
      case 'Wind':
        return <Wind className="w-4 h-4" />;
      case 'Circle':
        return <Circle className="w-4 h-4" />;
      case 'Shirt':
        return <Shirt className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header text */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span>Bước 03</span>
          <span aria-hidden="true">·</span>
          <span>Phối màu di sản</span>
          <span aria-hidden="true">·</span>
          <span>Remix phụ kiện</span>
          <span aria-hidden="true">·</span>
          <span>Định hình phong cách</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
          Remix màu sắc, phụ kiện & phong cách Gen Z
        </h2>
        <p className="text-sm text-stone-600 max-w-2xl">
          Đây là nơi sự giao thoa diễn ra: đưa hơi thở thời đại vào trang phục truyền thống bằng sneaker, jeans, kính mắt Y2K hoặc kiềng bạc sang trọng.
        </p>
      </div>

      {/* 1. Phong cách chủ đạo */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <span>1. Chọn Phong Cách Remix Chủ Đạo</span>
          </h3>
          <span className="text-xs text-stone-400">Chọn 1 phong cách</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {REMIX_STYLES.map((style) => {
            const isSelected = style.id === selectedRemixStyleId;
            return (
              <div
                key={style.id}
                onClick={() => onSelectRemixStyle(style)}
                className={`p-3.5 sm:p-4 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300/40'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded">
                      {style.badge}
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-rose-600 stroke-[3]" />}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mb-0.5">{style.name}</h4>
                  <p className="text-[11px] text-stone-500 mb-2">{style.subtitle}</p>
                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-3 mb-2">
                    {style.description}
                  </p>
                </div>
                <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-100">
                  <span className="text-stone-600 font-medium">{style.keyRule}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Bảng phối màu */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <span>2. Bảng Màu Truyền Thống & Hiện Đại</span>
          </h3>
          <span className="text-xs text-stone-400">6 sắc thái cung đình & phố thị</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COLOR_PALETTES.map((palette) => {
            const isSelected = palette.id === selectedPaletteId;
            return (
              <div
                key={palette.id}
                onClick={() => onSelectPalette(palette)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                  isSelected
                    ? 'bg-rose-50/80 border-rose-400 ring-2 ring-rose-300/40'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-stone-900">{palette.name}</h4>
                    <span className="text-[11px] text-stone-400">{palette.traditionalName}</span>
                  </div>
                  {/* Swatches */}
                  <div className="flex items-center -space-x-1">
                    <div
                      className="w-6 h-6 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: palette.primary }}
                      title="Màu chính"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: palette.secondary }}
                      title="Màu phụ"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white shadow-sm"
                      style={{ backgroundColor: palette.accent }}
                      title="Màu điểm xuyết"
                    />
                  </div>
                </div>

                <p className="text-xs text-stone-600 mb-1 leading-snug">
                  {palette.vibeDescription}
                </p>
                <div className="text-[11px] text-stone-400">
                  <span className="text-stone-500 font-medium">Hợp với:</span> {palette.bestFor}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Họa tiết thêu / in */}
      <div className="space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-stone-900">
          3. Họa Tiết Việt Cổ Truyền
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {patterns.map((pat) => {
            const isSelected = pat.id === selectedPattern;
            return (
              <button
                key={pat.id}
                onClick={() => onSelectPattern(pat.id)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-300/40'
                    : 'bg-white hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <p className={`text-xs font-bold truncate ${isSelected ? 'text-rose-900' : 'text-stone-800'}`}>
                    {pat.name}
                  </p>
                  {isSelected && <Check className="w-3.5 h-3.5 text-rose-600 shrink-0" />}
                </div>
                <p className="text-[10px] text-stone-400 line-clamp-2 leading-tight">
                  {pat.meaning}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Phụ kiện remix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
            <span>4. Phụ Kiện Remix (Chọn Nhiều Mục)</span>
          </h3>
          <span className="text-xs text-stone-400">
            Đã chọn: <strong className="text-rose-600">{selectedAccessoryIds.length}</strong> món
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ACCESSORIES.map((item) => {
            const isChecked = selectedAccessoryIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onToggleAccessory(item.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border flex flex-col justify-between ${
                  isChecked
                    ? 'bg-rose-50/80 border-rose-400 shadow-xs'
                    : 'bg-white hover:bg-stone-50 border-stone-200 opacity-90'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                      {getCategoryIcon(item.category)}
                      {item.remixType === 'streetwear'
                        ? 'Streetwear'
                        : item.remixType === 'modern'
                        ? 'Hiện đại'
                        : 'Truyền thống'}
                    </span>

                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-4 h-4 text-rose-600 rounded border-stone-300 focus:ring-rose-500 cursor-pointer"
                    />
                  </div>

                  <h4 className="text-xs font-bold text-stone-900 mb-1">{item.name}</h4>
                  <p className="text-[11px] text-stone-500 leading-snug mb-2">{item.description}</p>
                </div>

                <div className="text-[10px] text-rose-700/90 pt-1.5 border-t border-stone-100">
                  <span className="font-semibold">Mẹo SV: </span>
                  {item.studentTip}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LIVE CỐ VẤN VĂN HÓA KIỂM TRA LỰA CHỌN */}
      <div className="pt-2 border-t border-stone-200 space-y-3">
        {liveCulturalCheck.canh_bao_sai_lech ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2.5 shadow-xs animate-in fade-in duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-amber-200 text-amber-800 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    Cố Vấn Văn Hóa Cảnh Báo
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 mt-0.5">
                    {liveCulturalCheck.tieu_de_canh_bao}
                  </h4>
                </div>
              </div>

              <span className="text-xs font-black text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-lg shrink-0">
                {liveCulturalCheck.diem_ton_trong_di_san}/100
              </span>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
              <strong>Giải thích ngắn: </strong>
              {liveCulturalCheck.giai_thich_ngan}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-0.5">
              <p className="text-stone-800">
                <strong>Gợi ý thay thế: </strong>
                {liveCulturalCheck.goi_y_thay_the}
              </p>

              {liveCulturalCheck.phu_kien_thay_the_ids &&
                liveCulturalCheck.phu_kien_thay_the_ids.length > 0 &&
                onApplyCulturalReplacement && (
                  <button
                    type="button"
                    onClick={() => onApplyCulturalReplacement(liveCulturalCheck.phu_kien_thay_the_ids!)}
                    className="shrink-0 h-8 px-3 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 text-amber-200" />
                    <span>Áp Dụng Gợi Ý Chuẩn Hóa</span>
                  </button>
                )}
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Cố vấn văn hóa:</strong> Phối đồ chuẩn mực di sản {activeGarment.name} ({activeGarment.era}), kết hợp sáng tạo cùng sinh viên Gen Z.
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md shrink-0">
              {liveCulturalCheck.diem_ton_trong_di_san}/100 điểm
            </span>
          </div>
        )}

        {/* Info callout */}
        <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 flex items-center gap-2.5 text-xs text-rose-900">
          <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            <strong>Gợi ý thông minh:</strong> Khi bấm hoàn tất, Gemini AI sẽ thẩm định toàn diện bảng màu hex, chấm điểm hài hòa (0–100) và xuất Thẻ Kết Quả dành riêng cho bạn.
          </span>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onPrevStep}
            className="h-11 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium text-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Bước 2</span>
          </button>

          <button
            onClick={onCompleteOutfit}
            disabled={isGeminiLoading}
            className="h-11 px-6 rounded-xl bg-gradient-to-r from-rose-600 via-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-semibold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 text-rose-200 ${isGeminiLoading ? 'animate-spin' : ''}`} />
            <span>{isGeminiLoading ? 'Gemini Đang Phối Đồ...' : 'Hoàn Tất & Gợi Ý Bằng Gemini'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
