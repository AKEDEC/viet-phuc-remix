import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  Copy,
  RefreshCw,
  Palette,
  Layers,
  Award,
  CheckCircle2,
  Image as ImageIcon,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';
import { GeminiStylingResult, OutfitIllustrationResult } from '../types';

interface GeminiResultCardProps {
  result: GeminiStylingResult | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  occasionName?: string;
  garmentName?: string;
  outfitImage?: OutfitIllustrationResult | null;
  isImageLoading?: boolean;
  onRegenerateImage?: () => void;
}

export const GeminiResultCard: React.FC<GeminiResultCardProps> = ({
  result,
  isLoading,
  error,
  onRefresh,
  occasionName,
  garmentName,
  outfitImage,
  isImageLoading,
  onRegenerateImage,
}) => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const copyFullRecommendation = () => {
    if (!result) return;
    const text = `✨ GỢI Ý STYLIST TỪ GEMINI AI ✨
Bộ phối: ${result.ten_bo_phoi}
Điểm hài hòa: ${result.diem_hai_hoa_mau}/100
Mô tả: ${result.mo_ta}
Bảng màu hex: ${result.bang_mau_hex.join(', ')}
Phụ kiện đề xuất: ${result.phu_kien.join(', ')}
Lý do hợp dịp: ${result.ly_do_hop_dip}
#VietPhucRemix #GeminiAIStylist #GenZHeritage`;

    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-gradient-to-br from-rose-50/70 via-white to-amber-50/60 border border-rose-200/80 rounded-2xl p-6 sm:p-8 shadow-sm text-center space-y-4 animate-pulse">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center mx-auto text-white shadow-md">
          <Sparkles className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-stone-900">
            Gemini AI đang phân tích phối màu & phụ kiện...
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Đang chấm điểm hài hòa màu sắc, tổng hợp văn hóa {garmentName} cho dịp {occasionName} theo thẩm mỹ Gen Z.
          </p>
        </div>
        <div className="flex justify-center gap-2 pt-2">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-rose-50/60 border border-rose-200 rounded-2xl p-5 shadow-sm flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-rose-900">Không thể tải gợi ý Gemini</p>
          <p className="text-xs text-rose-700">{error}</p>
        </div>
        <button
          onClick={onRefresh}
          className="h-9 px-3.5 rounded-xl bg-white border border-rose-300 text-rose-800 text-xs font-semibold hover:bg-rose-100/50 flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Thử lại</span>
        </button>
      </div>
    );
  }

  if (!result) return null;

  // Score styling
  const score = Math.max(0, Math.min(100, result.diem_hai_hoa_mau));
  const getScoreBadge = () => {
    if (score >= 90) return { label: 'Tuyệt Mỹ Hoàn Hảo', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (score >= 80) return { label: 'Rất Hài Hòa', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: 'Phá Cách Ấn Tượng', bg: 'bg-rose-50 text-rose-800 border-rose-200' };
  };
  const scoreBadge = getScoreBadge();

  return (
    <div className="w-full bg-white border-2 border-rose-200/90 rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-rose-700 tracking-wide uppercase">
                Gợi Ý Gemini AI Stylist
              </span>
              <span className="text-[10px] text-stone-400">· Trực tiếp từ JSON</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight">
              {result.ten_bo_phoi}
            </h3>
          </div>
        </div>

        {/* Score Pill */}
        <div className="flex items-center gap-2.5 self-start sm:self-center">
          <div className="flex items-baseline gap-1 text-right">
            <span className="text-2xl font-black text-rose-600 font-mono tracking-tight">
              {score}
            </span>
            <span className="text-xs text-stone-400 font-bold">/100</span>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border ${scoreBadge.bg}`}>
            {scoreBadge.label}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1">
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
          {result.mo_ta}
        </p>
      </div>

      {/* Ảnh minh họa bộ phối Gemini */}
      {(isImageLoading || outfitImage) && (
        <div className="rounded-xl border border-stone-200 overflow-hidden bg-stone-950">
          {isImageLoading ? (
            <div className="p-6 text-center space-y-2 bg-stone-900 text-white animate-pulse">
              <RotateCw className="w-6 h-6 animate-spin text-rose-500 mx-auto" />
              <p className="text-xs font-bold">Đang tạo ảnh minh họa bộ phối bằng Gemini...</p>
              <p className="text-[11px] text-stone-400">Model: gemini-3.1-flash-lite-image</p>
            </div>
          ) : outfitImage ? (
            <div className="relative">
              <img
                src={outfitImage.imageUrl}
                alt={result.ten_bo_phoi}
                referrerPolicy="no-referrer"
                className="w-full max-h-[360px] object-contain sm:object-cover mx-auto"
              />
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                {outfitImage.isFallback ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-200 text-[10px] font-bold border border-amber-500/40 flex items-center gap-1 shadow-sm pointer-events-auto">
                    <Palette className="w-3 h-3 text-amber-400" />
                    <span>Tranh Phác Thảo Di Sản (Dự Phòng)</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-200 text-[10px] font-bold border border-emerald-500/40 flex items-center gap-1 shadow-sm pointer-events-auto">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span>Tạo Bởi Gemini AI</span>
                  </span>
                )}

                {onRegenerateImage && (
                  <button
                    onClick={onRegenerateImage}
                    className="p-1 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/20 transition-all pointer-events-auto"
                    title="Vẽ lại ảnh"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
              </div>

              {outfitImage.isFallback && (
                <div className="p-2.5 bg-amber-900/90 text-amber-100 text-[11px] flex items-center justify-between gap-2 border-t border-amber-800">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span>Đang dùng ảnh phác thảo dự phòng do hệ thống tạo ảnh đạt giới hạn.</span>
                  </span>
                  {onRegenerateImage && (
                    <button onClick={onRegenerateImage} className="underline text-white font-bold shrink-0">
                      Thử lại
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {/* Grid: Color Hex & Reason */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bảng màu Hex */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-stone-800">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-rose-600" />
              Bảng Màu Hex Đề Xuất ({result.bang_mau_hex.length})
            </span>
            <span className="text-[10px] text-stone-400 font-normal">Chạm để sao chép</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {result.bang_mau_hex.map((hex, idx) => (
              <button
                key={idx}
                onClick={() => copyHex(hex)}
                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 hover:border-rose-400 transition-all text-xs shadow-2xs active:scale-95"
                title={`Sao chép mã ${hex}`}
              >
                <span
                  className="w-4 h-4 rounded-md border border-stone-200 shadow-2xs shrink-0"
                  style={{ backgroundColor: hex }}
                />
                <span className="font-mono text-[11px] font-semibold text-stone-700">
                  {hex.toUpperCase()}
                </span>
                {copiedHex === hex ? (
                  <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                ) : (
                  <Copy className="w-3 h-3 text-stone-300 group-hover:text-stone-600 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Lý do hợp dịp */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Award className="w-3.5 h-3.5 text-amber-700" />
            <span>Lý Do Phù Hợp Với Dịp {occasionName || 'Này'}:</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            {result.ly_do_hop_dip}
          </p>
        </div>
      </div>

      {/* Phụ kiện đề xuất */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-stone-800">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-600" />
            Phụ Kiện Đi Kèm Khuyên Dùng:
          </span>
          <span className="text-[10px] text-stone-400 font-normal">Đề xuất bởi Gemini</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {result.phu_kien.map((item, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-rose-50/70 border border-rose-200/70 text-rose-900 text-xs font-medium flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-rose-600 shrink-0" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            className="h-9 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
            <span>Tạo lại gợi ý</span>
          </button>
        </div>

        <button
          onClick={copyFullRecommendation}
          className="h-9 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
        >
          {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedAll ? 'Đã sao chép toàn bộ!' : 'Sao chép kết quả'}</span>
        </button>
      </div>
    </div>
  );
};
