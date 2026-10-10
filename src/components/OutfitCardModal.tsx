import React, { useState } from 'react';
import {
  Occasion,
  Garment,
  ColorPalette,
  AccessoryItem,
  RemixStyle,
  GeminiStylingResult,
  OutfitIllustrationResult,
} from '../types';
import { POSE_TIPS } from '../data/vietPhucData';
import { checkCulturalIntegrity } from '../utils/culturalAdvisor';
import { OutfitVisualizer } from './OutfitVisualizer';
import {
  X,
  Sparkles,
  Copy,
  Bookmark,
  Check,
  Camera,
  DollarSign,
  RotateCw,
  Award,
  Layers,
  Calendar,
  CheckCircle2,
  Info,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  Image as ImageIcon,
  Download,
  Palette,
  Eye,
  RefreshCw,
  Columns3,
  Shirt,
} from 'lucide-react';

interface OutfitCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  occasion: Occasion;
  garment: Garment;
  palette: ColorPalette;
  patternName: string;
  patternKey?: 'thuy-ba' | 'hoa-sen' | 'may-ngu-sac' | 'tron-toi-gian' | 'hoi-van';
  accessories: AccessoryItem[];
  remixStyle: RemixStyle;
  onSaveOutfit: () => void;
  isAlreadySaved: boolean;
  geminiResult: GeminiStylingResult | null;
  isGeminiLoading: boolean;
  onRegenerateGemini: () => void;
  onApplyCulturalReplacement?: (replacementIds: string[]) => void;
  outfitImage?: OutfitIllustrationResult | null;
  isImageLoading?: boolean;
  onRegenerateImage?: () => void;
  onGoToCompare?: () => void;
}

