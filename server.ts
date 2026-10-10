import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with user-agent 'aistudio-build'
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.post('/api/gemini/suggest-outfit', async (req, res) => {
  try {
    const { occasion, garment, palette, pattern, accessories, remixStyle } = req.body;

    const accessoryNames = Array.isArray(accessories)
      ? accessories.map((a: any) => (typeof a === 'string' ? a : a.name || a.id)).join(', ')
      : 'Không có';

    // Heuristic fallback for cultural check
    const checkCulturalFallback = () => {
      const accStr = (accessoryNames || '').toLowerCase();
      const garmentId = garment?.id || '';
      
      // 1. Áo Bà Ba with Imperial or Quan Ho items
      if (garmentId === 'ao-ba-ba') {
        if (accStr.includes('vành dây') || accStr.includes('phượng hoàng') || accStr.includes('ngọc bội')) {
          return {
            canh_bao_sai_lech: true,
            tieu_de_canh_bao: '⚠️ Lệch chuẩn đẳng cấp: Phụ kiện Cung đình không phối cùng Áo Bà Ba',
            giai_thich_ngan: 'Áo Bà Ba là trang phục mộc mạc, bình dị của người dân sông nước Nam Bộ thế kỷ XIX. Khăn vành dây hay trâm phượng hoàng là phẩm phục của bậc hậu phi hoàng gia triều Nguyễn, tạo nên sự xung đột lớn về bối cảnh văn hóa.',
            goi_y_thay_the: 'Nên thay bằng Khăn rằn Nam Bộ kẻ caro, Nón lá hoặc Guốc mộc quai da để giữ trọn nét duyên dáng, phóng khoáng của miền Tây.',
            phu_kien_thay_the_ids: ['khan-ran-nam-bo', 'non-la-mini', 'guoc-moc'],
            diem_ton_trong_di_san: 45,
          };
        }
        if (accStr.includes('quai thao') || accStr.includes('mỏ quạ')) {
          return {
            canh_bao_sai_lech: true,
            tieu_de_canh_bao: '⚠️ Sai lệch vùng miền: Nhầm lẫn bản sắc Kinh Bắc với Nam Bộ',
            giai_thich_ngan: 'Nón quai thao và Khăn mỏ quạ là nét đặc trưng của phụ nữ Kinh Bắc Bắc Bộ trong các điệu dân ca quan họ, không thuộc văn hóa trang phục Nam Bộ của Áo Bà Ba.',
            goi_y_thay_the: 'Thay bằng Khăn rằn Nam Bộ hoặc Nón lá; hoặc đổi trang phục sang Áo Tứ Thân nếu muốn giữ nón quai thao.',
            phu_kien_thay_the_ids: ['khan-ran-nam-bo', 'non-la-mini'],
            diem_ton_trong_di_san: 55,
          };
        }
      }

      // 2. Áo Tứ Thân with Royal or Southern items
      if (garmentId === 'ao-tu-than') {
        if (accStr.includes('vành dây')) {
          return {
            canh_bao_sai_lech: true,
            tieu_de_canh_bao: '⚠️ Lệch chuẩn dân gian: Khăn vành dây hoàng tộc không đi cùng Tứ Thân',
            giai_thich_ngan: 'Áo Tứ Thân tôn vinh nét đẹp lao động và ngày hội dân gian miền Bắc với tứ thân phụ mẫu và yếm đào e ấp. Khăn vành dây thuộc về nghi thức cung đình Phú Xuân, không có trong văn hóa Tứ Thân.',
            goi_y_thay_the: 'Hãy chọn Nón quai thao tơ tằm, Khăn mỏ quạ đen và Dây lưng ruột tượng lụa hồng để đúng chuẩn liền chị Kinh Bắc.',
            phu_kien_thay_the_ids: ['non-quai-thao', 'khan-mo-qua', 'ruot-tuong', 'yem-dao'],
            diem_ton_trong_di_san: 50,
          };
        }
        if (accStr.includes('khăn rằn')) {
          return {
            canh_bao_sai_lech: true,
            tieu_de_canh_bao: '⚠️ Sai lệch vùng miền: Khăn rằn Nam Bộ không thuộc Tứ Thân Kinh Bắc',
            giai_thich_ngan: 'Áo Tứ Thân gắn liền với dải yếm đào và nón ba tầm Bắc Bộ. Khăn rằn là di sản sinh hoạt phương Nam, kết hợp cùng Tứ Thân làm lu mờ nguồn gốc địa lý.',
            goi_y_thay_the: 'Thay bằng Khăn mỏ quạ đen hoặc Nón quai thao quai tơ để thể hiện đúng vẻ đẹp thanh tao Kinh Bắc.',
            phu_kien_thay_the_ids: ['khan-mo-qua', 'non-quai-thao'],
            diem_ton_trong_di_san: 58,
          };
        }
      }

      // 3. Áo Nhật Bình with rustic items
      if (garmentId === 'ao-nhat-binh') {
        if (accStr.includes('khăn rằn') || accStr.includes('quai thao')) {
          return {
            canh_bao_sai_lech: true,
            tieu_de_canh_bao: '⚠️ Hạ phẩm phục: Phụ kiện dân dã không đi cùng Lễ phục Hoàng gia',
            giai_thich_ngan: 'Áo Nhật Bình là thường phục cao cấp của Hoàng tộc triều Nguyễn với viền cổ chữ nhật ngũ hành quyền quý. Phụ kiện dân dã làm giảm tính tôn nghiêm của lễ phục hoàng triều.',
            goi_y_thay_the: 'Thay bằng Khăn vành dây hoàng gia, Trâm cài tóc phượng hoàng, Kiềng bạc hoa sen hoặc Thẻ bài ngọc bội.',
            phu_kien_thay_the_ids: ['khan-vanh-day', 'tram-phuong-hoang', 'kieng-bac', 'the-bai-ngoc-boi'],
            diem_ton_trong_di_san: 40,
          };
        }
      }

      // Default safe
      return {
        canh_bao_sai_lech: false,
        tieu_de_canh_bao: '✅ Chuẩn Mực Văn Hóa & Cách Tân Hài Hòa',
        giai_thich_ngan: `Bản phối thể hiện sự am hiểu sâu sắc về ${garment?.name || 'Cổ phục'}. Các chi tiết tôn trọng nguồn gốc ${garment?.era || 'truyền thống'} và dung hòa sáng tạo cùng sinh viên Gen Z.`,
        goi_y_thay_the: 'Trang phục đã đạt chuẩn hài hòa di sản. Bạn có thể tự tin diện đến trường, chụp kỷ yếu hay sự kiện!',
        phu_kien_thay_the_ids: [],
        diem_ton_trong_di_san: 95,
      };
    };

    const culturalFallback = checkCulturalFallback();

    const prompt = `Bạn là cố vấn văn hóa & stylist chuyên gia về Cổ phục Việt Nam và Việt phục cách tân dành cho giới trẻ, sinh viên Gen Z.
Người dùng vừa hoàn tất chọn phối đồ với các thông số:
- Dịp xuất hiện: ${occasion?.name || 'Chưa xác định'} (Vibe: ${occasion?.vibe || ''})
- Loại cổ phục: ${garment?.name || 'Áo Dài'} (Vùng miền: ${garment?.region || ''}, Thời kỳ: ${garment?.era || ''})
- Nguồn gốc & Ý nghĩa: ${garment?.originAndMeaning || ''}
- Tone màu: ${palette?.name || 'Mặc định'} (Chính: ${palette?.primary}, Phụ: ${palette?.secondary}, Điểm xuyết: ${palette?.accent})
- Họa tiết: ${pattern || 'Thủy Ba'}
- Phong cách remix: ${remixStyle?.name || 'Hiện đại'} (${remixStyle?.keyRule || ''})
- Phụ kiện remix đã chọn: ${accessoryNames}
- Phụ kiện đúng truyền thống của loại áo này: ${garment?.traditionalAccessories?.join(', ') || ''}

BẠN CẦN THỰC HIỆN 2 NHIỆM VỤ ĐỒNG THỜI VÀ TRẢ VỀ JSON:
1. GỢI Ý BẢN PHỐI STYLIST CHO SINH VIÊN:
- ten_bo_phoi: Tên bộ phối bắt tai, sáng tạo, cuốn hút (ví dụ: "Dáng Ngọc Sài Thành", "Tứ Thân Phong Nhã", "Ngũ Thân Tân Thời", "Nhật Bình Hoàng Gia Kỷ Yếu", "Bà Ba Năng Động").
- mo_ta: Mô tả tổng quan bản phối (2-3 câu) về sự dung hòa giữa di sản và sinh viên Gen Z.
- bang_mau_hex: Mảng 3-5 mã màu hex (#RRGGBB).
- phu_kien: Mảng 3-5 phụ kiện gợi ý tốt nhất cho bản phối.
- ly_do_hop_dip: Lý do tại sao bản phối này rất hợp với dịp "${occasion?.name}".
- diem_hai_hoa_mau: Điểm số từ 0 đến 100 (số nguyên).

2. CỐ VẤN VĂN HÓA (KIỂM TRA LỰA CHỌN CỦA NGƯỜI DÙNG):
Kiểm tra xem cách phối có làm sai lệch đặc trưng văn hóa không:
- Các trường hợp SAI LỆCH VĂN HÓA:
  * Áo Bà Ba (Nam Bộ mộc mạc) lại phối phụ kiện hoàng gia triều Nguyễn (khăn vành dây, trâm phượng hoàng, thẻ bài ngọc bội) hoặc nón quai thao / khăn mỏ quạ Kinh Bắc.
  * Áo Tứ Thân (Kinh Bắc Bắc Bộ) lại phối khăn rằn Nam Bộ hoặc khăn vành dây hoàng tộc triều Nguyễn.
  * Áo Nhật Bình (Lễ phục hoàng cung Huế cao quý) lại phối khăn rằn Nam Bộ hoặc nón quai thao dân dã làm hạ thấp tính tôn nghiêm.
  * Áo Ngũ Thân lại phối nón quai thao (chỉ dành cho Áo Tứ Thân).
  * Dịp trang trọng (Lễ tốt nghiệp) lại mặc đồ sinh hoạt dân dã hoặc hở hang phản cảm.
- NẾU CÓ SAI LỆCH VĂN HÓA:
  * canh_bao_sai_lech: true
  * tieu_de_canh_bao: Tiêu đề cảnh báo rõ ràng (bắt đầu bằng ⚠️)
  * giai_thich_ngan: Giải thích ngắn gọn (2-3 câu) về nguồn gốc, quy định truyền thống và lý do sai lệch.
  * goi_y_thay_the: Gợi ý thay thế tôn trọng truyền thống hơn.
  * diem_ton_trong_di_san: Điểm số từ 30 đến 65.
- NẾU PHỐI ĐÚNG HOẶC CÁCH TÂN VĂN MINH TÔN TRỌNG:
  * canh_bao_sai_lech: false
  * tieu_de_canh_bao: "✅ Chuẩn Mực Văn Hóa & Cách Tân Hài Hòa"
  * giai_thich_ngan: Lời giải thích khen ngợi sự tôn trọng di sản và phối màu/phụ kiện văn minh.
  * goi_y_thay_the: Lời khuyên tự tin tỏa sáng.
  * diem_ton_trong_di_san: Điểm số từ 90 đến 100.`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        ten_bo_phoi: `${garment?.name || 'Cổ Phục'} Remix ${remixStyle?.name || 'Gen Z'}`,
        mo_ta: `Bản phối kết hợp hoàn hảo giữa nét đoan trang của ${garment?.name || 'cổ phục'} cùng sự trẻ trung, phá cách của phong cách ${remixStyle?.name || 'Gen Z'}. Sự chuyển tiếp tự nhiên giữa màu sắc truyền thống và phụ kiện hiện đại tạo nên diện mạo vừa đĩnh đạc vừa thu hút mọi ánh nhìn.`,
        bang_mau_hex: [palette?.primary || '#BE123C', palette?.secondary || '#FFF1F2', palette?.accent || '#E11D48', '#18181B'],
        phu_kien: [
          ...(Array.isArray(accessories) && accessories.length > 0
            ? accessories.map((a: any) => (typeof a === 'string' ? a : a.name || a.id))
            : ['Sneaker chunky trắng', 'Kiềng bạc hoa sen', 'Túi tote Thủy Ba']),
        ],
        ly_do_hop_dip: `Bản phối này đáp ứng trọn vẹn yêu cầu của dịp ${occasion?.name || 'sự kiện'}, vừa đủ trang nghiêm lịch sự lại tạo cảm giác thoải mái khi di chuyển trong khuôn viên trường và chụp ảnh kỷ yếu.`,
        diem_hai_hoa_mau: 95,
        co_van_van_hoa: culturalFallback,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ten_bo_phoi: {
              type: Type.STRING,
              description: 'Tên bộ phối sáng tạo, ấn tượng cho Gen Z',
            },
            mo_ta: {
              type: Type.STRING,
              description: 'Mô tả tổng thể bản phối 2-3 câu',
            },
            bang_mau_hex: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Danh sách 3-5 mã màu hex',
            },
            phu_kien: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Danh sách 3-5 phụ kiện hoàn hảo',
            },
            ly_do_hop_dip: {
              type: Type.STRING,
              description: 'Lý do phù hợp với dịp đã chọn',
            },
            diem_hai_hoa_mau: {
              type: Type.INTEGER,
              description: 'Điểm số hài hòa từ 0 đến 100',
            },
            co_van_van_hoa: {
              type: Type.OBJECT,
              properties: {
                canh_bao_sai_lech: {
                  type: Type.BOOLEAN,
                  description: 'True nếu cách phối làm sai lệch đặc trưng văn hóa',
                },
                tieu_de_canh_bao: {
                  type: Type.STRING,
                  description: 'Tiêu đề cảnh báo hoặc chứng nhận chuẩn mực',
                },
                giai_thich_ngan: {
                  type: Type.STRING,
                  description: 'Giải thích ngắn gọn 2-3 câu về quy định truyền thống',
                },
                goi_y_thay_the: {
                  type: Type.STRING,
                  description: 'Gợi ý thay thế tôn trọng truyền thống hơn',
                },
                diem_ton_trong_di_san: {
                  type: Type.INTEGER,
                  description: 'Điểm tôn trọng di sản từ 0 đến 100',
                },
              },
              required: [
                'canh_bao_sai_lech',
                'tieu_de_canh_bao',
                'giai_thich_ngan',
                'goi_y_thay_the',
                'diem_ton_trong_di_san',
              ],
            },
          },
          required: [
            'ten_bo_phoi',
            'mo_ta',
            'bang_mau_hex',
            'phu_kien',
            'ly_do_hop_dip',
            'diem_hai_hoa_mau',
            'co_van_van_hoa',
          ],
        },
      },
    });

    const rawText = response.text || '{}';
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const parsed = JSON.parse(cleaned);

    // If Gemini didn't supply phu_kien_thay_the_ids in cultural advice, attach fallback IDs if warning
    if (parsed.co_van_van_hoa && culturalFallback.canh_bao_sai_lech) {
      parsed.co_van_van_hoa.phu_kien_thay_the_ids = culturalFallback.phu_kien_thay_the_ids;
    }

    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/gemini/suggest-outfit:', error);
    const { occasion, garment, palette, remixStyle, accessories } = req.body || {};

    const accNames = Array.isArray(accessories)
      ? accessories.map((a: any) => (typeof a === 'string' ? a : a.name || a.id)).join(', ')
      : '';
    const accStr = accNames.toLowerCase();
    const garmentId = garment?.id || '';

    let culturalFallback = {
      canh_bao_sai_lech: false,
      tieu_de_canh_bao: '✅ Chuẩn Mực Văn Hóa & Cách Tân Hài Hòa',
      giai_thich_ngan: `Bản phối thể hiện sự am hiểu sâu sắc về ${garment?.name || 'Cổ phục'} (${garment?.region || 'Việt Nam'}). Phụ kiện vừa tôn trọng nguồn gốc ${garment?.era || ''}, vừa mang gu thẩm mỹ tươi trẻ của sinh viên Gen Z.`,
      goi_y_thay_the: 'Bộ trang phục đã đạt độ cân bằng hoàn hảo, sẵn sàng cho dịp đặc biệt của bạn!',
      phu_kien_thay_the_ids: [] as string[],
      diem_ton_trong_di_san: 96,
    };

    if (garmentId === 'ao-ba-ba' && (accStr.includes('vành dây') || accStr.includes('phượng hoàng') || accStr.includes('ngọc bội'))) {
      culturalFallback = {
        canh_bao_sai_lech: true,
        tieu_de_canh_bao: '⚠️ Lệch chuẩn đẳng cấp: Phụ kiện Cung đình không phối cùng Áo Bà Ba',
        giai_thich_ngan: 'Áo Bà Ba là trang phục mộc mạc của người dân Nam Bộ. Khăn vành dây và trâm phượng hoàng thuộc phẩm phục hoàng gia triều Nguyễn, tạo nên sự xung đột lớn về bối cảnh văn hóa.',
        goi_y_thay_the: 'Nên thay bằng Khăn rằn Nam Bộ kẻ caro, Nón lá hoặc Guốc mộc để giữ trọn nét duyên dáng phương Nam.',
        phu_kien_thay_the_ids: ['khan-ran-nam-bo', 'non-la-mini', 'guoc-moc'],
        diem_ton_trong_di_san: 45,
      };
    } else if (garmentId === 'ao-tu-than' && accStr.includes('vành dây')) {
      culturalFallback = {
        canh_bao_sai_lech: true,
        tieu_de_canh_bao: '⚠️ Lệch chuẩn dân gian: Khăn vành dây hoàng tộc không đi cùng Tứ Thân',
        giai_thich_ngan: 'Áo Tứ Thân tôn vinh nét đẹp lao động dân gian Kinh Bắc. Khăn vành dây thuộc nghi thức cung đình Phú Xuân, không có trong văn hóa Tứ Thân.',
        goi_y_thay_the: 'Hãy chọn Nón quai thao tơ tằm, Khăn mỏ quạ đen và Dây lưng ruột tượng để đúng chuẩn liền chị Kinh Bắc.',
        phu_kien_thay_the_ids: ['non-quai-thao', 'khan-mo-qua', 'ruot-tuong'],
        diem_ton_trong_di_san: 50,
      };
    } else if (garmentId === 'ao-nhat-binh' && (accStr.includes('khăn rằn') || accStr.includes('quai thao'))) {
      culturalFallback = {
        canh_bao_sai_lech: true,
        tieu_de_canh_bao: '⚠️ Hạ phẩm phục: Phụ kiện dân dã không đi cùng Lễ phục Hoàng gia',
        giai_thich_ngan: 'Áo Nhật Bình là thường phục cao cấp triều Nguyễn. Phụ kiện dân dã làm giảm tính tôn nghiêm của lễ phục hoàng triều.',
        goi_y_thay_the: 'Thay bằng Khăn vành dây hoàng gia, Trâm phượng hoàng bạc hoặc Kiềng bạc hoa sen.',
        phu_kien_thay_the_ids: ['khan-vanh-day', 'tram-phuong-hoang', 'kieng-bac'],
        diem_ton_trong_di_san: 40,
      };
    }

    return res.json({
      ten_bo_phoi: `${garment?.name || 'Cổ Phục'} Remix ${remixStyle?.name || 'Gen Z'}`,
      mo_ta: `Bản phối kết hợp hài hòa giữa chất liệu truyền thống của ${garment?.name || 'Việt phục'} và sự năng động của sinh viên hiện đại. Từng chi tiết đều toát lên niềm tự hào dân tộc và phong thái tự tin.`,
      bang_mau_hex: [palette?.primary || '#BE123C', palette?.secondary || '#FFF1F2', palette?.accent || '#E11D48'],
      phu_kien: ['Kiềng bạc hoa sen', 'Sneaker chunky trắng', 'Túi tote Thủy Ba'],
      ly_do_hop_dip: `Cực kỳ phù hợp cho ${occasion?.name || 'dịp xuất hiện'} nhờ sự thanh lịch, tôn dáng và dễ vận động.`,
      diem_hai_hoa_mau: 92,
      co_van_van_hoa: culturalFallback,
    });
  }
});

