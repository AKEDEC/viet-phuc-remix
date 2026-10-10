import React, { useState, useEffect } from 'react';
import { UserOutfit } from '../types';
import {
  getLookbookDataUrl,
  downloadLookbookImage,
  shareLookbookImage,
} from '../utils/lookbookCanvasExporter';
import {
  X,
  Download,
  Share2,
  Sparkles,
  Check,
  RotateCw,
  ImageIcon,
  Maximize2,
  Layers,
} from 'lucide-react';

interface LookbookExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedOutfits: UserOutfit[];
}

export const LookbookExportModal: React.FC<LookbookExportModalProps> = ({
  isOpen,
  onClose,
  savedOutfits,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Initialize selected outfits to all available (max 3)
  useEffect(() => {
    if (isOpen && savedOutfits.length > 0) {
      setSelectedIds(savedOutfits.slice(0, 3).map((o) => o.id));
    }
  }, [isOpen, savedOutfits]);

  // Generate lookbook preview whenever selection changes
  useEffect(() => {
    if (!isOpen || selectedIds.length === 0) return;

    const activeOutfits = savedOutfits.filter((o) => selectedIds.includes(o.id));
    if (activeOutfits.length === 0) return;

    let isMounted = true;
    setIsGenerating(true);

    getLookbookDataUrl(activeOutfits)
      .then((url) => {
        if (isMounted) {
          setPreviewUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi vẽ Lookbook Canvas:', err);
        if (isMounted) {
          setIsGenerating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, selectedIds, savedOutfits]);

  if (!isOpen) return null;

  const activeOutfits = savedOutfits.filter((o) => selectedIds.includes(o.id));

  const toggleSelectOutfit = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length === 1) {
        showToast('Cần giữ lại ít nhất 1 bộ phối để xuất lookbook!');
        return;
      }
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    } else {
      if (selectedIds.length >= 3) {
        showToast('Tối đa xuất 3 bộ phối trong một ảnh Lookbook.');
        return;
      }
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownload = async () => {
    if (activeOutfits.length === 0) return;
    try {
      await downloadLookbookImage(
        activeOutfits,
        `lookbook-viet-phuc-${new Date().toISOString().slice(0, 10)}.png`
      );
      showToast('Đã tải ảnh Lookbook chất lượng cao thành công!');
    } catch {
      showToast('Có lỗi khi tải ảnh.');
    }
  };

  const handleShare = async () => {
    if (activeOutfits.length === 0) return;
    const res = await shareLookbookImage(activeOutfits);
    if (res.success) {
      if (res.method === 'clipboard') {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
      showToast(res.message);
    } else {
      showToast(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center text-white shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-sm sm:text-base flex items-center gap-2">
                <span>Xuất Lookbook Thành Một Ảnh</span>
                <span className="text-[11px] bg-rose-100 text-rose-800 font-semibold px-2 py-0.5 rounded-full">
                  {activeOutfits.length}/3 bộ phối
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Ghép so sánh các bộ phối thành 1 ấn phẩm tạp chí di sản HD để tải về và chia sẻ
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast inside modal */}
        {toastMessage && (
          <div className="bg-stone-900 text-white text-xs px-4 py-2 text-center animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-stone-100/60">
          {/* Selection pills */}
          <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                Chọn các bộ phối đưa vào Lookbook (tối đa 3 bộ):
              </span>
              <span className="text-[11px] text-stone-500">Đã chọn: {selectedIds.length}/3</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {savedOutfits.map((outfit, idx) => {
                const isSelected = selectedIds.includes(outfit.id);
                return (
                  <button
                    key={outfit.id}
                    onClick={() => toggleSelectOutfit(outfit.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-rose-600 bg-rose-50/70 text-rose-900 font-semibold shadow-xs'
                        : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    <div className="truncate">
                      <p className="text-[10px] text-stone-400 uppercase tracking-wider">
                        Slot {idx + 1}
                      </p>
                      <p className="text-xs truncate font-bold">
                        {outfit.customName || `Bản phối ${idx + 1}`}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-rose-600 text-white' : 'border border-stone-300 text-transparent'
                      }`}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview Container */}
          <div className="relative rounded-2xl border border-stone-300 bg-stone-900/5 p-4 flex flex-col items-center justify-center min-h-[380px] shadow-inner overflow-hidden">
            {isGenerating ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto text-rose-600 animate-spin">
                  <RotateCw className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-stone-800">
                  Đang biên tập & kết xuất ảnh Lookbook HD...
                </p>
                <p className="text-xs text-stone-500 max-w-sm">
                  Đang đồng bộ màu sắc di sản, họa tiết sóng nước và thông số so sánh cạnh nhau.
                </p>
              </div>
            ) : previewUrl ? (
              <div className="w-full flex flex-col items-center space-y-3">
                <div className="relative group max-h-[500px] overflow-auto rounded-xl shadow-lg border border-stone-200 bg-white">
                  <img
                    src={previewUrl}
                    alt="Bản xem trước Lookbook Việt Phục Remix"
                    className="max-h-[480px] w-auto object-contain mx-auto transition-transform"
                  />
                  <div className="absolute bottom-2 right-2 bg-stone-900/80 text-white text-[10px] px-2.5 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
                    <Maximize2 className="w-3 h-3" />
                    <span>Ấn phẩm độ phân giải cao</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-500 text-center">
                  Ảnh được dàn trang ngang chuẩn tạp chí di sản, gồm đầy đủ phom áo, bảng màu, điểm cố vấn văn hóa và phụ kiện.
                </p>
              </div>
            ) : (
              <div className="py-12 text-center text-stone-400 space-y-2">
                <ImageIcon className="w-10 h-10 mx-auto opacity-50" />
                <p className="text-xs">Chưa có ảnh xem trước</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-4 border-t border-stone-200 bg-stone-50 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-500">
            <span className="font-semibold text-stone-700">Định dạng:</span> PNG chất lượng cao · Phù hợp đăng Story, Zalo, Portfolio kỷ yếu
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleShare}
              disabled={isGenerating || !previewUrl}
              className="h-10 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-semibold text-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 shadow-xs"
            >
              <Share2 className="w-4 h-4 text-stone-600" />
              <span>{copied ? 'Đã sao chép ảnh!' : 'Chia sẻ Lookbook'}</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={isGenerating || !previewUrl}
              className="h-10 px-5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-bold text-xs flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-rose-900/15"
            >
              <Download className="w-4 h-4" />
              <span>Tải Ảnh Về Máy (PNG)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
