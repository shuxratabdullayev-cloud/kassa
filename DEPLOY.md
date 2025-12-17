# 🚀 GitHub'ga Yuklash - Tezkor Yo'riqnoma

## 📦 Tayyor Fayllar

Quyidagi **4 ta fayl** GitHub'ga yuklanadi:

1. ✅ **index.html** - Asosiy sahifa
2. ✅ **style.css** - Dizayn
3. ✅ **script.js** - Funksionallik  
4. ✅ **README.md** - Hujjatlar

---

## 🎯 Variant 1: Drag & Drop (ENG OSON!)

### Qadam 1: GitHub'da Repository Yaratish
1. [github.com](https://github.com) ga kiring
2. O'ng yuqorida **"+"** → **"New repository"**
3. To'ldiring:
   - **Repository name**: `naqd-kirim`
   - **Description**: "Kassaga naqd pul kirim order tizimi"
   - ✅ **Public** tanlang
   - ❌ Hech narsani belgilamang (README, .gitignore)
4. **"Create repository"** bosing

### Qadam 2: Fayllarni Yuklash
1. Yangi sahifada **"uploading an existing file"** linkini bosing
2. **Faqat 4 ta faylni** tortib tashlang:
   ```
   index.html
   style.css
   script.js
   README.md
   ```
3. Pastda **"Commit changes"** bosing

### Qadam 3: GitHub Pages Yoqish
1. Repository sahifasida **Settings** (yuqorida)
2. Chap menuda **Pages**
3. **Source** qismida:
   - Branch: **main**
   - Folder: **/ (root)**
4. **Save** bosing

### Qadam 4: Link Olish
2-3 daqiqadan keyin sahifani yangilang (F5):
```
✅ Your site is live at https://USERNAME.github.io/naqd-kirim/
```

**Bu linkni o'quvchilarga yuboring!** 🎉

---

## 💻 Variant 2: Terminal Orqali

```bash
# 1. Papkaga o'ting
cd c:\Users\Admin\.gemini\antigravity\playground\charged-intergalactic\naqd-kirim

# 2. Git'ni boshlang
git init

# 3. Fayllarni qo'shing
git add index.html style.css script.js README.md

# 4. Commit qiling
git commit -m "Naqd pul kirim order tizimi"

# 5. Branch o'zgartiring
git branch -M main

# 6. GitHub'ni ulang (USERNAME ni o'zingizniki bilan almashtiring!)
git remote add origin https://github.com/USERNAME/naqd-kirim.git

# 7. Yuklang
git push -u origin main
```

Keyin Settings > Pages > Branch: main > Save

---

## ✅ Tayyor!

**Sizning linkingiz:**
```
https://USERNAME.github.io/naqd-kirim/
```

O'quvchilar bu linkdan kirib, kassaga kirim orderlarini kiritishlari mumkin!

---

## 🔧 Muammolar?

### 404 Xatosi?
- ✅ Repository **Public** ekanligini tekshiring
- ✅ Fayllar to'g'ri yuklanganini tekshiring
- ✅ Pages yoqilganini tekshiring
- ⏰ 2-3 daqiqa kuting

### Git o'rnatilmaganmi?
[git-scm.com](https://git-scm.com) dan yuklab oling

---

**Versiya**: 2.0.0  
**Sana**: 2025-12-17