export const OutfitCardModal: React.FC<OutfitCardModalProps> = ({
  isOpen,
  onClose,
  occasion,
  garment,
  palette,
  patternName,
  patternKey,
  accessories,
  remixStyle,
  onSaveOutfit,
  isAlreadySaved,
  geminiResult,
  isGeminiLoading,
  onRegenerateGemini,
  onApplyCulturalReplacement,
  outfitImage,
  isImageLoading,
  onRegenerateImage,
  onGoToCompare,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'gemini' | 'illustration' | 'cultural' | 'heritage' | 'pose' | 'budget'>('gemini');
  const [fallbackDisplayMode, setFallbackDisplayMode] = useState<'mannequin' | 'poster'>('mannequin');
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  // Helper to ensure error message is ALWAYS a short, polite Vietnamese sentence (no raw JSON/English)
  const formatCleanErrorMessage = (err?: string): string => {
    if (!err) return 'Model tạo ảnh tạm đạt giới hạn lưu lượng (Quota 429). Đang dùng mannequin di sản dự phòng.';
    if (
      err.includes('{') ||
      err.includes('429') ||
      err.includes('RESOURCE_EXHAUSTED') ||
      err.includes('quota') ||
      err.includes('Quota') ||
      err.includes('GoogleGenerativeAI') ||
      err.includes('Candidate')
    ) {
      return 'Model tạo ảnh Gemini tạm đạt giới hạn lưu lượng (Quota 429). Hệ thống đã chuyển sang mannequin phác thảo di sản dự phòng.';
    }
    return err;
  };

  if (!isOpen) return null;

  // Derive cultural advisor advice from Gemini or heuristic fallback
  const culturalAdvice =
    geminiResult?.co_van_van_hoa ||
    checkCulturalIntegrity({
      occasion,
      garment,
      palette,
      pattern: patternName,
      selectedAccessories: accessories,
      remixStyle,
    });

  const displayTitle = geminiResult?.ten_bo_phoi || `${garment.name} · Remix ${remixStyle.name}`;
  const displayDescription = geminiResult?.mo_ta || garment.description;
  const harmonyScore = geminiResult?.diem_hai_hoa_mau ?? 92;
  const colorHexList = geminiResult?.bang_mau_hex?.length
    ? geminiResult.bang_mau_hex
    : [palette.primary, palette.secondary, palette.accent, '#18181B'];
  const suggestedAccessories = geminiResult?.phu_kien?.length
    ? geminiResult.phu_kien
    : accessories.map((a) => a.name);

  const derivedPattern: 'thuy-ba' | 'hoa-sen' | 'may-ngu-sac' | 'tron-toi-gian' | 'hoi-van' =
    patternKey ||
    (patternName.toLowerCase().includes('sen')
      ? 'hoa-sen'
      : patternName.toLowerCase().includes('mây')
      ? 'may-ngu-sac'
      : patternName.toLowerCase().includes('hồi')
      ? 'hoi-van'
      : patternName.toLowerCase().includes('đũi') || patternName.toLowerCase().includes('trơn')
      ? 'tron-toi-gian'
      : 'thuy-ba');

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const copyFormula = () => {
    const text = `👘 THẺ KẾT QUẢ VIỆT PHỤC REMIX - GỢI Ý BỞI GEMINI AI 👘
✨ Tên bộ phối: ${displayTitle}
🌟 Điểm hài hòa màu: ${harmonyScore}/100
🛡️ Đánh giá Cố vấn văn hóa: ${culturalAdvice.tieu_de_canh_bao} (Điểm tôn trọng di sản: ${culturalAdvice.diem_ton_trong_di_san}/100)
${culturalAdvice.canh_bao_sai_lech ? `⚠️ Cảnh báo: ${culturalAdvice.giai_thich_ngan}\n💡 Gợi ý thay thế: ${culturalAdvice.goi_y_thay_the}` : `✅ Nhận xét: ${culturalAdvice.giai_thich_ngan}`}
🎯 Dịp phù hợp: ${occasion.name}
💡 Lý do hợp dịp: ${geminiResult?.ly_do_hop_dip || 'Phù hợp trang nghiêm và tôn dáng sinh viên.'}
📝 Mô tả phối đồ: ${displayDescription}
🎨 Bảng màu Hex: ${colorHexList.join(' | ')}
👑 Cổ phục: ${garment.name} (${garment.alias})
📍 Vùng miền: ${garment.region}
⏳ Thời kỳ: ${garment.era}
📜 Nguồn gốc & Ý nghĩa: ${garment.originAndMeaning}
💎 Phụ kiện gợi ý: ${suggestedAccessories.join(', ')}
🎋 Phụ kiện đúng truyền thống: ${garment.traditionalAccessories.join(', ')}
🔥 Phong cách: ${remixStyle.name} (${remixStyle.keyRule})
#VietPhucRemix #GeminiAI #CoVanVanHoa #GenZHeritage #CoPhucVietNam`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
            <h3 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
              <span>Thẻ Kết Quả Phối Đồ</span>
              <span className="text-[11px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-600" />
                Gemini AI Stylist
              </span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tab Buttons */}
        <div className="flex items-center gap-1.5 px-4 pt-2.5 pb-2 border-b border-stone-100 bg-white overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('gemini')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'gemini'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>Thẻ Kết Quả Gemini</span>
          </button>

          <button
            onClick={() => setActiveTab('illustration')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'illustration'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                : isImageLoading
                ? 'text-rose-600 bg-rose-50/70 border border-rose-200'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-rose-600" />
            <span>Ảnh Minh Họa AI</span>
            {isImageLoading ? (
              <RotateCw className="w-3 h-3 text-rose-600 animate-spin" />
            ) : outfitImage?.isFallback ? (
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            ) : outfitImage ? (
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            ) : null}
          </button>

          <button
            onClick={() => setActiveTab('cultural')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'cultural'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                : culturalAdvice.canh_bao_sai_lech
                ? 'text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            {culturalAdvice.canh_bao_sai_lech ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            )}
            <span>Cố Vấn Văn Hóa</span>
            {culturalAdvice.canh_bao_sai_lech && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('heritage')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'heritage'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Nguồn Gốc & Di Sản</span>
          </button>

          <button
            onClick={() => setActiveTab('pose')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'pose'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Dáng Chụp Kỷ Yếu</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'budget'
                ? 'bg-rose-50 text-rose-700 border border-rose-200 shadow-xs'
                : 'text-stone-500 hover:bg-stone-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Dự Toán SV</span>
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {/* TAB 1: GEMINI RESULT CARD */}
          {activeTab === 'gemini' && (
            <div className="space-y-4">
              {/* Loading State Banner */}
              {isGeminiLoading ? (
                <div className="p-8 rounded-2xl border border-rose-200 bg-rose-50/50 flex flex-col items-center justify-center text-center space-y-3 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <RotateCw className="w-6 h-6 animate-spin" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-stone-900 text-sm sm:text-base">
                      Gemini đang phân tích bản phối & kiểm tra văn hóa...
                    </h4>
                    <p className="text-xs text-stone-500 max-w-sm">
                      Đang tính toán sắc độ màu hex, thẩm định tính chuẩn mực di sản đối với dịp &quot;{occasion.name}&quot; và tuyển chọn phụ kiện chuẩn gu.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Hero Header Card */}
                  <div
                    className="p-5 sm:p-6 rounded-2xl text-white relative overflow-hidden shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${palette.primary} 0%, #1c1917 100%)`,
                    }}
                  >
                    <div className="relative z-10 space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
                        <span className="flex items-center gap-1.5 bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">
                          <Calendar className="w-3 h-3" />
                          {occasion.name}
                        </span>

                        <span className="bg-rose-500/80 text-white font-semibold px-2.5 py-1 rounded-full text-[11px] backdrop-blur-md">
                          {remixStyle.name}
                        </span>
                      </div>

                      {/* Tên bộ phối */}
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase tracking-wider text-rose-200 font-bold">
                          Tên Bộ Phối Độc Bản
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                          {displayTitle}
                        </h2>
                      </div>

                      {/* Mô tả */}
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
                        {displayDescription}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-white/90">
                        <span className="bg-black/35 px-2.5 py-1 rounded-md">
                          📍 {garment.region}
                        </span>
                        <span className="bg-black/35 px-2.5 py-1 rounded-md">
                          ⏳ {garment.era}
                        </span>
                        <span className="bg-black/35 px-2.5 py-1 rounded-md">
                          ✨ {patternName}
                        </span>
                      </div>
                    </div>

                    {/* Watermark circle */}
                    <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full border-[20px] border-white/10 pointer-events-none" />
                  </div>

                  {/* ẢNH MINH HỌA BỘ PHỐI BỞI MODEL GEMINI */}
                  <div className="rounded-2xl border border-stone-200/90 bg-white overflow-hidden shadow-xs">
                    <div className="p-3.5 bg-stone-50/90 border-b border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                          <ImageIcon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                            <span>Ảnh Minh Họa Bộ Phối</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                              Gemini Image Model
                            </span>
                          </h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {onRegenerateImage && (
                          <button
                            onClick={onRegenerateImage}
                            disabled={isImageLoading}
                            className="h-7 px-2.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-[11px] flex items-center gap-1 transition-all active:scale-95 disabled:opacity-50"
                            title="Tạo lại ảnh minh họa"
                          >
                            <RotateCw className={`w-3 h-3 ${isImageLoading ? 'animate-spin text-rose-600' : ''}`} />
                            <span>Vẽ lại</span>
                          </button>
                        )}

                        {outfitImage && (
                          <button
                            onClick={() => setActiveTab('illustration')}
                            className="h-7 px-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-[11px] flex items-center gap-1 transition-all active:scale-95"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Xem lớn</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5">
                      {isImageLoading ? (
                        <div className="relative aspect-[3/4] max-h-[360px] w-full rounded-xl overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border border-stone-700/80 flex flex-col items-center justify-center p-6 text-center space-y-3 shadow-inner animate-pulse">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg animate-bounce">
                            <Sparkles className="w-7 h-7 animate-spin" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                              Model: gemini-3.1-flash-lite-image
                            </span>
                            <h4 className="text-sm font-bold text-white">
                              Gemini đang tạo ảnh minh họa bộ phối...
                            </h4>
                            <p className="text-xs text-stone-300 max-w-sm mx-auto leading-relaxed">
                              Đang tổng hợp dữ liệu từ JSON kết quả: tên bộ phối &quot;{displayTitle}&quot;, gam màu ({colorHexList.slice(0, 3).join(', ')}), họa tiết và phụ kiện đã chọn để phác họa ảnh thời trang sinh viên Gen Z.
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pt-2 text-[11px] text-stone-400">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            <span>Đang tạo ảnh thời trang chuẩn gu di sản</span>
                          </div>
                        </div>
                      ) : outfitImage ? (
                        <div className="space-y-3">
                          {/* Fallback Notice & Error Banner: Concise Vietnamese Only */}
                          {outfitImage.isFallback && (
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start justify-between gap-3 shadow-2xs">
                              <div className="flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <strong className="block text-amber-900 font-bold text-[11px]">
                                    {formatCleanErrorMessage(outfitImage.error)}
                                  </strong>
                                  <p className="text-[11px] text-amber-800 leading-relaxed">
                                    Hệ thống đã kích hoạt mannequin trực quan của Bước 3 để bạn luôn quan sát trọn vẹn kiểu dáng, họa tiết và phụ kiện.
                                  </p>
                                </div>
                              </div>
                              {onRegenerateImage && (
                                <button
                                  onClick={onRegenerateImage}
                                  disabled={isImageLoading}
                                  className="shrink-0 h-7 px-2.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold text-[10px] flex items-center gap-1 transition-all active:scale-95 shadow-xs"
                                >
                                  <RotateCw className="w-3 h-3" />
                                  <span>Thử lại</span>
                                </button>
                              )}
                            </div>
                          )}

                          {/* Fallback Toggle Switch: Mannequin vs Poster */}
                          {outfitImage.isFallback && (
                            <div className="flex items-center justify-between p-1 bg-stone-100 rounded-xl text-xs font-semibold">
                              <button
                                type="button"
                                onClick={() => setFallbackDisplayMode('mannequin')}
                                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                  fallbackDisplayMode === 'mannequin'
                                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                                    : 'text-stone-500 hover:text-stone-800'
                                }`}
                              >
                                <Shirt className="w-3.5 h-3.5 text-rose-600" />
                                <span>Mannequin Trực Quan (Bước 3)</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setFallbackDisplayMode('poster')}
                                className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                  fallbackDisplayMode === 'poster'
                                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                                    : 'text-stone-500 hover:text-stone-800'
                                }`}
                              >
                                <Palette className="w-3.5 h-3.5 text-amber-600" />
                                <span>Tranh Phác Thảo Vector</span>
                              </button>
                            </div>
                          )}

                          {/* Display Visual Content */}
                          {outfitImage.isFallback && fallbackDisplayMode === 'mannequin' ? (
                            <div className="rounded-xl overflow-hidden border border-stone-200/90 shadow-xs bg-stone-50">
                              <OutfitVisualizer
                                garment={garment}
                                palette={palette}
                                pattern={derivedPattern}
                                selectedAccessories={accessories}
                                remixStyleName={remixStyle.name}
                              />
                            </div>
                          ) : (
                            <div className="relative rounded-xl overflow-hidden border border-stone-200/80 bg-stone-950 group shadow-sm flex items-center justify-center">
                              <img
                                src={outfitImage.imageUrl}
                                alt={displayTitle}
                                referrerPolicy="no-referrer"
                                onError={() => {
                                  setImageLoadError(true);
                                  setFallbackDisplayMode('mannequin');
                                }}
                                className="w-full max-h-[420px] object-contain sm:object-cover transition-transform duration-500 group-hover:scale-101"
                              />

                              {/* Badge over image */}
                              <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                                {outfitImage.isFallback ? (
                                  <span className="px-2.5 py-1 rounded-full bg-amber-950/90 text-amber-200 text-[10px] font-bold backdrop-blur-md border border-amber-500/40 flex items-center gap-1.5 shadow-sm pointer-events-auto">
                                    <Palette className="w-3 h-3 text-amber-400" />
                                    <span>Tranh Phác Thảo Di Sản (Dự Phòng)</span>
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 rounded-full bg-emerald-950/90 text-emerald-200 text-[10px] font-bold backdrop-blur-md border border-emerald-500/40 flex items-center gap-1.5 shadow-sm pointer-events-auto">
                                    <Sparkles className="w-3 h-3 text-emerald-400" />
                                    <span>Tạo Bởi Gemini AI</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="p-6 rounded-xl border border-dashed border-stone-300 bg-stone-50 text-center space-y-2">
                          <Sparkles className="w-6 h-6 text-rose-500 mx-auto" />
                          <h5 className="font-bold text-xs text-stone-800">Chưa có ảnh minh họa</h5>
                          <p className="text-[11px] text-stone-500 max-w-xs mx-auto">
                            Nhấn nút bên dưới để Gemini AI tạo tranh phác họa thời trang dành riêng cho bộ phối này.
                          </p>
                          {onRegenerateImage && (
                            <button
                              onClick={onRegenerateImage}
                              disabled={isImageLoading}
                              className="mt-1 h-8 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-xs hover:shadow-sm"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Tạo Ảnh Minh Họa Ngay</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CỐ VẤN VĂN HÓA BỞI GEMINI */}
                  <div
                    className={`p-4 rounded-2xl border transition-all ${
                      culturalAdvice.canh_bao_sai_lech
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50/80 border-amber-300 text-amber-950 shadow-xs'
                        : 'bg-gradient-to-br from-emerald-50 to-teal-50/80 border-emerald-200 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`p-1.5 rounded-xl shrink-0 ${
                            culturalAdvice.canh_bao_sai_lech
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-emerald-200 text-emerald-900'
                          }`}
                        >
                          {culturalAdvice.canh_bao_sai_lech ? (
                            <ShieldAlert className="w-5 h-5 text-amber-800" />
                          ) : (
                            <ShieldCheck className="w-5 h-5 text-emerald-800" />
                          )}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                culturalAdvice.canh_bao_sai_lech
                                  ? 'bg-amber-200 text-amber-900'
                                  : 'bg-emerald-200 text-emerald-900'
                              }`}
                            >
                              {culturalAdvice.canh_bao_sai_lech
                                ? 'Cố Vấn Văn Hóa Cảnh Báo'
                                : 'Cố Vấn Văn Hóa Xác Nhận'}
                            </span>
                            <span className="text-[11px] text-stone-500 font-medium">Gemini Heritage Guard</span>
                          </div>
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900">
                            {culturalAdvice.tieu_de_canh_bao}
                          </h4>
                        </div>
                      </div>

                      <div className="text-right shrink-0 bg-white/70 px-2.5 py-1 rounded-xl border border-stone-200/60">
                        <span className="text-[9px] text-stone-500 block uppercase font-bold">Tôn trọng di sản</span>
                        <span
                          className={`text-xs sm:text-sm font-black ${
                            culturalAdvice.canh_bao_sai_lech ? 'text-amber-700' : 'text-emerald-700'
                          }`}
                        >
                          {culturalAdvice.diem_ton_trong_di_san}/100
                        </span>
                      </div>
                    </div>

                    {/* Giải thích ngắn */}
                    <div className="text-xs text-stone-700 leading-relaxed mb-3 bg-white/80 p-3 rounded-xl border border-stone-200/70">
                      <strong className="text-stone-900 block mb-0.5">📖 Giải thích ngắn từ điển tích:</strong>
                      {culturalAdvice.giai_thich_ngan}
                    </div>

                    {/* Gợi ý thay thế tôn trọng truyền thống */}
                    <div
                      className={`text-xs p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        culturalAdvice.canh_bao_sai_lech
                          ? 'bg-amber-100/70 border-amber-300 text-amber-950'
                          : 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                      }`}
                    >
                      <div className="space-y-0.5 flex-1">
                        <strong className="block text-[11px] uppercase tracking-wide">
                          💡 Gợi ý thay thế tôn trọng truyền thống:
                        </strong>
                        <p className="text-xs leading-relaxed text-stone-800">
                          {culturalAdvice.goi_y_thay_the}
                        </p>
                      </div>

                      {culturalAdvice.canh_bao_sai_lech &&
                        culturalAdvice.phu_kien_thay_the_ids &&
                        culturalAdvice.phu_kien_thay_the_ids.length > 0 &&
                        onApplyCulturalReplacement && (
                          <button
                            type="button"
                            onClick={() => onApplyCulturalReplacement(culturalAdvice.phu_kien_thay_the_ids!)}
                            className="shrink-0 h-9 px-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5 text-amber-200" />
                            <span>Áp Dụng Gợi Ý Chuẩn Hóa</span>
                          </button>
                        )}
                    </div>
                  </div>

                  {/* Điểm hài hòa màu & Lý do hợp dịp (Grid 2 cols) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    {/* Điểm hài hòa màu (0-100) */}
                    <div className="sm:col-span-5 p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/90 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-600" />
                          Điểm Hài Hòa Màu Sắc
                        </span>
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-semibold">
                          0 - 100
                        </span>
                      </div>

                      <div className="my-2 flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl font-black text-amber-700 tracking-tight">
                          {harmonyScore}
                        </span>
                        <span className="text-xs font-semibold text-stone-500">/ 100</span>
                      </div>

                      {/* Progress bar visual */}
                      <div className="space-y-1.5">
                        <div className="w-full bg-amber-200/60 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-rose-500 h-2.5 rounded-full transition-all duration-700"
                            style={{ width: `${Math.min(100, Math.max(10, harmonyScore))}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-amber-800 font-medium">
                          {harmonyScore >= 90
                            ? '✨ Phối màu xuất sắc, tôn da và cực kỳ ăn ảnh!'
                            : harmonyScore >= 80
                            ? '👌 Tương phản tinh tế, cá tính và bắt mắt.'
                            : '🌿 Nhã nhặn, tôn trọng quy chuẩn truyền thống.'}
                        </p>
                      </div>
                    </div>

                    {/* Lý do hợp dịp */}
                    <div className="sm:col-span-7 p-4 rounded-2xl bg-stone-50 border border-stone-200/90 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-800 mb-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Lý Do Hợp Dịp: {occasion.name}</span>
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed flex-1">
                        {geminiResult?.ly_do_hop_dip ||
                          `Bản phối hoàn toàn hòa nhập với không gian của ${occasion.name}. Tà áo chỉn chu tôn lên vẻ đoan trang, trong khi các chi tiết cách tân giúp bạn luôn năng động và tự tin.`}
                      </p>
                      <div className="pt-2 text-[10px] text-stone-400">
                        Gợi ý bám sát tinh thần sinh viên & hoàn cảnh thực tế.
                      </div>
                    </div>
                  </div>

                  {/* Bảng màu Hex */}
                  <div className="p-4 rounded-2xl bg-white border border-stone-200/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-rose-600" />
                        Bảng Màu Hex Đề Xuất Bởi Gemini ({colorHexList.length} sắc độ)
                      </span>
                      <span className="text-[10px] text-stone-400">Chạm để sao chép mã màu</span>
                    </div>

                    {/* Color Swatch Tiles */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {colorHexList.map((hex, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => copyHex(hex)}
                          className="p-2 rounded-xl border border-stone-200 hover:border-stone-400 transition-all flex items-center gap-2.5 bg-stone-50/60 active:scale-95 text-left group"
                        >
                          <span
                            className="w-7 h-7 rounded-lg shrink-0 border border-black/10 shadow-inner"
                            style={{ backgroundColor: hex }}
                          />
                          <div className="min-w-0 flex-1">
                            <span className="font-mono text-xs font-bold text-stone-800 block truncate">
                              {hex.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-stone-400 block group-hover:text-stone-600">
                              {copiedHex === hex ? 'Đã chép ✓' : `Màu ${idx + 1}`}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Gradient ribbon */}
                    <div
                      className="h-2 rounded-full w-full shadow-inner"
                      style={{
                        background: `linear-gradient(to right, ${colorHexList.join(', ')})`,
                      }}
                    />
                  </div>

                  {/* Phụ kiện gợi ý */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                        Phụ Kiện Gợi Ý Đi Cùng
                      </span>
                      <span className="text-[10px] text-stone-400">
                        {suggestedAccessories.length} món hoàn hảo
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {suggestedAccessories.map((accName, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-xs font-medium text-stone-800 flex items-center gap-1.5 shadow-2xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>{accName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB: ẢNH MINH HỌA AI CHUYÊN SÂU */}
          {activeTab === 'illustration' && (
            <div className="space-y-4">
              {isImageLoading ? (
                <div className="p-8 sm:p-12 rounded-2xl border border-rose-200 bg-rose-50/40 text-center space-y-4 animate-pulse">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white mx-auto shadow-md">
                    <Sparkles className="w-8 h-8 animate-spin" />
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-100 px-2.5 py-1 rounded-full">
                      Model: gemini-3.1-flash-lite-image
                    </span>
                    <h4 className="text-base font-bold text-stone-900 mt-2">
                      Gemini AI đang vẽ ảnh minh họa thời trang...
                    </h4>
                    <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                      Đang phân tích prompt thời trang chuyển thể từ JSON kết quả: {displayTitle}, gam màu ({colorHexList.join(', ')}), trang phục {garment.name} ({garment.era}).
                    </p>
                  </div>
                  <div className="flex justify-center gap-2 pt-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              ) : outfitImage ? (
                <div className="space-y-4">
                  {/* Fallback Mode Toggle */}
                  {outfitImage.isFallback && (
                    <div className="flex items-center justify-between p-1 bg-stone-100 rounded-xl text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => setFallbackDisplayMode('mannequin')}
                        className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                          fallbackDisplayMode === 'mannequin'
                            ? 'bg-white text-stone-900 shadow-xs font-bold'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <Shirt className="w-3.5 h-3.5 text-rose-600" />
                        <span>Mannequin Trực Quan (Bước 3)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFallbackDisplayMode('poster')}
                        className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                          fallbackDisplayMode === 'poster'
                            ? 'bg-white text-stone-900 shadow-xs font-bold'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        <Palette className="w-3.5 h-3.5 text-amber-600" />
                        <span>Tranh Phác Thảo Vector</span>
                      </button>
                    </div>
                  )}

                  {/* Visual Container */}
                  {outfitImage.isFallback && fallbackDisplayMode === 'mannequin' ? (
                    <div className="rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs bg-stone-50">
                      <OutfitVisualizer
                        garment={garment}
                        palette={palette}
                        pattern={derivedPattern}
                        selectedAccessories={accessories}
                        remixStyleName={remixStyle.name}
                      />
                    </div>
                  ) : (
                    /* Full Image Card */
                    <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-950 shadow-md">
                      <img
                        src={outfitImage.imageUrl}
                        alt={displayTitle}
                        referrerPolicy="no-referrer"
                        onError={() => {
                          setImageLoadError(true);
                          setFallbackDisplayMode('mannequin');
                        }}
                        className="w-full max-h-[540px] object-contain mx-auto"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        {outfitImage.isFallback ? (
                          <span className="px-3 py-1 rounded-full bg-amber-950/90 text-amber-200 text-xs font-bold backdrop-blur-md border border-amber-500/40 flex items-center gap-1.5 shadow-sm">
                            <Palette className="w-3.5 h-3.5 text-amber-400" />
                            <span>Tranh Phác Thảo Di Sản (Dự Phòng)</span>
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-200 text-xs font-bold backdrop-blur-md border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Tạo Bởi Model Gemini Image</span>
                          </span>
                        )}

                        <div className="flex items-center gap-1.5">
                          <a
                            href={outfitImage.imageUrl}
                            download={`${garment.id}-remix-gemini-illustration.png`}
                            className="h-8 px-3 rounded-xl bg-black/70 hover:bg-black/90 text-white font-semibold text-xs flex items-center gap-1.5 backdrop-blur-md border border-white/20 transition-all"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Tải về</span>
                          </a>
                          {onRegenerateImage && (
                            <button
                              onClick={onRegenerateImage}
                              disabled={isImageLoading}
                              className="h-8 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                            >
                              <RotateCw className={`w-3.5 h-3.5 ${isImageLoading ? 'animate-spin' : ''}`} />
                              <span>Vẽ lại</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Bottom status if fallback */}
                      {outfitImage.isFallback && (
                        <div className="p-3 bg-amber-950/90 border-t border-amber-800 text-amber-200 text-xs flex items-center justify-between gap-3">
                          <span className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span>{formatCleanErrorMessage(outfitImage.error)}</span>
                          </span>
                          {onRegenerateImage && (
                            <button
                              onClick={onRegenerateImage}
                              className="text-white underline font-bold shrink-0 hover:text-amber-100"
                            >
                              Thử lại
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Prompt detail breakdown based on JSON result */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                        <span>Prompt Tạo Ảnh Dựa Trên JSON Kết Quả</span>
                      </span>
                      {outfitImage.prompt && (
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(outfitImage.prompt || '');
                            setCopiedPrompt(true);
                            setTimeout(() => setCopiedPrompt(false), 2000);
                          }}
                          className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
                        >
                          {copiedPrompt ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedPrompt ? 'Đã chép' : 'Sao chép prompt'}</span>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed bg-white p-3 rounded-xl border border-stone-200/80 font-mono text-[11px]">
                      {outfitImage.prompt || `Cinematic fashion portrait: ${displayTitle}, ${garment.name} (${garment.era}), palette: ${colorHexList.join(', ')}, accessories: ${suggestedAccessories.join(', ')}`}
                    </p>
                    <div className="flex flex-wrap gap-2 text-[10px] text-stone-500">
                      <span className="bg-stone-200/80 px-2 py-0.5 rounded">Tỷ lệ: 3:4 (Portrait)</span>
                      <span className="bg-stone-200/80 px-2 py-0.5 rounded">Model: gemini-3.1-flash-lite-image</span>
                      <span className="bg-stone-200/80 px-2 py-0.5 rounded">Cổ phục: {garment.name}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-10 rounded-2xl border border-dashed border-stone-300 bg-stone-50 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-stone-900">Chưa tạo ảnh minh họa</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Khởi động model tạo ảnh của Gemini để sinh tranh phác họa thời trang độc bản dựa trên kết quả phối đồ của bạn.
                  </p>
                  {onRegenerateImage && (
                    <button
                      onClick={onRegenerateImage}
                      disabled={isImageLoading}
                      className="h-9 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold text-xs inline-flex items-center gap-1.5 shadow-sm hover:shadow"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Tạo Ảnh Minh Họa Ngay</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CỐ VẤN VĂN HÓA CHUYÊN SÂU */}
          {activeTab === 'cultural' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border ${
                  culturalAdvice.canh_bao_sai_lech
                    ? 'bg-amber-50/90 border-amber-300'
                    : 'bg-emerald-50/80 border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {culturalAdvice.canh_bao_sai_lech ? (
                    <AlertTriangle className="w-5 h-5 text-amber-700" />
                  ) : (
                    <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  )}
                  <h4 className="font-bold text-sm text-stone-900">{culturalAdvice.tieu_de_canh_bao}</h4>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed mb-3">
                  {culturalAdvice.giai_thich_ngan}
                </p>

                <div className="bg-white/80 p-3 rounded-xl border border-stone-200/70 space-y-1">
                  <span className="text-[11px] font-bold text-stone-800 block">
                    Gợi ý thay thế tôn trọng truyền thống:
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {culturalAdvice.goi_y_thay_the}
                  </p>
                </div>

                {culturalAdvice.canh_bao_sai_lech &&
                  culturalAdvice.phu_kien_thay_the_ids &&
                  culturalAdvice.phu_kien_thay_the_ids.length > 0 &&
                  onApplyCulturalReplacement && (
                    <button
                      type="button"
                      onClick={() => onApplyCulturalReplacement(culturalAdvice.phu_kien_thay_the_ids!)}
                      className="mt-3 w-full h-9 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                    >
                      <Check className="w-4 h-4 text-amber-200" />
                      <span>Áp Dụng Phụ Kiện Chuẩn Văn Hóa Ngay</span>
                    </button>
                  )}
              </div>

              {/* Nguyên tắc cốt lõi của loại cổ phục này */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5">
                <span className="text-xs font-bold text-stone-900 block">
                  Quy Chuẩn Cốt Lõi Của {garment.name} ({garment.era})
                </span>
                <ul className="text-xs text-stone-600 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">·</span>
                    <span><strong>Vùng miền:</strong> {garment.region}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">·</span>
                    <span><strong>Cấu trúc & Cổ áo:</strong> {garment.structureNote}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">·</span>
                    <span><strong>Phụ kiện đúng truyền thống:</strong> {garment.traditionalAccessories.join(', ')}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">·</span>
                    <span><strong>Dịp lễ nghi phù hợp:</strong> {garment.suitableOccasions.join(', ')}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 3: HERITAGE & ORIGIN */}
          {activeTab === 'heritage' && (
            <div className="space-y-4">
              {/* Highlight header */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900">{garment.name}</span>
                  <span className="text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded text-[11px] font-medium">
                    {garment.era}
                  </span>
                </div>
                <p className="text-xs text-stone-700 italic">
                  &quot;{garment.alias}&quot;
                </p>
                <p className="text-xs text-stone-800 leading-relaxed">
                  {garment.description}
                </p>
              </div>

              {/* Nguồn gốc & Ý nghĩa (2-3 câu) */}
              <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  Nguồn Gốc & Ý Nghĩa Di Sản:
                </span>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {garment.originAndMeaning}
                </p>
              </div>

              {/* Phụ kiện đúng truyền thống */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-900">
                  Phụ Kiện Đi Kèm Đúng Truyền Thống:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {garment.traditionalAccessories.map((acc, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white text-stone-800 px-2.5 py-1 rounded-lg border border-stone-200 shadow-2xs font-medium"
                    >
                      ✓ {acc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dịp phù hợp theo truyền thống */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-stone-900">
                  Các Dịp Phù Hợp Đúng Chuẩn:
                </span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-stone-600">
                  {garment.suitableOccasions.map((occ, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      <span>{occ}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: POSE RECOMMENDATIONS */}
          {activeTab === 'pose' && (
            <div className="space-y-3">
              <div className="text-xs text-stone-500">
                Gợi ý 4 thế tạo dáng chuẩn nét điện ảnh khi diện cổ phục cùng nhóm bạn sinh viên:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {POSE_TIPS.map((pose, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-900">{pose.title}</h4>
                      <span className="text-[10px] text-rose-700 bg-rose-100/70 px-1.5 py-0.5 rounded font-medium">
                        {pose.idealFor}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {pose.instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BUDGET BREAKDOWN */}
          {activeTab === 'budget' && (
            <div className="space-y-4">
              <div className="text-xs text-stone-500">
                Bảng tính kinh phí thực tế cho sinh viên để chuẩn bị bộ trang phục này:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Option 1: Renting */}
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-900">Phương án 1: Thuê</span>
                    <span className="text-[10px] bg-rose-200 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                      Khuyên Dùng
                    </span>
                  </div>
                  <p className="text-lg font-extrabold text-rose-700">80k - 180k</p>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Thuê trong 24h - 48h chụp kỷ yếu, lễ tốt nghiệp. Đi kèm giặt ủi và phụ kiện cơ bản.
                  </p>
                </div>

                {/* Option 2: Remix from wardrobe */}
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <span className="font-bold text-emerald-900">Phương án 2: Tự Mix</span>
                  <p className="text-lg font-extrabold text-emerald-700">0đ - 100k</p>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Chỉ thuê riêng áo cổ phục, tận dụng quần jeans, giày sneaker chunky và túi tote có sẵn trong tủ!
                  </p>
                </div>

                {/* Option 3: Buy / Tailor */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <span className="font-bold text-stone-900">Phương án 3: May Sẵn</span>
                  <p className="text-lg font-extrabold text-stone-700">450k - 850k</p>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Sở hữu vĩnh viễn chiếc áo ngũ thân hoặc cách tân linen, mặc được nhiều dịp trong 4 năm đại học.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <strong>Mẹo tiết kiệm cho sinh viên: </strong>
                Rủ nhóm bạn từ 4-5 người thuê cùng lúc tại các tiệm quanh làng đại học để nhận chiết khấu nhóm 20% - 25%!
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="px-5 py-3.5 border-t border-stone-200 bg-stone-50/90 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <button
              onClick={copyFormula}
              className="h-9 sm:h-10 px-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép thẻ!' : 'Sao chép thẻ'}</span>
            </button>

            <button
              onClick={onRegenerateGemini}
              disabled={isGeminiLoading}
              className="h-9 sm:h-10 px-3.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
              title="Nhờ Gemini gợi ý bản phối mới"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isGeminiLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Phân tích lại</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onGoToCompare && (
              <button
                onClick={onGoToCompare}
                className="h-9 sm:h-10 px-3.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs"
                title="Mở bảng so sánh 3 bộ phối song song"
              >
                <Columns3 className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Xem Bảng So Sánh</span>
              </button>
            )}

            <button
              onClick={onSaveOutfit}
              className={`h-9 sm:h-10 px-4 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-2xs ${
                isAlreadySaved
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-rose-600 text-white hover:bg-rose-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isAlreadySaved ? 'Đã lưu trong So Sánh' : 'Lưu vào So Sánh (Tối đa 3 bộ)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
