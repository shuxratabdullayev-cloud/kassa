# Kassa

Professional kassaga naqd pul kirimini boshqarish va kuzatish uchun zamonaviy web ilova.

🔗 **Demo**: [GitHub Pages Link](https://USERNAME.github.io/naqd-kirim/)

## 🎯 Funksionalliklar

### Asosiy Imkoniyatlar
- ✅ Naqd pul kirim orderini qabul qilish
- ✅ Qabul raqami avtomatik generatsiya (KK-2025-0001)
- ✅ To'lovchi ma'lumotlari (F.I.O, telefon)
- ✅ Summa va to'lov maqsadi
- ✅ Debit va kredit schyotlari (to'liq buxgalteriya hisobi)
- ✅ Orderlarni ko'rish, tahrirlash, o'chirish
- ✅ Qabul chop etish (print)

### Statistika Dashboard
- 📊 Bugungi kirim summasi
- 📅 Oylik kirim summasi
- 💰 Jami kirim summasi
- 📝 Orderlar soni

### Buxgalteriya Schyotlari

**Debit Schyotlari (Kassaga Kirim):**
- **5010** - Kassa (milliy valyuta)
- **5020** - Kassa (xorijiy valyuta)
- **5110** - Hisob-kitob schyoti (bank)

**Kredit Schyotlari (Kirim Manbasi):**
- **4010** - Xaridorlar va buyurtmachilar qarzi
- **4220** - Hisobdot shaxslar bo'yicha bo'naklar
- **4230** - (Hisobdot shaxslar bo'yicha bo'naklar)
- **4310** - Yetkazib beruvchilarga berilgan bo'naklar
- **4720** - Xodimlarga berilgan ssudalar
- **4730** - Ayblor shaxslardan kannonmadlar
- **4890** - Boshqa qarzdorlar (jisqa, kommunal va h.k.)
- **5110** - Hisob-kitob schyoti (bank) - bankdan pul olinganda
- **6010** - Yetkazib beruvchilar qarzi
- **6310** - Xaridorlardan olingan bo'naklar
- **6410** - Byudjet bilan hisob-kitob
- **6710** - Mehnat haqi to'lovi
- **6990** - Boshqa to'lovlar (nafaqalar, moddiy yordam)
- **9010** - Tayyor mahsulot sotish
- **9020** - Tovarlar sotish
- **9030** - Xizmatlar va ishlar

## 🚀 Ishga Tushirish

### Lokal Kompyuterda

1. Repository'ni clone qiling:
   ```bash
   git clone https://github.com/USERNAME/naqd-kirim.git
   cd naqd-kirim
   ```

2. `index.html` faylini brauzerda oching
3. Tayyor! Hech qanday qo'shimcha o'rnatish kerak emas

### GitHub Pages'da Deploy

1. GitHub'da repository yarating (Public)
2. Fayllarni yuklang:
   ```bash
   git init
   git add .
   git commit -m "Naqd pul kirim tizimi"
   git branch -M main
   git remote add origin https://github.com/USERNAME/naqd-kirim.git
   git push -u origin main
   ```

3. Repository Settings > Pages:
   - Source: "Deploy from a branch"
   - Branch: "main" / Folder: "/ (root)"
   - Save

4. Link tayyor: `https://USERNAME.github.io/naqd-kirim/`

## 💻 Texnologiyalar

- **HTML5** - Semantic markup
- **CSS3** - Modern styling, green theme
- **Vanilla JavaScript** - No dependencies
- **LocalStorage API** - Ma'lumotlarni saqlash

## 📝 Foydalanish

### 1. Kirim Qabul Qilish
1. Formani to'ldiring:
   - To'lovchi F.I.O
   - Telefon (ixtiyoriy)
   - Summa
   - Sana
   - **Debit schyoti** (odatda 5010 - Kassa)
   - **Kredit schyoti** (kirim manbasiga qarab)
   - To'lov maqsadi
   - Izoh (ixtiyoriy)
2. "Kirim Qabul Qilish" tugmasini bosing
3. Qabul raqami avtomatik beriladi

### 2. Qabul Chop Etish
1. Jadvalda "🖨️" tugmasini bosing
2. Qabul ma'lumotlarini ko'ring
3. "Chop Etish" tugmasini bosing

### 3. Statistika
Dashboard'da avtomatik ko'rsatiladi:
- Bugungi kirim
- Oylik kirim
- Jami kirim
- Orderlar soni

## 🎨 Dizayn Xususiyatlari

- Yashil rang sxemasi (pul kirim uchun)
- Dark mode
- Glassmorphism effects
- Smooth animations
- Professional kassa dizayni
- Responsive (mobil va desktop)

## 📱 Brauzer Qo'llab-quvvatlash

- Chrome (tavsiya etiladi)
- Firefox
- Safari
- Edge
- Opera

## 🔒 Ma'lumotlar Xavfsizligi

Ma'lumotlar faqat brauzeringizda LocalStorage'da saqlanadi. Hech qanday server yoki tashqi xizmatga yuborilmaydi.

## 📄 Litsenziya

MIT License - Erkin foydalanish uchun

## 🤝 Hissa Qo'shish

Pull request'lar qabul qilinadi! Katta o'zgarishlar uchun avval issue oching.

---

**Eslatma**: Bu ilova to'liq offline ishlaydi va internet talab qilmaydi (faqat Google Fonts yuklanishi uchun).

**Versiya**: 2.0.0  
**Sana**: 2025-12-17  
**Yangilanish**: To'liq buxgalteriya schyotlari qo'shildi