// Endpoint to generate outfit fashion illustration using Gemini image model
app.post('/api/gemini/generate-outfit-image', async (req, res) => {
  try {
    const { outfitJson, garment, occasion, palette, remixStyle } = req.body || {};

    const hexColors = Array.isArray(outfitJson?.bang_mau_hex)
      ? outfitJson.bang_mau_hex.join(', ')
      : `${palette?.primary || '#BE123C'}, ${palette?.secondary || '#FFF1F2'}`;

    const accessories = Array.isArray(outfitJson?.phu_kien)
      ? outfitJson.phu_kien.join(', ')
      : 'phụ kiện truyền thống và hiện đại';

    const prompt = `Cinematic high-fashion editorial portrait of a stylish young Vietnamese university student wearing authentic modern Vietnamese traditional costume: ${garment?.name || 'Áo Dài'} (${garment?.region || 'Vietnam'}, ${garment?.era || 'historical origin'}).
Ensemble Title: "${outfitJson?.ten_bo_phoi || garment?.name || 'Việt Phục Remix'}".
Description: ${outfitJson?.mo_ta || 'Modern Vietnamese Gen Z heritage remix'}.
Color Palette: ${hexColors}.
Accessories: ${accessories}.
Occasion: ${occasion?.name || 'Kỷ yếu đại học'} - ${occasion?.vibe || ''}.
Remix Style: ${remixStyle?.name || 'Gen Z Contemporary'}.
Aesthetic: Vogue Vietnam fashion editorial, youth culture, authentic silk embroidery, respectful traditional silhouette combined with modern streetwear aesthetics, soft studio portrait lighting, 8k resolution, elegant and photorealistic.`;

    if (!process.env.GEMINI_API_KEY) {
      return res.json({
        success: false,
        isFallback: true,
        error: 'Chưa cấu hình GEMINI_API_KEY.',
        prompt,
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: '3:4',
        },
      },
    });

    let imageUrl: string | null = null;
    const candidates = response.candidates;
    if (candidates && candidates[0]?.content?.parts) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (imageUrl) {
      return res.json({
        success: true,
        imageUrl,
        prompt,
        modelUsed: 'gemini-3.1-flash-lite-image',
        isFallback: false,
      });
    }

    return res.json({
      success: false,
      isFallback: true,
      error: 'Model không trả về định dạng ảnh inlineData.',
      prompt,
    });
  } catch (error: any) {
    console.error('Error generating outfit image via Gemini:', error);
    const errStr = String(error?.message || error || '');
    const isQuota =
      error?.status === 429 ||
      errStr.includes('429') ||
      errStr.includes('RESOURCE_EXHAUSTED') ||
      errStr.includes('quota') ||
      errStr.includes('Quota');

    const cleanMessage = isQuota
      ? 'Model tạo ảnh tạm hết lượt truy cập (Quota 429). Hệ thống đã chuyển sang ảnh phác thảo di sản dự phòng.'
      : 'Không thể kết nối model tạo ảnh Gemini lúc này. Đang dùng ảnh phác thảo di sản dự phòng.';

    return res.json({
      success: false,
      isFallback: true,
      error: cleanMessage,
    });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
