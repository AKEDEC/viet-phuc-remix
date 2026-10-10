import React from 'react';
import { STUDENT_RENTAL_HUBS } from '../data/vietPhucData';
import { MapPin, BookOpen, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export const GuideView: React.FC = () => {
  const dictionary = [
    { term: 'Áo Dài', def: 'Quốc phục phát triển từ áo ngũ thân, tà dài thướt tha, biểu trưng cho vẻ đẹp đoan trang và uyển chuyển của người phụ nữ Việt Nam.' },
    { term: 'Áo Tứ Thân', def: 'Trang phục dân gian Bắc Bộ gồm 4 thân tượng trưng tứ thân phụ mẫu, 2 vạt trước buộc chéo trước bụng, để lộ yếm đào e ấp.' },
    { term: 'Áo Ngũ Thân', def: 'Chuẩn mực quốc phục thời Nguyễn, 5 thân áo biểu thị đạo hiếu gia đình, nẹp cổ cài 5 khuy hữu tượng trưng cho Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín).' },
    { term: 'Áo Bà Ba', def: 'Trang phục mộc mạc Nam Bộ sông nước, áo cánh ngắn chẻ tà hông, cổ tròn, 2 túi trước, đi cùng khăn rằn và nón lá đôn hậu.' },
    { term: 'Áo Nhật Bình', def: 'Thường phục cung đình Huế của hoàng tộc triều Nguyễn, cổ hình chữ nhật phẳng và dải ngũ hành rực rỡ ở cửa tay.' },
    { term: 'Khuy Hữu', def: 'Quy tắc cài cúc về phía bên phải người mặc, chuẩn mực tôn ti bất biến của y phục truyền thống Việt Nam.' },
  ];

  const rules = [
    {
      title: 'Luôn gài khuy sang bên phải (Khuy Hữu)',
      desc: 'Tuyệt đối không may hoặc gài vạt áo sang bên trái (vì vạt trái xưa kia chỉ dùng trong trang phục ma chay tang chế).',
    },
    {
      title: 'Tôn trọng độ dài tà áo khi sải bước',
      desc: 'Khi mặc Áo Tấc hay Giao Lĩnh tà dài, hãy nâng nhẹ gấu áo khi lên xuống cầu thang hoặc ngồi xuống ghế giảng đường để tránh giẫm rách tà.',
    },
    {
      title: 'Tự tin remix nhưng giữ sự trang nhã',
      desc: 'Gen Z hoàn toàn có thể phối sneaker, quần jeans hay áo thun bên trong, miễn sao tổng thể hài hòa, không lố lăng hay báng bổ văn hóa.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
          <span>Cẩm nang sinh viên</span>
          <span aria-hidden="true">·</span>
          <span>Bảo tồn di sản</span>
          <span aria-hidden="true">·</span>
          <span>Bản đồ thuê giá tốt</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
          Cẩm nang Việt phục & Địa chỉ thuê giá sinh viên
        </h2>
        <p className="text-sm text-stone-600 max-w-2xl">
          Tất cả những gì một sinh viên Gen Z cần biết khi lần đầu diện cổ phục: mẹo mặc đúng lễ nghi, từ điển thuật ngữ và các tiệm cho thuê uy tín quanh làng đại học.
        </p>
      </div>

      {/* 1. Mẹo mặc đúng lễ nghi */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>3 Nguyên Tắc Vàng Khi Diện Cổ Phục</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {rules.map((rule, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-stone-200 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{rule.title}</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {rule.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Địa chỉ tiệm thuê quanh các trường ĐH */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-rose-600" />
          <span>Bản Đồ Thuê Cổ Phục Sinh Viên Theo Khu Vực</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {STUDENT_RENTAL_HUBS.map((hub, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-stone-200 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-base font-bold text-stone-900">{hub.city}</h4>
                  <span className="text-[11px] font-medium text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                    Quanh Campus
                  </span>
                </div>

                <p className="text-xs text-stone-500 mb-3">
                  <strong className="text-stone-700">Trường lân cận: </strong>{hub.campusNearby}
                </p>

                {/* Shop list */}
                <div className="space-y-2 mb-4">
                  {hub.shops.map((shop, sIdx) => (
                    <div key={sIdx} className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-xs">
                      <div className="flex items-center justify-between font-semibold text-stone-800">
                        <span>{shop.name}</span>
                        <span className="text-rose-700 font-mono">{shop.price}</span>
                      </div>
                      <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">
                        🎁 {shop.discount}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 leading-snug">
                <strong className="font-semibold">Lưu ý sinh viên: </strong>{hub.tips}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Từ điển thuật ngữ nhanh */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-rose-600" />
          <span>Từ Điển Thuật Ngữ Cổ Phục Siêu Tốc</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {dictionary.map((d, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white border border-stone-200 text-xs space-y-1">
              <span className="font-bold text-rose-800">{d.term}</span>
              <p className="text-stone-600 leading-snug text-[11px]">{d.def}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
