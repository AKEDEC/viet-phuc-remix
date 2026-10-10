/**
 * Fallback Image Generator for Việt Phục Remix
 * Generates high-fidelity SVG fashion poster data URIs for traditional garments
 * when the Gemini image generation model is loading, quota-exhausted, or encounters an error.
 */

export interface FallbackImageParams {
  garmentId: string;
  garmentName: string;
  garmentEra: string;
  garmentRegion: string;
  outfitTitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  patternType: string;
  occasionName: string;
  accessories: string[];
}

export function generateVietPhucFallbackSvg(params: FallbackImageParams): string {
  const {
    garmentId,
    garmentName,
    garmentEra,
    garmentRegion,
    outfitTitle,
    primaryColor,
    secondaryColor,
    accentColor,
    patternType,
    occasionName,
    accessories,
  } = params;

  // Garment specific silhouette SVG path
  let garmentSilhouette = '';
  let collarPath = '';
  let detailDecorations = '';

  if (garmentId === 'ao-dai') {
    // Elegant two-flap Áo Dài with high side slits and standing collar
    garmentSilhouette = `
      <!-- Head / Neck -->
      <circle cx="300" cy="210" r="32" fill="#FFE4D6" />
      <path d="M 270 210 Q 300 160 330 210 Q 300 180 270 210 Z" fill="#18181B" />
      <!-- Standing Collar (Cổ Lập Lĩnh) -->
      <path d="M 288 235 L 312 235 L 310 248 L 290 248 Z" fill="${accentColor}" stroke="#FFF" stroke-width="1.5" />
      <!-- Torso & Flaps (Tà áo trước) -->
      <path d="M 275 250 Q 250 280 260 360 Q 262 390 250 560 Q 300 580 350 560 Q 338 390 340 360 Q 350 280 325 250 Z" fill="${primaryColor}" />
      <!-- Side Slits & Inner silk pants (Quần lụa ống suông) -->
      <path d="M 268 420 L 260 620 L 290 620 L 295 440 Z" fill="#FFFFFF" opacity="0.95" />
      <path d="M 332 420 L 340 620 L 310 620 L 305 440 Z" fill="#FFFFFF" opacity="0.95" />
      <!-- Front Flap Flow (Tà bay) -->
      <path d="M 265 370 Q 290 480 280 570 Q 305 575 320 570 Q 310 480 335 370 Z" fill="${primaryColor}" opacity="0.9" />
      <!-- Sleeves (Tay áo ôm thanh thoát) -->
      <path d="M 275 250 L 205 340 L 220 350 L 270 290 Z" fill="${primaryColor}" />
      <path d="M 325 250 L 395 340 L 380 350 L 330 290 Z" fill="${primaryColor}" />
    `;
    collarPath = `<path d="M 292 248 Q 300 255 308 248" stroke="#FFE4D6" stroke-width="2" fill="none" />`;
  } else if (garmentId === 'ao-nhat-binh') {
    // Royal Áo Nhật Bình with distinct rectangular collar & five-color ribbons
    garmentSilhouette = `
      <!-- Head & Khăn Vành -->
      <ellipse cx="300" cy="205" rx="36" ry="32" fill="#D97706" />
      <circle cx="300" cy="210" r="28" fill="#FFE4D6" />
      <!-- Rectangular Collar (Cổ Chữ Nhật Ngũ Hành) -->
      <rect x="270" y="240" width="60" height="55" rx="4" fill="${secondaryColor}" stroke="${accentColor}" stroke-width="3" />
      <rect x="278" y="248" width="44" height="42" rx="2" fill="#1C1917" opacity="0.75" />
      <!-- Wide Royal Sleeves (Tay Thụng Cung Đình) -->
      <path d="M 270 245 L 170 330 L 175 420 L 255 370 Z" fill="${primaryColor}" />
      <path d="M 330 245 L 430 330 L 425 420 L 345 370 Z" fill="${primaryColor}" />
      <!-- Five color sleeve ribbons (Ngũ sắc viền tay) -->
      <rect x="170" y="385" width="20" height="7" fill="#EF4444" transform="rotate(35 170 385)" />
      <rect x="175" y="392" width="20" height="7" fill="#3B82F6" transform="rotate(35 175 392)" />
      <rect x="180" y="399" width="20" height="7" fill="#EAB308" transform="rotate(35 180 399)" />
      <rect x="410" y="385" width="20" height="7" fill="#EF4444" transform="rotate(-35 410 385)" />
      <rect x="405" y="392" width="20" height="7" fill="#3B82F6" transform="rotate(-35 405 392)" />
      <!-- Royal Long Robe -->
      <path d="M 260 295 L 230 580 Q 300 600 370 580 L 340 295 Z" fill="${primaryColor}" />
      <!-- Front center decorative band -->
      <rect x="294" y="295" width="12" height="285" fill="${accentColor}" />
    `;
  } else if (garmentId === 'ao-tu-than') {
    // Áo Tứ Thân Kinh Bắc with Yếm Đào and Nón Quai Thao
    garmentSilhouette = `
      <!-- Nón Quai Thao (Wide flat hat) -->
      <ellipse cx="300" cy="180" rx="90" ry="16" fill="#FDE68A" stroke="#B45309" stroke-width="2" />
      <path d="M 260 180 Q 280 230 270 260" stroke="#F43F5E" stroke-width="3" fill="none" />
      <path d="M 340 180 Q 320 230 330 260" stroke="#F43F5E" stroke-width="3" fill="none" />
      <!-- Head with Khăn Mỏ Quạ -->
      <path d="M 275 200 L 325 200 L 300 225 Z" fill="#18181B" />
      <circle cx="300" cy="215" r="24" fill="#FFE4D6" />
      <!-- Yếm Đào (Pink silk halter) inside -->
      <path d="M 285 240 L 315 240 L 320 330 L 280 330 Z" fill="#FB7185" />
      <!-- 4-Panel Coat Outer -->
      <path d="M 270 245 L 210 350 L 230 360 L 265 310 L 240 560 L 275 560 L 285 360 Z" fill="${primaryColor}" />
      <path d="M 330 245 L 390 350 L 370 360 L 335 310 L 360 560 L 325 560 L 315 360 Z" fill="${primaryColor}" />
      <!-- Dây lưng ruột tượng (Colorful silk belt tied at waist) -->
      <rect x="275" y="340" width="50" height="18" rx="4" fill="#F59E0B" />
      <path d="M 292 358 L 288 430 L 300 430 L 298 358 Z" fill="#F43F5E" />
      <path d="M 302 358 L 308 440 L 318 440 L 310 358 Z" fill="#10B981" />
      <!-- Black Silk Skirt (Váy đầm đen/nâu sồng) -->
      <path d="M 260 360 L 245 610 Q 300 625 355 610 L 340 360 Z" fill="#1C1917" />
    `;
  } else if (garmentId === 'ao-ngu-than') {
    // Áo Ngũ Thân scholarly standing collar robe
    garmentSilhouette = `
      <!-- Head with Khăn Đóng (Chữ Nhân) -->
      <ellipse cx="300" cy="195" rx="34" ry="18" fill="#1C1917" />
      <circle cx="300" cy="210" r="26" fill="#FFE4D6" />
      <!-- Standing Collar (Cổ Lập Lĩnh Chữ Khang) -->
      <path d="M 286 234 L 314 234 L 312 248 L 288 248 Z" fill="${secondaryColor}" stroke="${accentColor}" stroke-width="2" />
      <!-- 5-Panel Robe (5 khuy cài bên nách phải) -->
      <path d="M 272 250 L 200 340 L 220 355 L 270 295 L 245 580 Q 300 595 355 580 L 330 295 L 380 355 L 400 340 L 328 250 Z" fill="${primaryColor}" />
      <!-- Slanted buttons (5 cúc đồng chéo nách phải) -->
      <circle cx="304" cy="254" r="3.5" fill="#F59E0B" />
      <circle cx="314" cy="264" r="3.5" fill="#F59E0B" />
      <circle cx="322" cy="276" r="3.5" fill="#F59E0B" />
      <circle cx="328" cy="292" r="3.5" fill="#F59E0B" />
      <circle cx="330" cy="312" r="3.5" fill="#F59E0B" />
      <!-- White trousers underneath -->
      <path d="M 270 580 L 265 625 L 295 625 L 298 585 Z" fill="#FFFFFF" opacity="0.9" />
      <path d="M 330 580 L 335 625 L 305 625 L 302 585 Z" fill="#FFFFFF" opacity="0.9" />
    `;
  } else {
    // Áo Bà Ba Nam Bộ with Khăn Rằn
    garmentSilhouette = `
      <!-- Head with Nón Lá -->
      <path d="M 210 190 L 390 190 L 300 135 Z" fill="#FDE68A" stroke="#D97706" stroke-width="1.5" />
      <circle cx="300" cy="210" r="26" fill="#FFE4D6" />
      <!-- Khăn Rằn Nam Bộ (Black & white checkered scarf) draped on neck -->
      <path d="M 278 230 Q 300 260 285 360 L 270 360 Q 285 260 270 235 Z" fill="#E4E4E7" stroke="#18181B" stroke-dasharray="4,4" />
      <path d="M 322 230 Q 300 260 315 360 L 330 360 Q 315 260 330 235 Z" fill="#E4E4E7" stroke="#18181B" stroke-dasharray="4,4" />
      <!-- Áo Bà Ba blouse with round neck & 2 pockets -->
      <path d="M 270 240 Q 300 255 330 240 L 340 375 Q 300 380 260 375 Z" fill="${primaryColor}" />
      <!-- Raglan Sleeves -->
      <path d="M 270 240 L 210 320 L 225 330 L 270 280 Z" fill="${primaryColor}" />
      <path d="M 330 240 L 390 320 L 375 330 L 330 280 Z" fill="${primaryColor}" />
      <!-- Front buttons line -->
      <line x1="300" y1="250" x2="300" y2="370" stroke="#FFF" stroke-width="1.5" stroke-dasharray="3,6" />
      <!-- Two small pockets -->
      <rect x="272" y="335" width="20" height="22" rx="2" fill="${secondaryColor}" opacity="0.8" />
      <rect x="308" y="335" width="20" height="22" rx="2" fill="${secondaryColor}" opacity="0.8" />
      <!-- Black flowing silk trousers -->
      <path d="M 265 375 L 250 620 L 290 620 L 298 380 Z" fill="#18181B" />
      <path d="M 335 375 L 350 620 L 310 620 L 302 380 Z" fill="#18181B" />
    `;
  }

  // Decorative pattern backdrop
  if (patternType === 'thuy-ba') {
    detailDecorations = `
      <!-- Wave Motifs (Thủy Ba) -->
      <path d="M 0 740 Q 75 700 150 740 T 300 740 T 450 740 T 600 740 L 600 800 L 0 800 Z" fill="${accentColor}" opacity="0.25" />
      <path d="M 0 760 Q 75 725 150 760 T 300 760 T 450 760 T 600 760 L 600 800 L 0 800 Z" fill="${primaryColor}" opacity="0.35" />
    `;
  } else if (patternType === 'hoa-sen') {
    detailDecorations = `
      <!-- Lotus Petals (Liên Hoa) -->
      <circle cx="300" cy="740" r="45" fill="${accentColor}" opacity="0.2" />
      <path d="M 260 740 Q 300 680 340 740 Z" fill="${secondaryColor}" opacity="0.3" />
    `;
  } else {
    detailDecorations = `
      <!-- Geometric Hồi Văn or Clouds -->
      <rect x="40" y="40" width="520" height="720" rx="16" fill="none" stroke="${accentColor}" stroke-width="1" stroke-dasharray="8,6" opacity="0.4" />
    `;
  }

  const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="600" height="800">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181B" />
      <stop offset="45%" stop-color="#27272A" />
      <stop offset="100%" stop-color="${primaryColor}" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#F59E0B" />
      <stop offset="50%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <radialGradient id="auraGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#18181B" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="600" height="800" fill="url(#bgGrad)" />

  <!-- Aura Glow behind figure -->
  <circle cx="300" cy="380" r="220" fill="url(#auraGlow)" />

  <!-- Outer Architectural Framing -->
  <rect x="20" y="20" width="560" height="760" rx="20" fill="none" stroke="#FFFFFF" stroke-width="1.5" opacity="0.2" />
  <rect x="28" y="28" width="544" height="744" rx="16" fill="none" stroke="url(#goldGrad)" stroke-width="1" opacity="0.6" />

  <!-- Header Section -->
  <text x="50" y="65" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="3" fill="#FCD34D">VIỆT PHỤC REMIX · GEN Z HERITAGE</text>
  <text x="50" y="85" font-family="'Be Vietnam Pro', system-ui, sans-serif" font-size="13" font-weight="500" fill="#E4E4E7">${occasionName} · ${garmentRegion}</text>

  <rect x="440" y="50" width="110" height="26" rx="13" fill="#FFFFFF" fill-opacity="0.12" />
  <text x="495" y="67" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="10" font-weight="700" fill="#FFFFFF">BẢN PHÁC THẢO</text>

  <!-- Decorative Pattern Elements -->
  ${detailDecorations}

  <!-- Center Garment Silhouette -->
  <g id="figure-group" transform="translate(0, 0)">
    ${garmentSilhouette}
    ${collarPath}
  </g>

  <!-- Title & Metadata Footer Banner -->
  <rect x="35" y="660" width="530" height="100" rx="16" fill="#09090B" fill-opacity="0.75" stroke="#3F3F46" stroke-width="1" />

  <!-- Color Palette Dots in Card -->
  <circle cx="65" cy="690" r="10" fill="${primaryColor}" stroke="#FFF" stroke-width="1.5" />
  <circle cx="92" cy="690" r="10" fill="${secondaryColor}" stroke="#FFF" stroke-width="1.5" />
  <circle cx="119" cy="690" r="10" fill="${accentColor}" stroke="#FFF" stroke-width="1.5" />

  <!-- Outfit Title -->
  <text x="145" y="694" font-family="'Be Vietnam Pro', system-ui, sans-serif" font-size="18" font-weight="800" fill="#FFFFFF">${outfitTitle.replace(/["']/g, '')}</text>
  <text x="65" y="725" font-family="'Be Vietnam Pro', system-ui, sans-serif" font-size="12" font-weight="500" fill="#A1A1AA">Cổ phục: ${garmentName} (${garmentEra})</text>
  <text x="65" y="744" font-family="'Be Vietnam Pro', system-ui, sans-serif" font-size="11" font-weight="400" fill="#71717A">Phụ kiện: ${accessories.slice(0, 3).join(' · ') || 'Truyền thống kết hợp hiện đại'}</text>

  <!-- Stamp Watermark Badge -->
  <circle cx="510" cy="710" r="28" fill="none" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="3,3" />
  <text x="510" y="707" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" font-weight="800" fill="#FCD34D">GEMINI</text>
  <text x="510" y="718" text-anchor="middle" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="7.5" font-weight="600" fill="#E4E4E7">EDITION</text>
</svg>
`.trim();

  // Robust UTF-8 Base64 Data URI encoding supported universally across all browsers and Canvas
  try {
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
      const bytes = new TextEncoder().encode(svgContent);
      let binary = '';
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return `data:image/svg+xml;base64,${window.btoa(binary)}`;
    }
  } catch {
    // fallback to charset-encoded URI
  }

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}
