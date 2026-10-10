import { useState, useEffect } from 'react';
import {
  TabType,
  StepNumber,
  Occasion,
  Garment,
  ColorPalette,
  RemixStyle,
  UserOutfit,
  PresetLookbook,
  GeminiStylingResult,
  OutfitIllustrationResult,
} from './types';
import { generateVietPhucFallbackSvg } from './utils/fallbackImageGenerator';
import {
  OCCASIONS,
  GARMENTS,
  COLOR_PALETTES,
  ACCESSORIES,
  REMIX_STYLES,
} from './data/vietPhucData';
import { Header } from './components/Header';
import { StepIndicator } from './components/StepIndicator';
import { Step1Occasion } from './components/Step1Occasion';
import { Step2Garment } from './components/Step2Garment';
import { Step3Remix } from './components/Step3Remix';
import { OutfitVisualizer } from './components/OutfitVisualizer';
import { OutfitCardModal } from './components/OutfitCardModal';
import { LookbookView } from './components/LookbookView';
import { GuideView } from './components/GuideView';
import { SavedOutfitsView } from './components/SavedOutfitsView';
import { BottomNavBar } from './components/BottomNavBar';
import { checkCulturalIntegrity } from './utils/culturalAdvisor';
import { Sparkles, Dices, Eye, X, Layers, Columns3, AlertCircle, ArrowRight } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'viet_phuc_remix_saved_outfits';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('remix');
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

  // Configuration state
  const [selectedOccasionId, setSelectedOccasionId] = useState<string>('graduation');
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>('ao-dai');
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>('son-dao');
  const [selectedPattern, setSelectedPattern] = useState<
    'thuy-ba' | 'hoa-sen' | 'may-ngu-sac' | 'tron-toi-gian' | 'hoi-van'
  >('thuy-ba');
  const [selectedAccessoryIds, setSelectedAccessoryIds] = useState<string[]>([
    'chunky-sneaker',
    'kieng-bac',
    'tote-thuy-ba',
  ]);
  const [selectedRemixStyleId, setSelectedRemixStyleId] = useState<string>(
    'streetwear-breakthrough'
  );

  // Modal & Mobile preview states
  const [isCardModalOpen, setIsCardModalOpen] = useState<boolean>(false);
  const [showMobileVisualizer, setShowMobileVisualizer] = useState<boolean>(true);
  const [savedOutfits, setSavedOutfits] = useState<UserOutfit[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Slot limit replacement modal (max 3 outfits)
  const [slotReplaceModalOpen, setSlotReplaceModalOpen] = useState<boolean>(false);
  const [pendingOutfitToSave, setPendingOutfitToSave] = useState<UserOutfit | null>(null);

  // Gemini AI Styling result states
  const [geminiResult, setGeminiResult] = useState<GeminiStylingResult | null>(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState<boolean>(false);

  // Gemini Image Generation states
  const [outfitImage, setOutfitImage] = useState<OutfitIllustrationResult | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  // Load saved outfits from local storage
  useEffect(() => {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (data) {
        setSavedOutfits(JSON.parse(data));
      }
    } catch {
      // ignore
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Resolved active objects
  const activeOccasion =
    OCCASIONS.find((o) => o.id === selectedOccasionId) || OCCASIONS[0];
  const activeGarment =
    GARMENTS.find((g) => g.id === selectedGarmentId) || GARMENTS[0];
  const activePalette =
    COLOR_PALETTES.find((p) => p.id === selectedPaletteId) || COLOR_PALETTES[0];
  const activeRemixStyle =
    REMIX_STYLES.find((s) => s.id === selectedRemixStyleId) || REMIX_STYLES[0];
  const activeAccessories = ACCESSORIES.filter((a) =>
    selectedAccessoryIds.includes(a.id)
  );

  // Toggle accessory
  const handleToggleAccessory = (id: string) => {
    setSelectedAccessoryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Randomize quick remix
  const handleRandomize = () => {
    const randomOccasion =
      OCCASIONS[Math.floor(Math.random() * OCCASIONS.length)];
    const randomGarment =
      GARMENTS[Math.floor(Math.random() * GARMENTS.length)];
    const randomPalette =
      COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)];
    const patterns: Array<'thuy-ba' | 'hoa-sen' | 'may-ngu-sac' | 'tron-toi-gian' | 'hoi-van'> = [
      'thuy-ba',
      'hoa-sen',
      'may-ngu-sac',
      'tron-toi-gian',
      'hoi-van',
    ];
    const randomPattern = patterns[Math.floor(Math.random() * patterns.length)];
    const randomStyle =
      REMIX_STYLES[Math.floor(Math.random() * REMIX_STYLES.length)];

    // pick 2 to 3 random accessories
    const shuffledAcc = [...ACCESSORIES].sort(() => 0.5 - Math.random());
    const randomAccessories = shuffledAcc.slice(0, 3).map((a) => a.id);

    setSelectedOccasionId(randomOccasion.id);
    setSelectedGarmentId(randomGarment.id);
    setSelectedPaletteId(randomPalette.id);
    setSelectedPattern(randomPattern);
    setSelectedRemixStyleId(randomStyle.id);
    setSelectedAccessoryIds(randomAccessories);
    setGeminiResult(null);
    setOutfitImage(null);

    showToast(`Đã mix ngẫu hứng: ${randomGarment.name} x ${randomStyle.name}`);
  };

  // Apply preset lookbook from Tab 2
  const handleApplyPreset = (preset: PresetLookbook) => {
    setSelectedGarmentId(preset.garmentId);
    setSelectedPaletteId(preset.colorPaletteId);
    setSelectedPattern(preset.patternType);
    setSelectedAccessoryIds(preset.accessories);
    setSelectedRemixStyleId(preset.remixStyleId);
    setGeminiResult(null);
    setOutfitImage(null);
    setCurrentTab('remix');
    setCurrentStep(3);
    showToast(`Đã nạp công thức: "${preset.title}" vào Studio`);
  };

  // Generate outfit illustration image using Gemini Image Model with automatic fallback
  const fetchOutfitIllustration = async (targetResult?: GeminiStylingResult) => {
    const stylingData = targetResult || geminiResult;
    setIsImageLoading(true);

    const fallbackUrl = generateVietPhucFallbackSvg({
      garmentId: activeGarment.id,
      garmentName: activeGarment.name,
      garmentEra: activeGarment.era,
      garmentRegion: activeGarment.region,
      outfitTitle: stylingData?.ten_bo_phoi || `${activeGarment.name} Remix`,
      primaryColor: activePalette.primary,
      secondaryColor: activePalette.secondary,
      accentColor: activePalette.accent,
      patternType: selectedPattern,
      occasionName: activeOccasion.name,
      accessories: activeAccessories.map((a) => a.name),
    });

    try {
      const response = await fetch('/api/gemini/generate-outfit-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          outfitJson: stylingData,
          garment: activeGarment,
          occasion: activeOccasion,
          palette: activePalette,
          pattern: selectedPattern,
          remixStyle: activeRemixStyle,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.imageUrl) {
          setOutfitImage({
            imageUrl: data.imageUrl,
            isFallback: false,
            prompt: data.prompt,
            modelUsed: data.modelUsed || 'gemini-3.1-flash-lite-image',
          });
          return;
        } else {
          const rawErr = String(data.error || '');
          const isQuota =
            rawErr.includes('429') ||
            rawErr.includes('RESOURCE_EXHAUSTED') ||
            rawErr.includes('quota') ||
            rawErr.includes('{');
          const cleanErr = isQuota
            ? 'Model tạo ảnh tạm hết lượt (Quota 429). Đang dùng bản phác thảo di sản dự phòng.'
            : (rawErr && !rawErr.includes('{') ? rawErr : 'Đang hiển thị bản phác thảo di sản dự phòng.');

          setOutfitImage({
            imageUrl: fallbackUrl,
            isFallback: true,
            error: cleanErr,
            prompt: data.prompt,
          });
          return;
        }
      } else {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (err: any) {
      console.warn('Lỗi gọi Gemini image model, chuyển sang ảnh dự phòng:', err);
      setOutfitImage({
        imageUrl: fallbackUrl,
        isFallback: true,
        error: 'Model tạo ảnh tạm hết lượt (Quota 429). Đang dùng bản phác thảo di sản dự phòng.',
      });
    } finally {
      setIsImageLoading(false);
    }
  };

  // Fetch Gemini recommendation
  const fetchGeminiSuggestion = async () => {
    setIsGeminiLoading(true);
    setIsCardModalOpen(true);
    try {
      const response = await fetch('/api/gemini/suggest-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion: activeOccasion,
          garment: activeGarment,
          palette: activePalette,
          pattern: selectedPattern,
          accessories: activeAccessories.map((a) => a.name),
          remixStyle: activeRemixStyle,
        }),
      });

      if (response.ok) {
        const data: GeminiStylingResult = await response.json();
        setGeminiResult(data);
        fetchOutfitIllustration(data);
      } else {
        throw new Error('API server error');
      }
    } catch (err) {
      console.warn('Lỗi gọi Gemini API, dùng bản phối dự phòng:', err);
      const fallbackCultural = checkCulturalIntegrity({
        occasion: activeOccasion,
        garment: activeGarment,
        palette: activePalette,
        pattern: selectedPattern,
        selectedAccessories: activeAccessories,
        remixStyle: activeRemixStyle,
      });

      const fallbackResult: GeminiStylingResult = {
        ten_bo_phoi: `${activeGarment.name} Remix ${activeRemixStyle.name}`,
        mo_ta: `Bản phối kết hợp hoàn hảo giữa nét cổ kính của ${activeGarment.name} và tinh thần phá cách của ${activeRemixStyle.name}. Sự chuyển tiếp sắc độ tinh tế cùng phụ kiện hiện đại tạo nên tổng thể tự tin và rạng rỡ.`,
        bang_mau_hex: [activePalette.primary, activePalette.secondary, activePalette.accent, '#18181B'],
        phu_kien: activeAccessories.length > 0 ? activeAccessories.map((a) => a.name) : activeGarment.traditionalAccessories.slice(0, 3),
        ly_do_hop_dip: `Bản phối đáp ứng trọn vẹn yêu cầu của dịp ${activeOccasion.name}, vừa giữ được nét trang nghiêm lại tạo cảm giác thoải mái khi di chuyển trong khuôn viên trường và chụp ảnh kỷ yếu.`,
        diem_hai_hoa_mau: 95,
        co_van_van_hoa: fallbackCultural,
      };

      setGeminiResult(fallbackResult);
      fetchOutfitIllustration(fallbackResult);
    } finally {
      setIsGeminiLoading(false);
    }
  };

  // Handle applying cultural replacement accessories suggested by Cultural Advisor
  const handleApplyCulturalReplacement = (replacementIds: string[]) => {
    setSelectedAccessoryIds((prev) => {
      // Remove culturally clashing items
      let cleaned = prev.filter((id) => {
        if (selectedGarmentId === 'ao-ba-ba') {
          return !['khan-vanh-day', 'tram-phuong-hoang', 'the-bai-ngoc-boi', 'non-quai-thao', 'khan-mo-qua'].includes(id);
        }
        if (selectedGarmentId === 'ao-tu-than') {
          return !['khan-vanh-day', 'khan-ran-nam-bo'].includes(id);
        }
        if (selectedGarmentId === 'ao-nhat-binh') {
          return !['khan-ran-nam-bo', 'non-quai-thao'].includes(id);
        }
        if (selectedGarmentId === 'ao-ngu-than') {
          return !['non-quai-thao'].includes(id);
        }
        return true;
      });

      for (const id of replacementIds) {
        if (!cleaned.includes(id)) {
          cleaned.push(id);
        }
      }
      return cleaned;
    });

    showToast('Đã áp dụng phụ kiện chuẩn truyền thống theo cố vấn văn hóa!');
    setGeminiResult(null);
    setTimeout(() => {
      fetchGeminiSuggestion();
    }, 150);
  };

  // Build current outfit object with illustration and cultural ratings
  const buildCurrentOutfitObject = (): UserOutfit => {
    const fallbackUrl = generateVietPhucFallbackSvg({
      garmentId: activeGarment.id,
      garmentName: activeGarment.name,
      garmentEra: activeGarment.era,
      garmentRegion: activeGarment.region,
      outfitTitle: geminiResult?.ten_bo_phoi || `${activeGarment.name} Remix ${activeRemixStyle.name}`,
      primaryColor: activePalette.primary,
      secondaryColor: activePalette.secondary,
      accentColor: activePalette.accent,
      patternType: selectedPattern,
      occasionName: activeOccasion.name,
      accessories: activeAccessories.map((a) => a.name),
    });

    const culturalCheck =
      geminiResult?.co_van_van_hoa ||
      checkCulturalIntegrity({
        occasion: activeOccasion,
        garment: activeGarment,
        palette: activePalette,
        pattern: selectedPattern,
        selectedAccessories: activeAccessories,
        remixStyle: activeRemixStyle,
      });

    return {
      id: `outfit-${Date.now()}`,
      occasionId: selectedOccasionId,
      garmentId: selectedGarmentId,
      colorPaletteId: selectedPaletteId,
      patternType: selectedPattern,
      selectedAccessories: selectedAccessoryIds,
      remixStyleId: selectedRemixStyleId,
      customName: geminiResult?.ten_bo_phoi || `${activeGarment.name} Remix ${activeRemixStyle.name}`,
      createdAt: new Date().toISOString(),
      imageUrl: outfitImage?.imageUrl || fallbackUrl,
      isFallbackImage: outfitImage?.isFallback ?? true,
      culturalScore: culturalCheck.diem_ton_trong_di_san,
      culturalWarning: culturalCheck.canh_bao_sai_lech,
      geminiResult: geminiResult || undefined,
    };
  };

  // Save outfit to local storage (max 3 outfits for side-by-side comparison & lookbook)
  const handleSaveOutfit = () => {
    const newOutfit = buildCurrentOutfitObject();

    // Check if already in saved outfits
    const alreadySaved = savedOutfits.some(
      (o) =>
        o.garmentId === newOutfit.garmentId &&
        o.colorPaletteId === newOutfit.colorPaletteId &&
        o.patternType === newOutfit.patternType &&
        o.remixStyleId === newOutfit.remixStyleId
    );

    if (alreadySaved) {
      showToast('Bản phối này đã có trong So Sánh!');
      return;
    }

    // Check maximum 3 outfits limit
    if (savedOutfits.length >= 3) {
      setPendingOutfitToSave(newOutfit);
      setSlotReplaceModalOpen(true);
      return;
    }

    const updated = [newOutfit, ...savedOutfits];
    setSavedOutfits(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast(`Đã lưu bản phối vào So Sánh (${updated.length}/3 slot)!`);
  };

  // Replace a specific slot (0, 1, or 2)
  const handleReplaceSlot = (slotIndex: number) => {
    if (!pendingOutfitToSave) return;
    const updated = [...savedOutfits];
    if (slotIndex < updated.length) {
      updated[slotIndex] = pendingOutfitToSave;
    } else {
      updated.push(pendingOutfitToSave);
    }
    setSavedOutfits(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    setSlotReplaceModalOpen(false);
    setPendingOutfitToSave(null);
    showToast(`Đã thay thế Slot 0${slotIndex + 1} thành bản phối mới!`);
  };

  // Save preset from lookbook into comparison slot
  const handleSavePresetToCompare = (preset: PresetLookbook) => {
    const garment = GARMENTS.find((g) => g.id === preset.garmentId) || activeGarment;
    const palette = COLOR_PALETTES.find((p) => p.id === preset.colorPaletteId) || activePalette;
    const occasion = OCCASIONS.find((o) => o.name === preset.occasionName) || activeOccasion;
    const remixStyle = REMIX_STYLES.find((s) => s.id === preset.remixStyleId) || activeRemixStyle;

    const fallbackUrl = generateVietPhucFallbackSvg({
      garmentId: garment.id,
      garmentName: garment.name,
      garmentEra: garment.era,
      garmentRegion: garment.region,
      outfitTitle: preset.title,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      accentColor: palette.accent,
      patternType: preset.patternType,
      occasionName: occasion.name,
      accessories: preset.accessories,
    });

    const presetOutfit: UserOutfit = {
      id: `preset-${preset.id}-${Date.now()}`,
      occasionId: occasion.id,
      garmentId: garment.id,
      colorPaletteId: palette.id,
      patternType: preset.patternType,
      selectedAccessories: preset.accessories,
      remixStyleId: remixStyle.id,
      customName: preset.title,
      createdAt: new Date().toISOString(),
      imageUrl: fallbackUrl,
      isFallbackImage: true,
      culturalScore: 95,
      culturalWarning: false,
    };

    if (savedOutfits.some((o) => o.customName === preset.title)) {
      showToast(`Bản phối "${preset.title}" đã có trong So Sánh!`);
      return;
    }

    if (savedOutfits.length >= 3) {
      setPendingOutfitToSave(presetOutfit);
      setSlotReplaceModalOpen(true);
      return;
    }

    const updated = [presetOutfit, ...savedOutfits];
    setSavedOutfits(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast(`Đã lưu "${preset.title}" vào So Sánh (${updated.length}/3)!`);
  };

  // Delete outfit
  const handleDeleteOutfit = (id: string) => {
    const updated = savedOutfits.filter((o) => o.id !== id);
    setSavedOutfits(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
    showToast('Đã xóa bản phối khỏi tủ đồ.');
  };

  // Load saved outfit
  const handleLoadSavedOutfit = (outfit: UserOutfit) => {
    setSelectedOccasionId(outfit.occasionId);
    setSelectedGarmentId(outfit.garmentId);
    setSelectedPaletteId(outfit.colorPaletteId);
    setSelectedPattern(outfit.patternType);
    setSelectedAccessoryIds(outfit.selectedAccessories);
    setSelectedRemixStyleId(outfit.remixStyleId);
    setCurrentTab('remix');
    setCurrentStep(3);
    showToast(`Đã mở bản phối "${outfit.customName}"`);
  };

  const isCurrentOutfitSaved = savedOutfits.some(
    (o) =>
      o.garmentId === selectedGarmentId &&
      o.colorPaletteId === selectedPaletteId &&
      o.patternType === selectedPattern &&
      o.remixStyleId === selectedRemixStyleId
  );

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-20 md:pb-12 flex flex-col justify-between">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedCount={savedOutfits.length}
        onOpenCardSummary={() => {
          if (!geminiResult) {
            fetchGeminiSuggestion();
          } else {
            setIsCardModalOpen(true);
          }
        }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1">
        {/* TAB 1: 3-STEP STUDIO */}
        {currentTab === 'remix' && (
          <div className="space-y-6">
            {/* Quick Hero Banner with Gen Z Heritage Vibe */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 bg-thuy-ba">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-rose-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                  <span>Việt Phục Remix Studio</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-500 font-normal">Dành riêng cho sinh viên Việt Nam</span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900">
                  Phối Cổ Phục Chuẩn Gu Gen Z Trong 3 Bước
                </h1>
                <p className="text-xs text-stone-600 max-w-xl">
                  Chọn dịp xuất hiện, chọn phom dáng triều đại, phối cùng sneaker, kính râm Y2K hoặc kiềng bạc để tạo dấu ấn kỷ yếu và giảng đường độc bản.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleRandomize}
                  className="h-10 px-3.5 rounded-xl border border-stone-300 bg-white/90 hover:bg-stone-100 text-stone-700 font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                >
                  <Dices className="w-4 h-4 text-rose-600" />
                  <span>Mix Ngẫu Hứng</span>
                </button>

                <button
                  onClick={() => {
                    if (!geminiResult) {
                      fetchGeminiSuggestion();
                    } else {
                      setIsCardModalOpen(true);
                    }
                  }}
                  className="h-10 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-700 hover:to-amber-700 text-white font-medium text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-rose-200" />
                  <span>Xem Thẻ Gợi Ý AI</span>
                </button>
              </div>
            </div>

            {/* Mobile visualizer toggle */}
            <div className="lg:hidden flex items-center justify-between p-2.5 rounded-xl bg-white border border-stone-200 text-xs">
              <span className="font-medium text-stone-700 flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-rose-600" />
                Mannequin Trực Quan ({activeGarment.name})
              </span>
              <button
                onClick={() => setShowMobileVisualizer(!showMobileVisualizer)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 px-2 py-1"
              >
                {showMobileVisualizer ? 'Thu gọn' : 'Mở xem'}
              </button>
            </div>

            {/* Desktop 2-column or mobile responsive grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column (8 cols): Step Progress & Form */}
              <div className="lg:col-span-8 space-y-6">
                {/* 3-Step Wizard Indicator */}
                <StepIndicator
                  currentStep={currentStep}
                  onSelectStep={setCurrentStep}
                  occasionName={activeOccasion.name}
                  garmentName={activeGarment.name}
                />

                {/* Step 1: Chọn dịp */}
                {currentStep === 1 && (
                  <Step1Occasion
                    selectedOccasionId={selectedOccasionId}
                    onSelectOccasion={(occ: Occasion) => {
                      setSelectedOccasionId(occ.id);
                      // Auto-suggest first recommended garment if current isn't in recommendation
                      if (!occ.recommendedGarments.includes(selectedGarmentId)) {
                        setSelectedGarmentId(occ.recommendedGarments[0]);
                      }
                    }}
                    onNextStep={() => setCurrentStep(2)}
                  />
                )}

                {/* Step 2: Chọn cổ phục */}
                {currentStep === 2 && (
                  <Step2Garment
                    selectedGarmentId={selectedGarmentId}
                    selectedOccasionId={selectedOccasionId}
                    onSelectGarment={(g: Garment) => setSelectedGarmentId(g.id)}
                    onPrevStep={() => setCurrentStep(1)}
                    onNextStep={() => setCurrentStep(3)}
                  />
                )}

                {/* Step 3: Remix màu, phụ kiện & phong cách */}
                {currentStep === 3 && (
                  <Step3Remix
                    selectedPaletteId={selectedPaletteId}
                    selectedPattern={selectedPattern}
                    selectedAccessoryIds={selectedAccessoryIds}
                    selectedRemixStyleId={selectedRemixStyleId}
                    activeGarment={activeGarment}
                    activeOccasion={activeOccasion}
                    onSelectPalette={(p: ColorPalette) => {
                      setSelectedPaletteId(p.id);
                      setGeminiResult(null);
                      setOutfitImage(null);
                    }}
                    onSelectPattern={(pat) => {
                      setSelectedPattern(pat);
                      setGeminiResult(null);
                      setOutfitImage(null);
                    }}
                    onToggleAccessory={(id) => {
                      handleToggleAccessory(id);
                      setGeminiResult(null);
                      setOutfitImage(null);
                    }}
                    onSelectRemixStyle={(s: RemixStyle) => {
                      setSelectedRemixStyleId(s.id);
                      setGeminiResult(null);
                      setOutfitImage(null);
                    }}
                    onPrevStep={() => setCurrentStep(2)}
                    onCompleteOutfit={fetchGeminiSuggestion}
                    onApplyCulturalReplacement={handleApplyCulturalReplacement}
                    isGeminiLoading={isGeminiLoading}
                  />
                )}
              </div>

              {/* Right Column (4 cols): Sticky Live Visualizer */}
              <div
                className={`lg:col-span-4 lg:sticky lg:top-20 space-y-4 ${
                  showMobileVisualizer ? 'block' : 'hidden lg:block'
                }`}
              >
                <OutfitVisualizer
                  garment={activeGarment}
                  palette={activePalette}
                  pattern={selectedPattern}
                  selectedAccessories={activeAccessories}
                  remixStyleName={activeRemixStyle.name}
                  onRandomize={handleRandomize}
                />

                {/* Live Quick Summary Pill Box below visualizer */}
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-800">Tóm Tắt Bản Phối</span>
                    <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold">
                      {activeOccasion.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 space-y-1">
                    <p>
                      <strong>Cổ phục:</strong> {activeGarment.name} ({activeGarment.dynasty})
                    </p>
                    <p>
                      <strong>Tone màu:</strong> {activePalette.name}
                    </p>
                    <p>
                      <strong>Phụ kiện:</strong> {activeAccessories.length} món remix đã chọn
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (!geminiResult) {
                        fetchGeminiSuggestion();
                      } else {
                        setIsCardModalOpen(true);
                      }
                    }}
                    className="w-full h-9 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                    <span>Mở Chi Tiết Thẻ Phối Đồ</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOOKBOOK SINH VIÊN */}
        {currentTab === 'lookbook' && (
          <LookbookView
            onApplyPreset={handleApplyPreset}
            onSavePresetToCompare={handleSavePresetToCompare}
          />
        )}

        {/* TAB 3: CẨM NANG & ĐỊA CHỈ THUÊ */}
        {currentTab === 'guide' && <GuideView />}

        {/* TAB 4: SO SÁNH & TỦ ĐỒ ĐÃ LƯU */}
        {currentTab === 'saved' && (
          <SavedOutfitsView
            savedOutfits={savedOutfits}
            onLoadOutfit={handleLoadSavedOutfit}
            onDeleteOutfit={handleDeleteOutfit}
            onGoToStudio={() => {
              setCurrentTab('remix');
              setCurrentStep(1);
            }}
            onAddCurrentStudioOutfit={handleSaveOutfit}
            canAddCurrentOutfit={!isCurrentOutfitSaved}
          />
        )}
      </main>

      {/* Outfit Card Lookbook Modal */}
      <OutfitCardModal
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        occasion={activeOccasion}
        garment={activeGarment}
        palette={activePalette}
        patternName={
          selectedPattern === 'thuy-ba'
            ? 'Thủy Ba (Sóng Nước)'
            : selectedPattern === 'hoa-sen'
            ? 'Liên Hoa (Cánh Sen)'
            : selectedPattern === 'may-ngu-sac'
            ? 'Mây Ngũ Sắc'
            : selectedPattern === 'hoi-van'
            ? 'Hồi Văn Cổ Điển'
            : 'Đũi Trơn Tối Giản'
        }
        patternKey={selectedPattern}
        accessories={activeAccessories}
        remixStyle={activeRemixStyle}
        onSaveOutfit={handleSaveOutfit}
        isAlreadySaved={isCurrentOutfitSaved}
        geminiResult={geminiResult}
        isGeminiLoading={isGeminiLoading}
        onRegenerateGemini={fetchGeminiSuggestion}
        onApplyCulturalReplacement={handleApplyCulturalReplacement}
        outfitImage={outfitImage}
        isImageLoading={isImageLoading}
        onRegenerateImage={() => fetchOutfitIllustration()}
        onGoToCompare={() => {
          setIsCardModalOpen(false);
          setCurrentTab('saved');
        }}
      />

      {/* Slot Limit Replaced Modal (Max 3 Outfits) */}
      {slotReplaceModalOpen && pendingOutfitToSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-stone-200 flex flex-col">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Columns3 className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-900">Tủ Đồ Đã Đầy (Tối Đa 3 Bộ)</h4>
                  <p className="text-[11px] text-stone-500">Giới hạn 3 slot để so sánh cạnh nhau & xuất Lookbook</p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSlotReplaceModalOpen(false);
                  setPendingOutfitToSave(null);
                }}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Bạn đang muốn lưu bản phối mới <strong>&quot;{pendingOutfitToSave.customName}&quot;</strong>. Hãy chọn 1 slot bạn muốn thay thế:
                </span>
              </div>

              <div className="space-y-2">
                {savedOutfits.map((saved, idx) => (
                  <div
                    key={saved.id}
                    className="p-3 rounded-xl border border-stone-200 hover:border-rose-300 transition-all flex items-center justify-between gap-3 bg-white"
                  >
                    <div className="truncate">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                        Slot 0{idx + 1}
                      </span>
                      <p className="text-xs font-bold text-stone-800 truncate mt-1">
                        {saved.customName || `Bản phối ${idx + 1}`}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        Lưu ngày {new Date(saved.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>

                    <button
                      onClick={() => handleReplaceSlot(idx)}
                      className="h-8 px-3 rounded-lg bg-stone-900 hover:bg-rose-600 text-white font-semibold text-xs shrink-0 transition-colors"
                    >
                      Thay thế
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between">
              <button
                onClick={() => {
                  setSlotReplaceModalOpen(false);
                  setPendingOutfitToSave(null);
                }}
                className="text-xs text-stone-500 hover:text-stone-800 font-medium"
              >
                Hủy bỏ
              </button>

              <button
                onClick={() => {
                  setSlotReplaceModalOpen(false);
                  setPendingOutfitToSave(null);
                  setCurrentTab('saved');
                }}
                className="text-xs text-rose-700 hover:underline font-semibold flex items-center gap-1"
              >
                <span>Xem Bảng So Sánh</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Thumb Navigation */}
      <BottomNavBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedCount={savedOutfits.length}
      />

      {/* Simple Footer */}
      <footer className="mt-12 py-6 border-t border-stone-200/80 text-center text-xs text-stone-500">
        <p>Việt phục Remix · Nền tảng phối cổ phục sáng tạo cho sinh viên Gen Z Việt Nam</p>
        <p className="text-[11px] text-stone-400 mt-1">
          Tôn vinh di sản Lý - Trần - Lê - Nguyễn qua lăng kính trẻ trung, văn minh và phá cách.
        </p>
      </footer>
    </div>
  );
}
