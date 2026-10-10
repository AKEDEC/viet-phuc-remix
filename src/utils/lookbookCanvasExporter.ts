import { UserOutfit } from '../types';
import { GARMENTS, OCCASIONS, COLOR_PALETTES, REMIX_STYLES, ACCESSORIES } from '../data/vietPhucData';
import { generateVietPhucFallbackSvg } from './fallbackImageGenerator';

/**
 * Loads an image from a URL or Data URI safely into an HTMLImageElement
 */
function loadImageSafe(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    const timer = setTimeout(() => {
      resolve(null);
    }, 4000);

    img.onload = () => {
      clearTimeout(timer);
      resolve(img);
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };

    img.src = src;
  });
}

/**
 * Renders an elegant, high-resolution multi-column lookbook poster onto an HTML5 Canvas
 */
export async function exportLookbookCanvas(outfits: UserOutfit[]): Promise<HTMLCanvasElement> {
  if (outfits.length === 0) {
    throw new Error('Cần ít nhất 1 bộ phối để xuất lookbook');
  }

  const count = Math.min(outfits.length, 3);
  const colWidth = 460;
  const paddingX = 60;
  const headerHeight = 220;
  const footerHeight = 120;
  const colSpacing = 36;
  const contentHeight = 840;

  const totalWidth = paddingX * 2 + count * colWidth + (count - 1) * colSpacing;
  const totalHeight = headerHeight + contentHeight + footerHeight;

  const canvas = document.createElement('canvas');
  canvas.width = totalWidth;
  canvas.height = totalHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // 1. Background fill: warm rice paper / silk parchment
  ctx.fillStyle = '#FAF7F2';
  ctx.fillRect(0, 0, totalWidth, totalHeight);

  // Decorative border
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 4;
  ctx.strokeRect(20, 20, totalWidth - 40, totalHeight - 40);

  ctx.strokeStyle = '#E7E5E4';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(28, 28, totalWidth - 56, totalHeight - 56);

  // Subtle corner ornaments
  const drawCorner = (x: number, y: number, dirX: number, dirY: number) => {
    ctx.save();
    ctx.strokeStyle = '#B45309';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, y + dirY * 24);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dirX * 24, y);
    ctx.stroke();
    ctx.restore();
  };
  drawCorner(36, 36, 1, 1);
  drawCorner(totalWidth - 36, 36, -1, 1);
  drawCorner(36, totalHeight - 36, 1, -1);
  drawCorner(totalWidth - 36, totalHeight - 36, -1, -1);

  // 2. Header
  // Top seal tag
  ctx.fillStyle = '#991B1B';
  const tagWidth = 190;
  const tagHeight = 28;
  const tagX = (totalWidth - tagWidth) / 2;
  const tagY = 48;
  ctx.beginPath();
  ctx.roundRect(tagX, tagY, tagWidth, tagHeight, 6);
  ctx.fill();

  ctx.fillStyle = '#FEF2F2';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('GEN Z HERITAGE STUDIO', totalWidth / 2, tagY + tagHeight / 2);

  // Main Title
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 38px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('VIỆT PHỤC REMIX · LOOKBOOK', totalWidth / 2, 86);

  // Subtitle
  ctx.fillStyle = '#78716C';
  ctx.font = '15px sans-serif';
  ctx.fillText(
    `BỘ SƯU TẬP SO SÁNH ${count} BẢN PHỐI CỔ PHỤC GIẢNG ĐƯỜNG & KỶ YẾU`,
    totalWidth / 2,
    136
  );

  // Divider line
  ctx.strokeStyle = '#D97706';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(totalWidth / 2 - 140, 168);
  ctx.lineTo(totalWidth / 2 + 140, 168);
  ctx.stroke();

  // Small diamond in center
  ctx.fillStyle = '#D97706';
  ctx.beginPath();
  ctx.arc(totalWidth / 2, 168, 4, 0, Math.PI * 2);
  ctx.fill();

  // 3. Render each Outfit Column
  for (let i = 0; i < count; i++) {
    const outfit = outfits[i];
    const garment = GARMENTS.find((g) => g.id === outfit.garmentId);
    const occasion = OCCASIONS.find((o) => o.id === outfit.occasionId);
    const palette = COLOR_PALETTES.find((p) => p.id === outfit.colorPaletteId);
    const remixStyle = REMIX_STYLES.find((s) => s.id === outfit.remixStyleId);
    const accessoryNames = outfit.selectedAccessories
      .map((id) => ACCESSORIES.find((a) => a.id === id)?.name)
      .filter(Boolean);

    const colX = paddingX + i * (colWidth + colSpacing);
    const colY = headerHeight;

    // Card background
    ctx.save();
    ctx.fillStyle = '#FFFFFF';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.06)';
    ctx.shadowBlur = 16;
    ctx.shadowOffsetY = 6;
    ctx.beginPath();
    ctx.roundRect(colX, colY, colWidth, contentHeight, 20);
    ctx.fill();
    ctx.restore();

    // Card border
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Card Header Slot Pill
    const cardPadding = 24;
    const innerX = colX + cardPadding;
    let currY = colY + 20;

    // Slot badge & Occasion
    ctx.fillStyle = '#991B1B';
    ctx.beginPath();
    ctx.roundRect(innerX, currY, 95, 24, 6);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`BỘ PHỐI 0${i + 1}`, innerX + 47.5, currY + 12);

    // Occasion tag
    ctx.fillStyle = '#FEF3C7';
    ctx.beginPath();
    ctx.roundRect(innerX + 105, currY, 130, 24, 6);
    ctx.fill();
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(occasion?.name || 'Dịp mặc', innerX + 170, currY + 12);

    currY += 34;

    // Title of outfit
    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 18px serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    const outfitTitle = outfit.customName || `${garment?.name} Remix`;
    ctx.fillText(outfitTitle, innerX, currY, colWidth - cardPadding * 2);

    currY += 26;

    // Garment & Dynasty subtext
    ctx.fillStyle = '#78716C';
    ctx.font = '12px sans-serif';
    ctx.fillText(
      `${garment?.name || 'Cổ phục'} · ${garment?.dynasty || 'Di sản'} (${garment?.region || 'Việt Nam'})`,
      innerX,
      currY
    );

    currY += 22;

    // Image frame
    const imgWidth = colWidth - cardPadding * 2;
    const imgHeight = 310;
    const imgX = innerX;
    const imgY = currY;

    // Draw image background placeholder
    ctx.fillStyle = '#F5F5F4';
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgWidth, imgHeight, 14);
    ctx.fill();
    ctx.strokeStyle = '#E7E5E4';
    ctx.stroke();

    // Prepare image url: either saved image or generate on-the-fly SVG fallback
    let targetImgUrl = outfit.imageUrl;
    if (!targetImgUrl) {
      targetImgUrl = generateVietPhucFallbackSvg({
        garmentId: outfit.garmentId,
        garmentName: garment?.name || 'Cổ phục',
        garmentEra: garment?.era || '',
        garmentRegion: garment?.region || '',
        outfitTitle: outfitTitle,
        primaryColor: palette?.primary || '#8B1E1E',
        secondaryColor: palette?.secondary || '#EAB308',
        accentColor: palette?.accent || '#D97706',
        patternType: outfit.patternType,
        occasionName: occasion?.name || '',
        accessories: accessoryNames as string[],
      });
    }

    // Load and draw image
    const loadedImg = await loadImageSafe(targetImgUrl);
    if (loadedImg) {
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(imgX, imgY, imgWidth, imgHeight, 14);
      ctx.clip();
      // Draw image keeping aspect ratio
      const aspectImg = loadedImg.width / loadedImg.height;
      const aspectBox = imgWidth / imgHeight;
      let drawW = imgWidth;
      let drawH = imgHeight;
      let offX = imgX;
      let offY = imgY;

      if (aspectImg > aspectBox) {
        drawW = imgHeight * aspectImg;
        offX = imgX - (drawW - imgWidth) / 2;
      } else {
        drawH = imgWidth / aspectImg;
        offY = imgY - (drawH - imgHeight) / 2;
      }

      ctx.drawImage(loadedImg, offX, offY, drawW, drawH);
      ctx.restore();
    } else {
      // Fallback text if image cannot be drawn
      ctx.fillStyle = '#A8A29E';
      ctx.font = 'italic 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(garment?.name || 'Minh họa cổ phục', imgX + imgWidth / 2, imgY + imgHeight / 2);
    }

    currY = imgY + imgHeight + 16;

    // Color Swatches
    ctx.fillStyle = '#44403C';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`BẢNG MÀU: ${palette?.name || 'Màu sắc'}`, innerX, currY);

    const swatches = [palette?.primary || '#991B1B', palette?.secondary || '#D97706', palette?.accent || '#CA8A04'];
    const swatchRadius = 8;
    const swatchStartX = innerX + 160;

    swatches.forEach((color, idx) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(swatchStartX + idx * 24, currY + 4, swatchRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    currY += 28;

    // Remix Style Tag & Rule
    ctx.fillStyle = '#F5F5F4';
    ctx.beginPath();
    ctx.roundRect(innerX, currY, imgWidth, 54, 10);
    ctx.fill();

    ctx.fillStyle = '#1C1917';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(`Phong cách: ${remixStyle?.name || 'Gen Z'}`, innerX + 12, currY + 18);

    ctx.fillStyle = '#78716C';
    ctx.font = '11px sans-serif';
    ctx.fillText(`${remixStyle?.keyRule || 'Cân bằng cổ kính và hiện đại'}`, innerX + 12, currY + 36, imgWidth - 24);

    currY += 66;

    // Accessories list
    ctx.fillStyle = '#44403C';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('PHỤ KIỆN REMIX:', innerX, currY);

    currY += 16;
    ctx.fillStyle = '#57534E';
    ctx.font = '11.5px sans-serif';
    const accText = accessoryNames.length > 0 ? accessoryNames.slice(0, 3).join(' · ') : 'Nguyên bản tối giản';
    ctx.fillText(accText, innerX, currY, imgWidth);

    currY += 26;

    // Cultural Integrity Badge
    const score = outfit.culturalScore ?? (outfit.culturalWarning ? 68 : 95);
    const isWarning = outfit.culturalWarning || score < 80;

    ctx.fillStyle = isWarning ? '#FFFBEB' : '#F0FDF4';
    ctx.beginPath();
    ctx.roundRect(innerX, currY, imgWidth, 52, 10);
    ctx.fill();
    ctx.strokeStyle = isWarning ? '#FDE68A' : '#BBF7D0';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = isWarning ? '#B45309' : '#15803D';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(
      isWarning ? '⚠️ CỐ VẤN: LƯU Ý PHỐI ĐỒ' : '🛡️ CỐ VẤN: CHUẨN MỰC DI SẢN',
      innerX + 12,
      currY + 18
    );

    ctx.fillStyle = isWarning ? '#92400E' : '#166534';
    ctx.font = '11px sans-serif';
    ctx.fillText(
      `Điểm tôn trọng di sản: ${score}/100 · ${
        isWarning ? 'Cần cân nhắc phụ kiện triều đại' : 'Hài hòa và tôn trọng truyền thống'
      }`,
      innerX + 12,
      currY + 36,
      imgWidth - 24
    );

    currY += 64;

    // Student Budget
    ctx.fillStyle = '#78716C';
    ctx.font = '11px sans-serif';
    ctx.fillText('Dự toán sinh viên: 120k - 250k (Thuê trọn gói)', innerX, currY);
  }

  // 4. Footer
  const footerY = totalHeight - footerHeight + 10;
  ctx.fillStyle = '#1C1917';
  ctx.font = 'bold 14px serif';
  ctx.textAlign = 'center';
  ctx.fillText('VIỆT PHỤC REMIX · GEN Z HERITAGE STUDIO', totalWidth / 2, footerY + 20);

  ctx.fillStyle = '#78716C';
  ctx.font = '12px sans-serif';
  ctx.fillText(
    'Tôn vinh văn hóa truyền thống Việt Nam qua lăng kính sáng tạo trẻ · Xuất ngày ' +
      new Date().toLocaleDateString('vi-VN'),
    totalWidth / 2,
    footerY + 44
  );

  ctx.fillStyle = '#A8A29E';
  ctx.font = '11px sans-serif';
  ctx.fillText('vietphucremix.studio · Chia sẻ để lan tỏa vẻ đẹp cổ phục Việt Nam', totalWidth / 2, footerY + 66);

  return canvas;
}

