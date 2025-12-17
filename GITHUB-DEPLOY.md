# GitHub'ga Yuklash Yo'riqnomasi

## 📦 Kerakli Fayllar

Quyidagi fayllar GitHub'ga yuklanadi:

```
naqd-kirim/
├── index.html          # Asosiy sahifa
├── style.css           # Dizayn
├── script.js           # Funksionallik
└── README.md           # Hujjatlar
```

## 🚀 GitHub'ga Yuklash (3 Qadam)

### Qadam 1: GitHub'da Repository Yaratish

1. [github.com](https://github.com) ga kiring
2. O'ng yuqori burchakda **"+"** → **"New repository"**
3. Quyidagilarni to'ldiring:
   - **Repository name**: `naqd-kirim`
   - **Description**: "Kassaga naqd pul kirim orderini boshqarish tizimi"
   - **Public** tanlang ✅
   - **Initialize this repository with:** hech narsani belgilamang ❌
4. **"Create repository"** tugmasini bosing

### Qadam 2: Fayllarni Yuklash

**Variant A - Terminal orqali (Tavsiya etiladi):**

```bash
# 1. Papkaga o'ting
cd c:\Users\Admin\.gemini\antigravity\playground\charged-intergalactic\naqd-kirim

# 2. Git'ni boshlang
git init

# 3. Barcha fayllarni qo'shing
git add .

# 4. Commit qiling
git commit -m "Naqd pul kirim order tizimi - birinchi versiya"

# 5. Branch nomini o'zgartiring
git branch -M main

# 6. GitHub repository'ni ulang (URL'ni o'zingizniki bilan almashtiring!)
git remote add origin https://github.com/SIZNING-USERNAME/naqd-kirim.git

# 7. GitHub'ga yuklang
git push -u origin main
```

**Variant B - Drag & Drop (Oson usul):**

1. GitHub'dagi yangi repository sahifasida **"uploading an existing file"** linkini bosing
2. Quyidagi fayllarni tortib tashlang:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
3. **"Commit changes"** tugmasini bosing

### Qadam 3: GitHub Pages'ni Yoqish

1. Repository sahifasida **Settings** (yuqori o'ng tomonda)
2. Chap menuda **Pages** ni bosing
3. **Source** qismida:
   - **Deploy from a branch** tanlang
   - **Branch**: `main` tanlang
   - **Folder**: `/ (root)` tanlang
4. **Save** tugmasini bosing

### Qadam 4: Link Olish

2-3 daqiqadan keyin sahifani yangilang (F5). Yuqori qismida yashil xabar paydo bo'ladi:

```
✅ Your site is live at https://SIZNING-USERNAME.github.io/naqd-kirim/
```

Bu linkni nusxalang va o'quvchilarga yuboring! 🎉

## 🔧 Muammolarni Hal Qilish

### Git o'rnatilmaganmi?

```bash
# Git versiyasini tekshiring
git --version
```

Agar xato bersa: [git-scm.com](https://git-scm.com) dan yuklab oling

### 404 Xatosi?

1. **Fayllar to'g'ri yuklandimi?** - Repository → Code tab → fayllarni ko'ring
2. **Repository Public mi?** - Settings → General → "Public" yozuvi
3. **Pages yoqilganmi?** - Settings → Pages → Branch: main
4. **2-3 daqiqa kuting** - Deploy qilish vaqt oladi

### Username qayerda?

GitHub profilingizga o'ting - URL'da ko'rsatilgan: `github.com/USERNAME`

## 📝 Keyingi O'zgarishlar

Fayllarni o'zgartirganingizdan keyin:

```bash
cd c:\Users\Admin\.gemini\antigravity\playground\charged-intergalactic\naqd-kirim
git add .
git commit -m "O'zgarishlar tavsifi"
git push
```

2-3 daqiqadan keyin GitHub Pages avtomatik yangilanadi.

## ✅ Tayyor!

Sizning linkingiz:
```
https://SIZNING-USERNAME.github.io/naqd-kirim/
```

Bu linkni o'quvchilarga yuboring va ular kassaga kirim orderlarini kiritishlari mumkin! 🚀
