export type StepNumber = 1 | 2 | 3;

export type TabType = 'remix' | 'lookbook' | 'guide' | 'saved';

export interface Occasion {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  badge: string;
  vibe: string;
  suitabilityNote: string;
  recommendedGarments: string[];
}

export interface Garment {
  id: string;
  name: string;
  alias: string;
  region: string; // Vùng miền (e.g., Bắc Bộ, Nam Bộ, Miền Trung, Toàn quốc)
  era: string; // Thời kỳ (e.g., Thế kỷ XVIII - nay, Triều Nguyễn 1807-1945)
  dynasty: string;
  century: string;
  description: string;
  originAndMeaning: string; // 2-3 câu về nguồn gốc/ý nghĩa
  suitableOccasions: string[]; // Dịp phù hợp
  traditionalAccessories: string[]; // Phụ kiện đi kèm đúng truyền thống
  historyHighlight: string;
  silhouette: string;
  structureNote: string;
  culturalNote: string;
  comfortScore: number; // 1-5
  versatilityScore: number; // 1-5
  defaultColorHex: string;
  accentColorHex: string;
  tags: string[];
}

export interface ColorPalette {
  id: string;
  name: string;
  traditionalName: string;
  primary: string;
  secondary: string;
  accent: string;
  vibeDescription: string;
  bestFor: string;
}

export interface AccessoryItem {
  id: string;
  category: 'head' | 'footwear' | 'layer' | 'handheld' | 'jewelry';
  name: string;
  remixType: 'traditional' | 'modern' | 'streetwear';
  description: string;
  iconName: string;
  studentTip: string;
}

export interface RemixStyle {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  studentBudget: string;
  keyRule: string;
}

export interface UserOutfit {
  id: string;
  occasionId: string;
  garmentId: string;
  colorPaletteId: string;
  patternType: 'thuy-ba' | 'hoa-sen' | 'may-ngu-sac' | 'tron-toi-gian' | 'hoi-van';
  selectedAccessories: string[];
  remixStyleId: string;
  customName?: string;
  createdAt: string;
  imageUrl?: string;
  isFallbackImage?: boolean;
  culturalScore?: number;
  culturalWarning?: boolean;
  geminiResult?: GeminiStylingResult;
}

export interface PresetLookbook {
  id: string;
  title: string;
  studentPersona: string;
  occasionName: string;
  garmentName: string;
  garmentId: string;
  colorPaletteId: string;
  patternType: 'thuy-ba' | 'hoa-sen' | 'may-ngu-sac' | 'tron-toi-gian' | 'hoi-van';
  accessories: string[];
  remixStyleId: string;
  description: string;
  highlightItems: string[];
  likes: number;
}

export interface CulturalAdvisorResult {
  canh_bao_sai_lech: boolean; // Có làm sai lệch đặc trưng văn hóa không
  tieu_de_canh_bao: string; // Tiêu đề cảnh báo (hoặc "Chuẩn mực văn hóa & cách tân hài hòa")
  giai_thich_ngan: string; // Giải thích ngắn về nguồn gốc, quy định truyền thống và lý do
  goi_y_thay_the: string; // Gợi ý phụ kiện hoặc cách phối thay thế tôn trọng truyền thống hơn
  phu_kien_thay_the_ids?: string[]; // IDs các phụ kiện chuẩn truyền thống để thay thế
  diem_ton_trong_di_san: number; // 0 - 100
}

export interface OutfitIllustrationResult {
  imageUrl: string;
  isFallback: boolean;
  prompt?: string;
  modelUsed?: string;
  error?: string;
}

export interface GeminiStylingResult {
  ten_bo_phoi: string;
  mo_ta: string;
  bang_mau_hex: string[];
  phu_kien: string[];
  ly_do_hop_dip: string;
  diem_hai_hoa_mau: number;
  co_van_van_hoa?: CulturalAdvisorResult;
  illustration?: OutfitIllustrationResult;
}

