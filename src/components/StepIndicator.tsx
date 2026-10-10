import React from 'react';
import { StepNumber } from '../types';
import { Calendar, Shirt, Palette, Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: StepNumber;
  onSelectStep: (step: StepNumber) => void;
  occasionName?: string;
  garmentName?: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  occasionName,
  garmentName,
}) => {
  const steps: { step: StepNumber; title: string; subtitle: string; icon: React.ReactNode; preview?: string }[] = [
    {
      step: 1,
      title: 'Bước 1: Chọn Dịp',
      subtitle: 'Bối cảnh xuất hiện',
      icon: <Calendar className="w-4 h-4" />,
      preview: occasionName,
    },
    {
      step: 2,
      title: 'Bước 2: Chọn Cổ Phục',
      subtitle: 'Phom dáng truyền thống',
      icon: <Shirt className="w-4 h-4" />,
      preview: garmentName,
    },
    {
      step: 3,
      title: 'Bước 3: Remix & Phụ Kiện',
      subtitle: 'Tone màu & Vibe Gen Z',
      icon: <Palette className="w-4 h-4" />,
    },
  ];

  return (
    <div className="w-full bg-white border border-stone-200 rounded-2xl p-3 sm:p-4 shadow-sm mb-6">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 relative">
        {steps.map((item) => {
          const isActive = currentStep === item.step;
          const isCompleted = currentStep > item.step;

          return (
            <button
              key={item.step}
              onClick={() => onSelectStep(item.step)}
              className={`text-left p-2.5 sm:p-3 rounded-xl transition-all relative flex flex-col justify-between ${
                isActive
                  ? 'bg-rose-50/80 border border-rose-200'
                  : isCompleted
                  ? 'bg-stone-50 hover:bg-stone-100 border border-stone-200'
                  : 'bg-transparent hover:bg-stone-50 border border-transparent opacity-75'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span
                  className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                    isActive
                      ? 'bg-rose-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : item.step}
                </span>

                <span className="hidden sm:inline-block text-stone-400">
                  {item.icon}
                </span>
              </div>

              <div>
                <p
                  className={`text-xs sm:text-sm font-semibold truncate ${
                    isActive ? 'text-rose-900' : isCompleted ? 'text-stone-800' : 'text-stone-600'
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-[11px] text-stone-400 truncate hidden sm:block">
                  {item.preview ? (
                    <span className="text-stone-600 font-medium">{item.preview}</span>
                  ) : (
                    item.subtitle
                  )}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
