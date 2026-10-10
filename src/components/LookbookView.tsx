import React, { useState } from 'react';
import { PRESET_LOOKBOOKS } from '../data/vietPhucData';
import { PresetLookbook } from '../types';
import { Heart, Sparkles, ArrowRight, UserCheck, BookmarkPlus } from 'lucide-react';

interface LookbookViewProps {
  onApplyPreset: (preset: PresetLookbook) => void;
  onSavePresetToCompare?: (preset: PresetLookbook) => void;
}

export const LookbookView: React.FC<LookbookViewProps> = ({
  onApplyPreset,
  onSavePresetToCompare,
}) => {
  const [likes, setLikes] = useState<{ [id: string]: number }>(
    PRESET_LOOKBOOKS.reduce((acc, cur) => ({ ...acc, [cur.id]: cur.likes }), {})
  );
  const [hasLiked, setHasLiked] = useState<{ [id: string]: boolean }>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasLiked[id]) {
      setLikes((prev) => ({ ...prev, [id]: prev[id] - 1 }));
      setHasLiked((prev) => ({ ...prev, [id]: false }));
    } else {
      setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      setHasLiked((prev) => ({ ...prev, [id]: true }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span>Lookbook Gen Z</span>
          <span aria-hidden="true">·</span>
          <span>Cộng đồng sinh viên</span>
          <span aria-hidden="true">·</span>
          <span>Bản phối thịnh hành</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
          Các bản phối Việt phục Remix được sinh viên yêu thích nhất
        </h2>
        <p className="text-sm text-stone-600 max-w-2xl">
          Tham khảo những bản phối thực tế do các bạn sinh viên sáng tạo cho dịp kỷ yếu, thuyết trình hay dạo phố cuối tuần. Bấm để nạp ngay vào Studio và chỉnh sửa tiếp!
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESET_LOOKBOOKS.map((lb) => {
          const isLiked = hasLiked[lb.id];

          return (
            <div
              key={lb.id}
              className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-rose-300 transition-all flex flex-col justify-between shadow-xs group"
            >
              <div>
                {/* Persona tag */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-rose-600" />
                    {lb.studentPersona}
                  </span>

                  <button
                    onClick={(e) => handleLike(lb.id, e)}
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-rose-600 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isLiked ? 'text-rose-600 fill-rose-600' : 'text-stone-400'
                      }`}
                    />
                    <span className="font-mono text-[11px]">{likes[lb.id]}</span>
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-stone-900 group-hover:text-rose-700 transition-colors mb-1">
                  {lb.title}
                </h3>
                <p className="text-xs text-stone-400 font-medium mb-3">
                  {lb.occasionName} · {lb.garmentName}
                </p>

                {/* Description */}
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {lb.description}
                </p>

                {/* Key items highlights */}
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs mb-4">
                  <p className="font-semibold text-stone-700 text-[11px] mb-1.5">Công thức điểm nhấn:</p>
                  <div className="flex flex-wrap gap-1">
                    {lb.highlightItems.map((item, idx) => (
                      <span key={idx} className="text-[10px] bg-white text-stone-700 px-2 py-0.5 rounded border border-stone-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-2">
                <button
                  onClick={() => onApplyPreset(lb)}
                  className="flex-1 h-10 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
                >
                  <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                  <span>Nạp Vào Studio</span>
                </button>

                {onSavePresetToCompare && (
                  <button
                    onClick={() => onSavePresetToCompare(lb)}
                    className="h-10 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 text-stone-700 font-medium text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    title="Lưu vào 1 trong 3 slot so sánh"
                  >
                    <BookmarkPlus className="w-4 h-4 text-rose-600" />
                    <span className="hidden sm:inline">So Sánh</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
