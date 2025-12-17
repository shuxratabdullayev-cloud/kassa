# Debit va Kredit Schyotlari Qo'shildi

## ✅ Yangilanishlar

### Qo'shilgan Maydonlar

1. **Debit Schyoti** (Majburiy)
   - 5010 - Kassa (milliy valyuta)
   - 5020 - Kassa (xorijiy valyuta)

2. **Kredit Schyoti** (Majburiy)
   - 4010 - Sotuvdan tushgan mablag'lar
   - 4020 - Xizmat ko'rsatishdan tushgan mablag'lar
   - 6610 - Qarz olish
   - 6710 - Boshqa kreditorlar
   - 9010 - Ustav kapitali
   - 9110 - Qo'shimcha kapital

### O'zgarishlar

#### HTML (index.html)
- ✅ Formaga debit va kredit select maydonlari qo'shildi
- ✅ Jadval headeriga Debit va Kredit ustunlari qo'shildi
- ✅ Edit modalga debit va kredit maydonlari qo'shildi
- ✅ Telefon ustuni o'chirildi (debit/kredit uchun joy)

#### JavaScript (script.js)
- ✅ Debit va kredit inputlarni initializeElements'ga qo'shildi
- ✅ handleAddReceipt'da debit/kredit saqlanadi
- ✅ handleEditReceipt'da debit/kredit yangilanadi
- ✅ openEditModal'da debit/kredit ko'rsatiladi
- ✅ renderReceipts'da debit/kredit jadvalda ko'rsatiladi
- ✅ generatePrintContent'da debit/kredit qabulda chop etiladi

### Qonun Talabiga Muvofiqlik

✅ **Korespondentsiya schyoti** - Har bir kirim uchun debit va kredit schyotlari ko'rsatiladi
✅ **Buxgalteriya hisobi** - To'liq qo'sh yozuv tizimi
✅ **Qabul chop etish** - Debit va kredit schyotlari qabulda ko'rsatiladi

## 📊 Jadval Strukturasi

| Qabul № | To'lovchi | Summa | **Debit** | **Kredit** | Maqsad | Sana | Amallar |
|---------|-----------|-------|-----------|------------|--------|------|---------|

## 🖨️ Qabul Formati

Chop etiladigan qabulda quyidagilar ko'rsatiladi:
- Qabul raqami
- To'lovchi F.I.O
- Telefon (agar mavjud)
- Summa
- **Debit schyoti**
- **Kredit schyoti**
- To'lov maqsadi
- Sana
- Izoh
- Kassir imzosi

## 🎯 Foydalanish

Yangi kirim qo'shishda:
1. Barcha maydonlarni to'ldiring
2. **Debit schyotini tanlang** (odatda 5010 - Kassa)
3. **Kredit schyotini tanlang** (kirim manbasiga qarab)
4. "Kirim Qabul Qilish" tugmasini bosing

---

**Eslatma**: Debit va kredit schyotlari majburiy maydonlar. Ularni tanlamasdan kirim qabul qilish mumkin emas.
