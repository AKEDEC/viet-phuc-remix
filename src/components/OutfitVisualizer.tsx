import React, { useState } from 'react';
import { Garment, ColorPalette, AccessoryItem } from '../types';
import { Wind, Image, Sparkles, RefreshCw } from 'lucide-react';

interface OutfitVisualizerProps {
  garment: Garment;
  palette: ColorPalette;
  pattern: 'thuy-ba' | 'hoa-sen' | 'may-ngu-sac' | 'tron-toi-gian' | 'hoi-van';
  selectedAccessories: AccessoryItem[];
  remixStyleName: string;
  onRandomize?: () => void;
}

export const OutfitVisualizer: React.FC<OutfitVisualizerProps> = ({
  garment,
  palette,
  pattern,
  selectedAccessories,
  remixStyleName,
  onRandomize,
}) => {
  const [backdrop, setBackdrop] = useState<'hoang-thanh' | 'giang-duong' | 'hoi-an' | 'cafe'>('giang-duong');
  const [isBreezeActive, setIsBreezeActive] = useState<boolean>(true);

  // Check specific accessories
  const hasKhanDong = selectedAccessories.some((a) => a.id === 'khan-dong');
  const hasKhanVanhDay = selectedAccessories.some((a) => a.id === 'khan-vanh-day');
  const hasManNguSac = selectedAccessories.some((a) => a.id === 'man-ngu-sac');
  const hasNonLa = selectedAccessories.some((a) => a.id === 'non-la-mini');
  const hasNonQuaiThao = selectedAccessories.some((a) => a.id === 'non-quai-thao');
  const hasKhanMoQua = selectedAccessories.some((a) => a.id === 'khan-mo-qua');
  const hasBeret = selectedAccessories.some((a) => a.id === 'mu-beret');
  const hasKinhRam = selectedAccessories.some((a) => a.id === 'kinh-ram-y2k');
  const hasKiengBac = selectedAccessories.some((a) => a.id === 'kieng-bac');
  const hasTramPhuongHoang = selectedAccessories.some((a) => a.id === 'tram-phuong-hoang');
  const hasTheBaiNgocBoi = selectedAccessories.some((a) => a.id === 'the-bai-ngoc-boi');
  const hasQuatDo = selectedAccessories.some((a) => a.id === 'quat-giay-do');
  const hasTote = selectedAccessories.some((a) => a.id === 'tote-thuy-ba');
  const hasKhanRan = selectedAccessories.some((a) => a.id === 'khan-ran-nam-bo');
  const hasYemDao = selectedAccessories.some((a) => a.id === 'yem-dao');
  const hasRuotTuong = selectedAccessories.some((a) => a.id === 'ruot-tuong');

  // Bottom wear
  const hasJeans = selectedAccessories.some((a) => a.id === 'quan-jeans-suong');
  const hasChanVay = selectedAccessories.some((a) => a.id === 'chan-vay-midi');
  const hasCroptop = selectedAccessories.some((a) => a.id === 'croptop-inner');

  // Footwear
  const hasSneaker = selectedAccessories.some((a) => a.id === 'chunky-sneaker');
  const hasMaryJane = selectedAccessories.some((a) => a.id === 'mary-jane');
  const hasGuocMoc = selectedAccessories.some((a) => a.id === 'guoc-moc');
  const hasBoots = selectedAccessories.some((a) => a.id === 'chelsea-boots');

  const getBackdropStyles = () => {
    switch (backdrop) {
      case 'hoang-thanh':
        return {
          bg: 'bg-gradient-to-b from-amber-100/90 via-stone-100 to-rose-100/70',
          title: 'Hoàng Thành Thăng Long',
          accent: '#B45309',
        };
      case 'hoi-an':
        return {
          bg: 'bg-gradient-to-b from-amber-200/80 via-yellow-100/60 to-orange-100/70',
          title: 'Phố Cổ Hội An',
          accent: '#D97706',
        };
      case 'cafe':
        return {
          bg: 'bg-gradient-to-b from-stone-200 via-stone-100 to-amber-50',
          title: 'Quán Cafe Indie Gen Z',
          accent: '#78350F',
        };
      default:
        return {
          bg: 'bg-gradient-to-b from-sky-100/70 via-stone-50 to-emerald-50/60',
          title: 'Giảng Đường Đại Học',
          accent: '#0369A1',
        };
    }
  };

  const backdropInfo = getBackdropStyles();

  return (
    <div className="w-full bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between overflow-hidden relative">
      {/* Visualizer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-sm font-bold text-stone-900">Mannequin Trực Quan</h3>
          </div>
          <p className="text-[11px] text-stone-400">
            {garment.name} · {palette.name}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {onRandomize && (
            <button
              onClick={onRandomize}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Phối ngẫu hứng"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsBreezeActive(!isBreezeActive)}
            className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1 ${
              isBreezeActive ? 'bg-rose-50 text-rose-700' : 'text-stone-400 hover:bg-stone-100'
            }`}
            title="Hiệu ứng gió bay tà áo"
          >
            <Wind className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Gió bay tà</span>
          </button>
        </div>
      </div>

      {/* Main Avatar Stage */}
      <div
        className={`w-full h-84 sm:h-96 rounded-xl relative flex items-center justify-center overflow-hidden border border-stone-200/60 transition-colors ${backdropInfo.bg}`}
      >
        {/* Decorative architectural background silhouette */}
        <div className="absolute inset-0 pointer-events-none opacity-20 flex items-end justify-between px-4 pb-2">
          {/* Ancient Roof curve / campus arch */}
          <svg className="w-full h-full" viewBox="0 0 300 240" fill="none" preserveAspectRatio="none">
            {backdrop === 'hoang-thanh' && (
              <path
                d="M10,180 Q80,140 150,140 Q220,140 290,180 L290,240 L10,240 Z"
                fill="#991B1B"
              />
            )}
            {backdrop === 'hoi-an' && (
              <path
                d="M20,160 L140,110 L260,160 L260,240 L20,240 Z"
                fill="#D97706"
              />
            )}
            {backdrop === 'giang-duong' && (
              <path
                d="M30,170 H270 V240 H30 Z M70,170 Q150,90 230,170"
                fill="#1E293B"
              />
            )}
            {backdrop === 'cafe' && (
              <path
                d="M50,150 L250,150 L240,240 L60,240 Z"
                fill="#78350F"
              />
            )}
          </svg>
        </div>

        {/* Dynamic Stylized SVG Character with Garment & Accessories */}
        <div className={`relative z-10 w-52 sm:w-60 h-80 flex items-center justify-center ${isBreezeActive ? 'animate-pulse' : ''}`}>
          <svg
            viewBox="0 0 240 320"
            className="w-full h-full drop-shadow-md select-none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="fabricGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={palette.primary} />
                <stop offset="100%" stopColor={palette.accent} />
              </linearGradient>
              <linearGradient id="silkPantsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={palette.secondary} />
                <stop offset="100%" stopColor="#FFFFFF" />
              </linearGradient>
              <linearGradient id="nhatBinhStripe" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DC2626" />
                <stop offset="25%" stopColor="#F59E0B" />
                <stop offset="50%" stopColor="#10B981" />
                <stop offset="75%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>

            {/* --- 1. SHADOW ON FLOOR --- */}
            <ellipse cx="120" cy="305" rx="45" ry="7" fill="rgba(0,0,0,0.12)" />

            {/* --- 2. LEGS & LOWER LAYER (Pants / Skirt) --- */}
            {hasJeans ? (
              // Remix: Blue denim wide-leg jeans
              <g id="jeans">
                <path d="M96,190 L92,278 L112,278 L116,210 L124,210 L128,278 L148,278 L144,190 Z" fill="#3B82F6" />
                {/* Denim seam lines */}
                <path d="M120,200 L120,275" stroke="#1D4ED8" strokeWidth="1" strokeDasharray="3 2" />
                {/* Rolled cuffs */}
                <rect x="91" y="272" width="22" height="7" rx="1.5" fill="#93C5FD" />
                <rect x="127" y="272" width="22" height="7" rx="1.5" fill="#93C5FD" />
              </g>
            ) : hasChanVay ? (
              // Remix: Pleated midi skirt (Chân váy xếp ly)
              <g id="skirt">
                <path d="M98,185 L80,270 L160,270 L142,185 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
                {/* Pleats */}
                {[90, 100, 110, 120, 130, 140, 150].map((x, i) => (
                  <line key={i} x1={x} y1="186" x2={x + (x - 120) * 0.3} y2="270" stroke="#CBD5E1" strokeWidth="1" />
                ))}
                {/* Bare lower calves */}
                <rect x="105" y="270" width="8" height="15" rx="3" fill="#FBD5BD" />
                <rect x="127" y="270" width="8" height="15" rx="3" fill="#FBD5BD" />
              </g>
            ) : (
              // Traditional silk trousers (Quần lụa ống rộng)
              <g id="silk-trousers">
                <path
                  d="M97,185 L88,280 L115,280 L118,205 L122,205 L125,280 L152,280 L143,185 Z"
                  fill="url(#silkPantsGradient)"
                  stroke="#E2E8F0"
                  strokeWidth="0.8"
                />
              </g>
            )}

            {/* --- 3. FOOTWEAR --- */}
            {hasSneaker ? (
              // Chunky Sneaker
              <g id="sneakers">
                {/* Left sneaker */}
                <path d="M88,277 C88,274 100,274 114,277 L116,288 C116,290 86,291 86,288 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
                <rect x="85" y="284" width="32" height="5" rx="2" fill="#E2E8F0" />
                {/* Right sneaker */}
                <path d="M125,277 C125,274 139,274 153,277 L155,288 C155,290 123,291 123,288 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="1" />
                <rect x="123" y="284" width="33" height="5" rx="2" fill="#E2E8F0" />
              </g>
            ) : hasMaryJane ? (
              // Mary Jane shoes with socks
              <g id="mary-jane">
                <rect x="102" y="275" width="12" height="9" fill="#FFFFFF" />
                <rect x="126" y="275" width="12" height="9" fill="#FFFFFF" />
                <path d="M100,283 Q108,280 116,283 L116,290 Q108,291 100,290 Z" fill="#18181B" />
                <line x1="102" y1="285" x2="114" y2="285" stroke="#FFFFFF" strokeWidth="1" />
                <path d="M124,283 Q132,280 140,283 L140,290 Q132,291 124,290 Z" fill="#18181B" />
                <line x1="126" y1="285" x2="138" y2="285" stroke="#FFFFFF" strokeWidth="1" />
              </g>
            ) : hasGuocMoc ? (
              // Wooden clogs (Guốc mộc)
              <g id="guoc-moc">
                {/* Left clog */}
                <path d="M102,284 L116,284 L116,290 L102,290 Z" fill="#78350F" />
                <path d="M103,281 Q109,277 115,281" stroke="#BE123C" strokeWidth="2.5" fill="none" />
                {/* Right clog */}
                <path d="M124,284 L138,284 L138,290 L124,290 Z" fill="#78350F" />
                <path d="M125,281 Q131,277 137,281" stroke="#BE123C" strokeWidth="2.5" fill="none" />
              </g>
            ) : hasBoots ? (
              // Chelsea boots
              <g id="boots">
                <path d="M98,272 L114,272 L116,290 L96,290 Z" fill="#1E293B" />
                <path d="M126,272 L142,272 L144,290 L124,290 Z" fill="#1E293B" />
              </g>
            ) : (
              // Default clean footwear
              <g id="default-shoes">
                <ellipse cx="108" cy="285" rx="8" ry="4" fill="#334155" />
                <ellipse cx="132" cy="285" rx="8" ry="4" fill="#334155" />
              </g>
            )}

            {/* --- 4. INNER LAYER (If croptop / open robe) --- */}
            {hasCroptop && (
              <rect x="105" y="105" width="30" height="25" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
            )}

            {/* --- 5. MAIN TRADITIONAL ROBE (Based on 5 Garment Types) --- */}
            {garment.id === 'ao-dai' ? (
              // 1. ÁO DÀI: Tà dài thướt tha, cổ đứng lập lĩnh, ôm dáng thanh tao
              <g id="garment-ao-dai">
                {/* Sleeves */}
                <path d="M82,95 L62,148 L76,150 L92,112 Z" fill="url(#fabricGradient)" />
                <path d="M158,95 L178,148 L164,150 L148,112 Z" fill="url(#fabricGradient)" />

                {/* Long Flowing Tunic Panels */}
                <path
                  d="M89,90 Q120,86 151,90 L160,248 Q120,252 80,248 Z"
                  fill="url(#fabricGradient)"
                  stroke={palette.primary}
                  strokeWidth="1"
                />

                {/* High Upright Collar (Cổ đứng lập lĩnh) */}
                <path d="M107,84 Q120,80 133,84 L133,92 Q120,88 107,92 Z" fill={palette.accent} />

                {/* Side button row & subtle waist curve */}
                <path d="M120,91 Q134,98 136,135" fill="none" stroke={palette.accent} strokeWidth="1.2" strokeDasharray="3 2" />
                <circle cx="128" cy="94" r="1.8" fill="#FBBF24" />
                <circle cx="134" cy="104" r="1.8" fill="#FBBF24" />
                <circle cx="136" cy="116" r="1.8" fill="#FBBF24" />
              </g>
            ) : garment.id === 'ao-tu-than' ? (
              // 2. ÁO TỨ THÂN: 2 vạt sau khâu liền, 2 vạt trước buộc chéo trước bụng, lộ yếm đào
              <g id="garment-ao-tu-than">
                {/* Sleeves */}
                <path d="M80,95 L50,146 L70,150 L90,115 Z" fill="url(#fabricGradient)" />
                <path d="M160,95 L190,146 L170,150 L150,115 Z" fill="url(#fabricGradient)" />

                {/* Back Robe Panel */}
                <path d="M86,92 L78,245 L162,245 L154,92 Z" fill="url(#fabricGradient)" opacity="0.9" />
                {/* Sống áo giữa lưng */}
                <line x1="120" y1="92" x2="120" y2="245" stroke={palette.accent} strokeWidth="0.8" opacity="0.6" />

                {/* Lớp Áo Yếm Đào bên trong */}
                <path d="M108,94 Q120,105 132,94 L138,140 Q120,146 102,140 Z" fill="#F43F5E" stroke="#BE123C" strokeWidth="0.8" />
                {/* Cổ yếm / dây buộc yếm */}
                <path d="M112,85 L120,96 L128,85" stroke="#F43F5E" strokeWidth="1.5" fill="none" />

                {/* 2 Vạt trước buộc thắt múi chữ V trước bụng */}
                <path d="M86,92 L106,145 L120,148 L104,200 L95,190 L98,140 Z" fill="url(#fabricGradient)" stroke={palette.accent} strokeWidth="0.8" />
                <path d="M154,92 L134,145 L120,148 L136,200 L145,190 L142,140 Z" fill="url(#fabricGradient)" stroke={palette.accent} strokeWidth="0.8" />

                {/* Dây lưng Ruột Tượng buộc ngang eo buông thả */}
                <rect x="96" y="142" width="48" height="7" rx="1.5" fill="#EC4899" />
                <path d="M116,149 L114,195 L122,195 L124,149 Z" fill="#F472B6" />
                <path d="M122,149 L126,188 L132,188 L128,149 Z" fill="#34D399" />
              </g>
            ) : garment.id === 'ao-ba-ba' ? (
              // 3. ÁO BÀ BA: Áo cánh ngắn chít eo ngang hông, xẻ tà 2 bên, cổ tròn, 2 túi trước
              <g id="garment-ao-ba-ba">
                {/* 3/4 Sleeves */}
                <path d="M82,95 L64,142 L78,144 L92,112 Z" fill="url(#fabricGradient)" />
                <path d="M158,95 L176,142 L162,144 L148,112 Z" fill="url(#fabricGradient)" />

                {/* Short Tunic Ending at Hips */}
                <path
                  d="M89,90 Q120,86 151,90 L156,178 Q140,183 120,180 Q100,183 84,178 Z"
                  fill="url(#fabricGradient)"
                  stroke={palette.primary}
                  strokeWidth="1"
                />

                {/* Round Neckline (Cổ tròn không bâu) */}
                <path d="M108,86 Q120,96 132,86" stroke={palette.accent} strokeWidth="2.5" fill="none" />

                {/* Central Button Row down center front */}
                <line x1="120" y1="96" x2="120" y2="178" stroke={palette.accent} strokeWidth="1.2" />
                {[104, 118, 132, 146, 160].map((y, i) => (
                  <circle key={i} cx="120" cy={y} r="1.6" fill="#F8FAFC" stroke="#64748B" strokeWidth="0.5" />
                ))}

                {/* Two Front Patch Pockets (2 túi vuông vạt trước) */}
                <rect x="94" y="152" width="16" height="15" rx="1.5" fill="none" stroke={palette.accent} strokeWidth="1" />
                <rect x="130" y="152" width="16" height="15" rx="1.5" fill="none" stroke={palette.accent} strokeWidth="1" />

                {/* Side slit curves at hips */}
                <path d="M84,168 L88,178" stroke={palette.accent} strokeWidth="1.5" />
                <path d="M156,168 L152,178" stroke={palette.accent} strokeWidth="1.5" />
              </g>
            ) : garment.id === 'ao-nhat-binh' ? (
              // 4. ÁO NHẬT BÌNH: Cổ chữ nhật phẳng, dải ngũ sắc ngũ hành ở cổ và cửa tay
              <g id="garment-ao-nhat-binh">
                {/* Sleeves with rainbow bands at cuffs */}
                <path d="M78,95 L48,150 L75,155 L90,118 Z" fill="url(#fabricGradient)" />
                <rect x="48" y="145" width="27" height="7" fill="url(#nhatBinhStripe)" rx="1" />
                <path d="M162,95 L192,150 L165,155 L150,118 Z" fill="url(#fabricGradient)" />
                <rect x="165" y="145" width="27" height="7" fill="url(#nhatBinhStripe)" rx="1" />

                {/* Main Robe */}
                <path
                  d="M86,90 Q120,86 154,90 L160,225 Q120,228 80,225 Z"
                  fill="url(#fabricGradient)"
                  stroke={palette.primary}
                  strokeWidth="1"
                />

                {/* Rectangular flat neckband (Cổ chữ nhật) */}
                <rect x="105" y="85" width="30" height="35" rx="1" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="1.5" />
                <rect x="108" y="88" width="24" height="29" fill="url(#nhatBinhStripe)" opacity="0.85" />
                <circle cx="120" cy="125" r="3" fill="#D97706" />
                {/* Hanging cords */}
                <line x1="118" y1="128" x2="114" y2="155" stroke="#BE123C" strokeWidth="1.5" />
                <line x1="122" y1="128" x2="126" y2="155" stroke="#BE123C" strokeWidth="1.5" />
              </g>
            ) : (
              // 5. ÁO NGŨ THÂN (Default): 5 thân áo, cổ đứng, nẹp 5 cúc bên phải
              <g id="garment-ngu-than">
                {/* Fitted / Wide sleeves */}
                <path d="M80,95 L56,150 L74,154 L90,116 Z" fill="url(#fabricGradient)" />
                <path d="M160,95 L184,150 L166,154 L150,116 Z" fill="url(#fabricGradient)" />

                {/* Main 5-panel Tunic */}
                <path
                  d="M86,90 Q120,86 154,90 L160,230 Q120,234 80,230 Z"
                  fill="url(#fabricGradient)"
                  stroke={palette.primary}
                  strokeWidth="1"
                />

                {/* Upright collar (Cổ đứng lập lĩnh) */}
                <path d="M107,85 Q120,81 133,85 L133,93 Q120,89 107,93 Z" fill={palette.accent} />

                {/* 5 buttons (Ngũ cúc) cài nẹp hữu bên phải */}
                <path d="M124,93 Q134,102 135,145" fill="none" stroke={palette.accent} strokeWidth="1.2" />
                {[95, 106, 117, 128, 139].map((y, i) => (
                  <circle key={i} cx="132" cy={y} r="1.8" fill="#FBBF24" stroke="#78350F" strokeWidth="0.4" />
                ))}
              </g>
            )}

            {/* --- 6. PATTERN MOTIF ON TUNIC HEM --- */}
            {pattern === 'thuy-ba' && (
              // Thủy ba wave pattern
              <g id="thuy-ba-motif" opacity="0.75">
                <path
                  d="M80,210 Q90,203 100,210 Q110,217 120,210 Q130,203 140,210 Q150,217 160,210"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  fill="none"
                />
                <path
                  d="M82,217 Q92,210 102,217 Q112,224 122,217 Q132,210 142,217 Q152,224 162,217"
                  stroke={palette.accent}
                  strokeWidth="1.5"
                  fill="none"
                />
              </g>
            )}

            {pattern === 'hoa-sen' && (
              // Lotus flower motif at chest/hip
              <g id="lotus-motif" transform="translate(112, 175) scale(0.7)" opacity="0.85">
                <path d="M12,0 C7,-8 0,-15 12,-22 C24,-15 17,-8 12,0 Z" fill="#FDA4AF" />
                <path d="M5,-2 C-2,-8 -3,-14 4,-18 C11,-14 9,-7 5,-2 Z" fill="#F43F5E" />
                <path d="M19,-2 C26,-8 27,-14 20,-18 C13,-14 15,-7 19,-2 Z" fill="#F43F5E" />
              </g>
            )}

            {pattern === 'may-ngu-sac' && (
              // Auspicious cloud swirls
              <g id="cloud-motif" opacity="0.7">
                <path
                  d="M95,195 Q102,188 110,195 Q115,190 122,193"
                  stroke="#FEF08A"
                  strokeWidth="1.8"
                  fill="none"
                />
                <path
                  d="M130,185 Q138,178 145,185"
                  stroke="#FEF08A"
                  strokeWidth="1.8"
                  fill="none"
                />
              </g>
            )}

            {pattern === 'hoi-van' && (
              // Geometric key fret border
              <g id="hoi-van-motif" opacity="0.6">
                <line x1="84" y1="215" x2="156" y2="215" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 2 2 2" />
              </g>
            )}

            {/* --- 7. NECKLACE / KIỀNG BẠC --- */}
            {hasKiengBac && (
              <ellipse
                cx="120"
                cy="98"
                rx="14"
                ry="9"
                fill="none"
                stroke="#E2E8F0"
                strokeWidth="2.5"
                filter="drop-shadow(0 1px 1px rgba(0,0,0,0.2))"
              />
            )}

            {/* --- 8. NECK & HEAD --- */}
            {/* Neck */}
            <rect x="115" y="70" width="10" height="16" fill="#FBD5BD" rx="2" />

            {/* Face/Head */}
            <ellipse cx="120" cy="55" rx="14" ry="17" fill="#FBD5BD" />
            {/* Minimalist hair */}
            <path d="M106,52 Q120,38 134,52 C134,44 106,44 106,52 Z" fill="#1C1917" />

            {/* Eyewear: Kính râm oval Y2K */}
            {hasKinhRam && (
              <g id="sunglasses">
                <ellipse cx="114" cy="54" rx="4.5" ry="3" fill="#09090B" />
                <ellipse cx="126" cy="54" rx="4.5" ry="3" fill="#09090B" />
                <line x1="118.5" y1="54" x2="121.5" y2="54" stroke="#09090B" strokeWidth="1" />
              </g>
            )}

            {/* --- 9. HEADWEAR ACCESSORIES --- */}
            {hasKhanVanhDay ? (
              // Khăn vành dây hoàng tộc triều Nguyễn (xòe rộng nhiều vòng đài các)
              <g id="khan-vanh-day">
                <ellipse cx="120" cy="40" rx="20" ry="8" fill="#D97706" stroke="#92400E" strokeWidth="1" />
                <ellipse cx="120" cy="38" rx="17" ry="6.5" fill="#F59E0B" stroke="#B45309" strokeWidth="0.8" />
                <ellipse cx="120" cy="36" rx="14" ry="5.5" fill="#FBBF24" />
                <circle cx="120" cy="36" r="2.2" fill="#BE123C" />
              </g>
            ) : hasKhanDong ? (
              // Traditional wrapped turban (Khăn đóng)
              <g id="khan-dong">
                <ellipse cx="120" cy="42" rx="16" ry="6" fill="#18181B" stroke="#27272A" strokeWidth="1" />
                <path d="M106,42 Q120,49 134,42" fill="none" stroke="#52525B" strokeWidth="1.5" />
              </g>
            ) : hasKhanMoQua ? (
              // Khăn mỏ quạ đen Kinh Bắc (gấp góc nhọn xuống trán)
              <g id="khan-mo-qua">
                <path d="M104,50 Q120,34 136,50 L120,60 Z" fill="#18181B" stroke="#09090B" strokeWidth="1" />
                <path d="M110,48 L120,58 L130,48" stroke="#3F3F46" strokeWidth="1" fill="none" />
              </g>
            ) : hasManNguSac ? (
              // Mấn lụa cách tân đính hoa
              <g id="man-lua">
                <path d="M106,46 Q120,35 134,46" stroke={palette.accent} strokeWidth="6" strokeLinecap="round" fill="none" />
                <circle cx="120" cy="38" r="2.5" fill="#FBBF24" />
              </g>
            ) : hasBeret ? (
              // French/Indochine Beret
              <g id="beret">
                <path d="M103,44 Q125,30 137,42 Q122,39 103,44 Z" fill="#334155" />
                <circle cx="123" cy="34" r="1.5" fill="#334155" />
              </g>
            ) : hasNonLa ? (
              // Nón lá slung behind back
              <g id="non-la-back" opacity="0.9">
                <path d="M85,95 L120,45 L155,95 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />
                <line x1="120" y1="45" x2="120" y2="95" stroke="#EAB308" strokeWidth="0.8" />
              </g>
            ) : null}

            {/* Trâm phượng hoàng cài tóc */}
            {hasTramPhuongHoang && (
              <g id="tram-phuong">
                <line x1="130" y1="45" x2="144" y2="36" stroke="#E2E8F0" strokeWidth="1.8" />
                <circle cx="145" cy="35" r="2.5" fill="#FDE047" stroke="#E2E8F0" strokeWidth="0.8" />
              </g>
            )}

            {/* Thẻ bài ngọc bội ngang eo */}
            {hasTheBaiNgocBoi && (
              <g id="the-bai-ngoc">
                <line x1="142" y1="136" x2="142" y2="145" stroke="#EF4444" strokeWidth="1.2" />
                <rect x="138" y="145" width="8" height="16" rx="2" fill="#6EE7B7" stroke="#059669" strokeWidth="0.8" />
                <circle cx="142" cy="164" r="1.8" fill="#EF4444" />
              </g>
            )}

            {/* --- KHĂN RẰN NAM BỘ (Vắt vai / quàng ngực) --- */}
            {hasKhanRan && (
              <g id="khan-ran-nam-bo">
                <path d="M110,88 Q118,98 126,88 L128,145 Q123,150 118,145 Z" fill="#F8FAFC" stroke="#0F172A" strokeWidth="0.8" />
                {/* Caro stripes */}
                <path d="M112,98 L126,98 M112,108 L126,108 M112,118 L126,118 M112,128 L126,128 M112,138 L126,138" stroke="#0F172A" strokeWidth="1" strokeDasharray="2 2" />
              </g>
            )}

            {/* --- 10. HANDHELD PROPS --- */}
            {hasNonQuaiThao && (
              // Nón quai thao tròn lớn cầm bên hông
              <g id="non-quai-thao" transform="translate(60, 155)">
                <ellipse cx="0" cy="0" rx="22" ry="7" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
                <ellipse cx="0" cy="-1" rx="14" ry="4" fill="#FDE047" stroke="#CA8A04" strokeWidth="0.8" />
                {/* Quai thao tơ buông rủ */}
                <path d="M-15,3 Q-5,25 0,22 Q5,25 15,3" fill="none" stroke="#BE123C" strokeWidth="1.5" />
                <line x1="0" y1="22" x2="0" y2="40" stroke="#BE123C" strokeWidth="1.2" />
              </g>
            )}

            {hasQuatDo && (
              // Calligraphy fan in right hand
              <g id="quat-giay-do" transform="translate(155, 145) rotate(-20)">
                <path d="M0,0 L25,-15 Q30,-5 20,10 Z" fill="#FEF3C7" stroke="#92400E" strokeWidth="1" />
                <line x1="0" y1="0" x2="23" y2="-12" stroke="#B45309" strokeWidth="0.8" />
                <line x1="0" y1="0" x2="26" y2="-2" stroke="#B45309" strokeWidth="0.8" />
                <line x1="0" y1="0" x2="18" y2="8" stroke="#B45309" strokeWidth="0.8" />
              </g>
            )}

            {hasTote && (
              // Canvas tote bag over left shoulder
              <g id="tote-bag">
                <line x1="82" y1="95" x2="68" y2="150" stroke="#78716C" strokeWidth="2" />
                <rect x="56" y="150" width="22" height="26" rx="2" fill="#F5F5F4" stroke="#D6D3D1" strokeWidth="1" />
                {/* Wave motif on tote */}
                <path d="M59,165 Q67,160 75,165" stroke="#0D9488" strokeWidth="1.5" fill="none" />
              </g>
            )}
          </svg>
        </div>

        {/* Scene location badge in corner */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-stone-900/60 backdrop-blur-md text-[10px] text-white font-medium flex items-center gap-1">
          <Image className="w-3 h-3 text-stone-300" />
          <span>{backdropInfo.title}</span>
        </div>

        {/* Remix style badge in top right */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-rose-600/90 backdrop-blur-md text-[10px] text-white font-semibold">
          {remixStyleName}
        </div>
      </div>

      {/* Backdrop Switcher row */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-1 overflow-x-auto text-[11px]">
        <span className="text-stone-400 shrink-0 text-[10px] font-medium mr-1">Bối cảnh:</span>
        <div className="flex items-center gap-1 shrink-0">
          {[
            { id: 'giang-duong', label: 'Giảng đường' },
            { id: 'hoang-thanh', label: 'Hoàng thành' },
            { id: 'hoi-an', label: 'Hội An' },
            { id: 'cafe', label: 'Cafe Gen Z' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setBackdrop(item.id as any)}
              className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap ${
                backdrop === item.id
                  ? 'bg-stone-900 text-white font-medium'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