/**
 * Returns a PNG data URL of the compiled lookbook image
 */
export async function getLookbookDataUrl(outfits: UserOutfit[]): Promise<string> {
  const canvas = await exportLookbookCanvas(outfits);
  return canvas.toDataURL('image/png', 0.95);
}

/**
 * Downloads the exported lookbook image as a PNG file
 */
export async function downloadLookbookImage(outfits: UserOutfit[], filename = 'lookbook-viet-phuc-remix.png'): Promise<void> {
  const canvas = await exportLookbookCanvas(outfits);
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Shares the lookbook image using Web Share API or Clipboard fallback
 */
export async function shareLookbookImage(
  outfits: UserOutfit[]
): Promise<{ success: boolean; method: 'web-share' | 'clipboard' | 'fallback'; message: string }> {
  try {
    const canvas = await exportLookbookCanvas(outfits);

    // Try Web Share API with File
    if (navigator.share && navigator.canShare) {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        const file = new File([blob], 'lookbook-viet-phuc-remix.png', { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Lookbook Việt Phục Remix Gen Z',
            text: `Bộ sưu tập so sánh ${outfits.length} bản phối cổ phục Việt Nam của tôi! #VietPhucRemix #GenZHeritage`,
            files: [file],
          });
          return { success: true, method: 'web-share', message: 'Đã chia sẻ lookbook thành công!' };
        }
      }
    }

    // Try Clipboard API
    if (navigator.clipboard && (window as any).ClipboardItem) {
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (blob) {
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({
            'image/png': blob,
          }),
        ]);
        return {
          success: true,
          method: 'clipboard',
          message: 'Đã sao chép ảnh Lookbook vào bộ nhớ tạm! Bạn có thể dán (Ctrl+V) vào Messenger, Zalo hoặc mạng xã hội.',
        };
      }
    }

    // Fallback: download automatically
    await downloadLookbookImage(outfits);
    return {
      success: true,
      method: 'fallback',
      message: 'Đã tải ảnh Lookbook về máy của bạn để sẵn sàng chia sẻ!',
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return { success: false, method: 'web-share', message: 'Đã hủy chia sẻ.' };
    }
    // Fallback to download
    try {
      await downloadLookbookImage(outfits);
      return {
        success: true,
        method: 'fallback',
        message: 'Đã tải ảnh Lookbook về máy.',
      };
    } catch {
      return { success: false, method: 'fallback', message: 'Không thể xuất ảnh lookbook.' };
    }
  }
}
