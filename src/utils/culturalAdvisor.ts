import { Occasion, Garment, ColorPalette, AccessoryItem, RemixStyle, CulturalAdvisorResult } from '../types';

/**
 * Cultural Advisor logic:
 * Checks whether user combination distorts cultural characteristics.
 * Returns warnings, concise cultural explanations, and respectful alternatives.
 */
export function checkCulturalIntegrity(params: {
  occasion: Occasion;
  garment: Garment;
  palette: ColorPalette;
  pattern: string;
  selectedAccessories: AccessoryItem[];
  remixStyle: RemixStyle;
}): CulturalAdvisorResult {
  const { occasion, garment, selectedAccessories, remixStyle } = params;
  const accIds = selectedAccessories.map((a) => a.id);

  // 1. Check Áo Bà Ba (Nam Bộ) with Northern or Imperial Royal items
  if (garment.id === 'ao-ba-ba') {
    if (accIds.includes('khan-vanh-day') || accIds.includes('tram-phuong-hoang') || accIds.includes('the-bai-ngoc-boi')) {
      return {
        canh_bao_sai_lech: true,
        tieu_de_canh_bao: '⚠️ Lệch chuẩn đẳng cấp: Phụ kiện Cung đình không phối cùng Áo Bà Ba dân tộc',
        giai_thich_ngan:
          'Áo Bà Ba là biểu tượng của đời sống lao động đôn hậu, bình dị vùng sông nước Nam Bộ thế kỷ XIX. Khăn vành dây hay trâm phượng hoàng lại là phẩm phục tối thượng của bậc cung phi hoàng thất triều Nguyễn, tạo nên sự xung đột văn hóa lớn về bối cảnh xã hội và ý nghĩa trang phục.',
        goi_y_thay_the:
          'Để tôn trọng tinh thần trang phục, hãy thay bằng Khăn rằn Nam Bộ kẻ caro, Nón lá hoặc Guốc mộc quai da. Bộ đồ sẽ giữ nguyên vẻ đẹp khỏe khoắn, phóng khoáng mà vẫn cực kỳ ăn ảnh.',
        phu_kien_thay_the_ids: ['khan-ran-nam-bo', 'non-la-mini', 'guoc-moc'],
        diem_ton_trong_di_san: 45,
      };
    }

    if (accIds.includes('non-quai-thao') || accIds.includes('khan-mo-qua')) {
      return {
        canh_bao_sai_lech: true,
        tieu_de_canh_bao: '⚠️ Sai lệch vùng miền: Nhầm lẫn bản sắc Kinh Bắc với Nam Bộ',
        giai_thich_ngan:
          'Nón quai thao và Khăn mỏ quạ là đặc trưng của liền chị quan họ vùng châu thổ Bắc Bộ. Áo Bà Ba thuộc về phù sa sông Cửu Long Nam Bộ. Sự pha trộn này làm mất tính bản địa đặc sắc của hai vùng văn hóa.',
        goi_y_thay_the:
          'Thay nón quai thao bằng Khăn rằn Nam Bộ hoặc Nón lá vẽ tay; nếu muốn đội nón quai thao, bạn nên chọn loại trang phục Áo Tứ Thân.',
        phu_kien_thay_the_ids: ['khan-ran-nam-bo', 'non-la-mini'],
        diem_ton_trong_di_san: 55,
      };
    }
  }

  // 2. Check Áo Tứ Thân (Kinh Bắc - Bắc Bộ) with Southern or Royal items
  if (garment.id === 'ao-tu-than') {
    if (accIds.includes('khan-vanh-day')) {
      return {
        canh_bao_sai_lech: true,
        tieu_de_canh_bao: '⚠️ Lệch chuẩn dân gian: Khăn vành dây hoàng tộc không đi cùng Tứ Thân',
        giai_thich_ngan:
          'Áo Tứ Thân tôn vinh văn hóa đồng bằng Bắc Bộ và các liền chị quan họ với nét đẹp dân dã, chịu thương chịu khó. Khăn vành dây thuộc về nghi lễ cung đình Huế, không xuất hiện trong trang phục tứ thân truyền thống.',
        goi_y_thay_the:
          'Hãy chọn Nón quai thao tơ tằm, Khăn mỏ quạ đen tuyền và thắt lưng ruột tượng lụa hồng để tái hiện chuẩn xác khí chất giai nhân Kinh Bắc.',
        phu_kien_thay_the_ids: ['non-quai-thao', 'khan-mo-qua', 'ruot-tuong', 'yem-dao'],
        diem_ton_trong_di_san: 50,
      };
    }

    if (accIds.includes('khan-ran-nam-bo')) {
      return {
        canh_bao_sai_lech: true,
        tieu_de_canh_bao: '⚠️ Sai lệch vùng miền: Khăn rằn Nam Bộ xáo trộn với Tứ Thân Kinh Bắc',
        giai_thich_ngan:
          'Áo Tứ Thân gắn liền với dải yếm đào và nón ba tầm xứ Bắc. Chiếc khăn rằn caro là nét mộc của miền Nam sông nước, kết hợp cùng Tứ Thân sẽ gây nhầm lẫn nguồn gốc dân tộc học.',
        goi_y_thay_the:
          'Nên thay khăn rằn bằng Khăn mỏ quạ đen và Dây lưng ruột tượng nhiều màu buông lơi trước ngực đúng phong thái cổ truyền.',
        phu_kien_thay_the_ids: ['khan-mo-qua', 'non-quai-thao', 'ruot-tuong'],
        diem_ton_trong_di_san: 60,
      };
    }
  }

  // 3. Check Áo Nhật Bình (Cung đình triều Nguyễn) with informal rustic items
  if (garment.id === 'ao-nhat-binh') {
    if (accIds.includes('khan-ran-nam-bo') || accIds.includes('non-quai-thao')) {
      return {
        canh_bao_sai_lech: true,
        tieu_de_canh_bao: '⚠️ Hạ phẩm phục: Phụ kiện dân gian mộc mạc đối lập Lễ phục Cung đình',
        giai_thich_ngan:
          'Áo Nhật Bình là thường phục cao cấp của Hoàng hậu, Công chúa và mệnh phụ triều Nguyễn với viền cổ chữ nhật thêu ngũ hành quyền quý. Việc gắn khăn rằn hay nón ba tầm vào lễ phục hoàng thất làm mất đi tính trang nghiêm, tôn ti trật tự điển lễ.',
        goi_y_thay_the:
          'Thay thế bằng Khăn vành dây hoàng tộc, Trâm bạc cài tóc phượng hoàng, Thẻ bài ngọc bội hoặc Quạt giấy dó thư pháp để giữ trọn phong thái đài các chốn hoàng cung.',
        phu_kien_thay_the_ids: ['khan-vanh-day', 'tram-phuong-hoang', 'kieng-bac', 'the-bai-ngoc-boi'],
        diem_ton_trong_di_san: 40,
      };
    }
  }

  // 4. Check Áo Ngũ Thân with inappropriate accessories
  if (garment.id === 'ao-ngu-than') {
    if (accIds.includes('non-quai-thao')) {
      return {
        canh_bao_sai_lech: true,
        tieu_de_canh_bao: '⚠️ Lệch phụ kiện: Nón quai thao không đi cùng Áo Ngũ Thân',
        giai_thich_ngan:
          'Nón quai thao là món đồ gắn liền độc quyền với Áo Tứ Thân Kinh Bắc. Áo Ngũ Thân chuẩn mực của thời Nguyễn đi kèm với Khăn đóng (khăn vấn chữ Nhân) hoặc Nón lá mộc.',
        goi_y_thay_the:
          'Hãy chọn Khăn đóng truyền thống màu đen hoặc cùng tone áo, kết hợp Quạt nan thư pháp để đúng phong độ nhà nho, văn nhân xưa.',
        phu_kien_thay_the_ids: ['khan-dong', 'quat-giay-do', 'guoc-moc'],
        diem_ton_trong_di_san: 65,
      };
    }
  }

  // 5. Check graduation occasion with overly informal style
  if (occasion.id === 'graduation' && garment.id === 'ao-ba-ba' && remixStyle.id === 'streetwear-breakthrough') {
    return {
      canh_bao_sai_lech: true,
      tieu_de_canh_bao: '⚠️ Lưu ý bối cảnh: Lễ tốt nghiệp đại học cần tính trang trọng lễ nghi',
      giai_thich_ngan:
        'Lễ nhận bằng cử nhân là sự kiện học thuật thiêng liêng. Áo Bà Ba mang tính chất sinh hoạt đời thường dã ngoại; kết hợp cùng phong cách streetwear phá cách dễ tạo cảm giác thiếu trang nghiêm trong hội trường nhận bằng.',
      goi_y_thay_the:
        'Cố vấn khuyến nghị chuyển sang Áo Dài Lemur hoặc Áo Ngũ Thân tay chẽn phối cùng quần lụa trắng hoặc giày da/Oxford để vừa đĩnh đạc vừa tôn vinh tri thức thanh xuân.',
      phu_kien_thay_the_ids: ['quan-lua-truyen-thong', 'kieng-bac', 'khan-dong'],
      diem_ton_trong_di_san: 60,
    };
  }

  // If no violations found: Approved cultural match with positive praise
  return {
    canh_bao_sai_lech: false,
    tieu_de_canh_bao: '✅ Chuẩn Mực Văn Hóa & Cách Tân Hài Hòa',
    giai_thich_ngan: `Bản phối thể hiện sự am hiểu sâu sắc về ${garment.name} (${garment.region}). Cách lựa chọn phụ kiện vừa tôn trọng nguồn gốc ${garment.era}, vừa thể hiện gu thẩm mỹ trẻ trung, văn minh của sinh viên hiện đại mà không làm biến dạng giá trị cốt lõi.`,
    goi_y_thay_the:
      'Bộ trang phục đã đạt độ cân bằng hoàn hảo. Bạn có thể tự tin diện đến trường, chụp ảnh kỷ yếu hay tham gia sự kiện văn hóa!',
    phu_kien_thay_the_ids: [],
    diem_ton_trong_di_san: 96,
  };
}
