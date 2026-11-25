# Rancangan Implementasi — SpendIQ Landing Page

> Sumber desain: Figma **Speedtest** → frame `landing page` (node `4148:1290`, 1440 × 8323 px, tema gelap).
> Stack: **Vite + HTML + CSS + JavaScript (vanilla)**, animasi dengan **GSAP** (+ ScrollTrigger) dan smooth scroll dengan **Lenis**.
> Status: **rancangan** — belum ada kode. Dokumen ini disetujui dulu sebelum implementasi.

---

## 1. Tujuan

1. Menerjemahkan desain Figma menjadi landing page statis yang **pixel-close** di desktop 1440 px.
2. **Responsif** ke tablet & mobile (desain Figma hanya desktop, jadi layout mobile kita rancang sendiri mengikuti gaya yang sama).
3. Gerakan halus dan "premium": smooth scroll (Lenis), reveal on scroll, teks bergradien, counter angka, carousel, accordion — tanpa mengorbankan performa & aksesibilitas.
4. Tanpa framework UI (tanpa React/Tailwind). CSS murni dengan custom properties.

**Di luar cakupan:** backend, autentikasi, form newsletter yang benar-benar mengirim data (cukup validasi + state sukses di front-end), halaman selain landing page.

---

## 2. Tech Stack & Dependensi

| Paket | Fungsi |
|---|---|
| `vite` | dev server + build |
| `gsap` | animasi; plugin `ScrollTrigger` (dan opsional `SplitText` — sejak GSAP 3.13 semua plugin gratis) |
| `lenis` | smooth scroll (paket baru, bukan `@studio-freight/lenis`) |

Font (self-host via `@fontsource` atau Google Fonts):
- **Inter** — 400, 500, 600, 700
- **Instrument Serif** — 400 Regular & 400 Italic

```bash
npm create vite@latest . -- --template vanilla
npm i gsap lenis
npm i @fontsource/inter @fontsource/instrument-serif   # opsional, untuk self-host
```

---

## 3. Struktur Folder

```
spendIQ-studio/
├── index.html                 # semua markup section (semantic HTML)
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.js                # entry: import CSS, init Lenis, init semua modul
    ├── styles/
    │   ├── tokens.css         # warna, font, spacing, radius, shadow (CSS variables)
    │   ├── base.css           # reset, typography, utility (.container, .eyebrow, .title-serif)
    │   ├── components.css     # button, card, badge, pill, accordion, icon-box
    │   └── sections/
    │       ├── announcement.css
    │       ├── navbar.css
    │       ├── hero.css
    │       ├── stats.css
    │       ├── problem.css
    │       ├── features.css   # "Meet SpendIQ" bento grid
    │       ├── testimonial.css
    │       ├── pricing.css
    │       ├── how-it-works.css
    │       ├── logos.css
    │       ├── faq.css
    │       └── cta-footer.css
    ├── js/
    │   ├── lenis.js           # setup Lenis + sinkronisasi ke GSAP ticker & ScrollTrigger
    │   ├── animations/
    │   │   ├── hero.js
    │   │   ├── reveal.js      # reveal generik berbasis data-attribute
    │   │   ├── counters.js    # stats 50K+, 2.4M+, dst.
    │   │   ├── bars.js        # bar chart di dashboard mockup
    │   │   ├── steps.js       # progress line "How It Works"
    │   │   └── marquee.js     # logo strip berjalan
    │   └── components/
    │       ├── navbar.js      # sticky/blur on scroll + menu mobile + anchor scroll
    │       ├── carousel.js    # testimonial
    │       ├── accordion.js   # FAQ
    │       ├── newsletter.js  # validasi email
    │       └── back-to-top.js
    └── assets/
        ├── icons/             # SVG dari Figma (arrow, check, ikon problem, sosial, dll.)
        ├── logos/             # Netflix, Spotify, Amazon, Adobe, Google, Microsoft, Dropbox, Canva
        ├── images/            # avatar, foto profil, tekstur noise/grain
        └── brand/             # logo SpendIQ
```

---

## 4. Design Tokens (dari Figma)

File Figma **tidak memiliki Variables**, jadi token diambil dari nilai yang dipakai langsung di layer.

### 4.1 Warna

```css
:root {
  /* surface */
  --bg:            #111111;   /* latar halaman */
  --surface-1:     #161616;   /* kartu (pricing, feature) */
  --surface-2:     #1c1c22;   /* kartu dashboard / input */
  --surface-btn:   #292a36;   /* tombol sekunder "Get Started" (Free) */
  --navy:          #081636;   /* border tombol outline, ujung gradien */
  --blue-glow:     #2b3f8f;   /* glow biru di testimonial / hero (perkiraan, cek ulang) */

  /* teks */
  --text:          #ffffff;
  --text-muted:    rgba(255,255,255,.6);
  --text-subtle:   rgba(255,255,255,.4);
  --border:        rgba(255,255,255,.1);
  --border-strong: rgba(255,255,255,.4);

  /* aksen */
  --orange:        #ff8e43;
  --purple:        #705eff;
  --blue:          #3d7bff;   /* bar chart aktif, ikon (perkiraan) */
  --success:       #22c55e;   /* check icon, "Active", +$30.00 */
  --danger:        #ef4444;   /* -$19.99, iCloud */
  --warning:       #f5b33d;   /* "Unpaid" */

  /* gradien teks serif (judul baris ke-2) */
  --grad-serif: linear-gradient(104deg, var(--orange) 10%, var(--purple) 65%);
  /* gradien border tombol outline */
  --grad-border: linear-gradient(90deg, #f4c7a1, #ffffff 40%, #b9a6ff);
}
```

> Catatan: Figma menyertakan stop navy (`#081636`) di kedua ujung gradien teks; di web efeknya hampir tak terlihat di latar gelap, jadi disederhanakan menjadi orange → purple. Nilai bertanda *perkiraan* dicek ulang dengan `get_design_context` saat implementasi section terkait.

### 4.2 Tipografi

| Token | Font | Size / Line-height / Tracking | Dipakai di |
|---|---|---|---|
| `--fs-display` | Inter 500 | 72px / 1 / -0.06em | Judul hero baris 1 |
| `--fs-display-serif` | Instrument Serif Italic | 84px / 1 | "Subscription." |
| `--fs-h2` | Inter 500 | 64px / 1 / -0.06em | Judul section |
| `--fs-h2-serif` | Instrument Serif Italic | 72px / 1 / -0.04em | Baris ke-2 judul section |
| `--fs-stat` | Instrument Serif 400 | ~48px | 50K+, 2.4M+, angka step 01–04, "Free"/"Pro" |
| `--fs-h3` | Inter 500 | 24px | Judul kartu, harga |
| `--fs-body` | Inter 400 | 16px / 1.4 | Paragraf |
| `--fs-eyebrow` | Inter 400 | 14px / tracking 0.08em, uppercase | "THE PROBLEM", "SIMPLE PRICING" |
| `--fs-btn` | Inter 700 | 14px / 20px / -0.02em | Tombol |

Di mobile, judul diskalakan dengan `clamp()` (mis. `--fs-h2: clamp(40px, 6vw, 64px)`).

### 4.3 Spacing, Radius, Layout

- Container: **max-width 1280px**, padding samping **80px** (desktop) → 40px (tablet) → 20px (mobile).
- Padding vertikal section: **140px atas / 120px bawah** (desktop) → ±80px (mobile).
- Gap judul: eyebrow → judul **24px**, baris judul **16px**, judul → konten **72px**.
- Radius: kartu **20px**, tombol & pill **100px**, icon box **12px**.
- Tombol: padding **18px 32px**.

### 4.4 Pola visual berulang (dibuat sebagai komponen CSS)

| Komponen | Deskripsi |
|---|---|
| `.title` + `.title__serif` | Judul dua baris: Inter putih + Instrument Serif Italic bergradien (`background-clip: text`) |
| `.eyebrow` | Label kecil uppercase |
| `.btn--primary` | Putih solid, teks hitam (navbar "Get Started", "Subscribe") |
| `.btn--outline` | Transparan + **border gradien** (pseudo-element dengan `mask`) — "Start Free Trial", "View All Reviews", "Contact Support", "Get Started" CTA |
| `.btn--ghost` | `--surface-btn` solid (Free plan, "Sign In") |
| `.btn--icon` | Lingkaran 60px dengan border gradien (panah carousel, back-to-top) |
| `.card` | `--surface-1`, radius 20, border tipis |
| `.glow` | Radial gradient biru/ungu + tekstur grain (hero, testimonial, Pro card, CTA) |
| `.badge` | Pill kecil ("Most Popular", "NEW", "Active", "Unpaid") |

---

## 5. Rancangan Per Section

Setiap section: `<section id="..." class="section section--xxx">` + node Figma sebagai referensi.

### 5.1 Announcement Bar — `4148:1291`
- Teks: *"Take control of your subscriptions. Start your free trial today."* + link **Get Started →**.
- Latar gradien oranye/ungu/biru tipis.
- **Interaksi:** bisa ditutup (opsional, tombol ×). Hover link: panah bergeser 4px.

### 5.2 Navbar — `4148:1297`
- Logo SpendIQ · menu (Product, Features, How It Works, Pricing, Resources) · tombol **Sign In** (ghost) & **Get Started** (primary).
- **Interaksi:**
  - Sticky; saat scroll > 40px latar menjadi `rgba(17,17,17,.7)` + `backdrop-filter: blur(12px)`.
  - Hide saat scroll ke bawah, muncul saat scroll ke atas (GSAP, dibaca dari arah scroll Lenis).
  - Link menu → `lenis.scrollTo('#section', { offset: -80 })`.
  - Mobile (< 900px): menu jadi hamburger → panel fullscreen, animasi stagger link.

### 5.3 Hero — `4148:1313` (judul `4148:3581`, dashboard `4148:2447`)
- Judul *"Take Control of Every **Subscription.**"*, paragraf, tombol **Start Free Trial →**.
- **Mockup dashboard** di bawahnya (sidebar, Total Monthly Recurring Spend $284.50, Account Balance $3,842.75, Annual Spending History, Transaction History).
- **Keputusan:** mockup dibangun dengan **HTML/CSS** (bukan gambar) supaya bisa dianimasikan (bar chart tumbuh, angka menghitung, tooltip "June 2025"). Bagian yang terlalu detail (avatar, logo Netflix/iCloud) memakai aset dari Figma.
- Glow biru di belakang dashboard + fade ke latar bawah (`Rectangle 921767`).
- Layer tersembunyi di Figma (*ZenBook Duo 14*, *Product name*) **tidak** diimplementasikan.
- **Animasi:**
  - Intro (on load): judul baris 1 naik per kata (SplitText / span manual), "Subscription." fade + blur → tajam, paragraf & tombol stagger.
  - Dashboard: masuk dari bawah dengan sedikit `rotateX` (perspektif) → datar saat di-scroll (ScrollTrigger `scrub`).
  - Bar chart tumbuh dari bawah (stagger), angka $284.50 & $3,842.75 count-up.
- Mobile: dashboard diskalakan (`transform: scale`) atau dipotong dengan overflow, sidebar disembunyikan.

### 5.4 Stats — `4148:3588`
- 4 kolom: **50K+** Registered users · **2.4M+** Subscriptions tracked · **180K+** Bills monitored monthly · **120+** Countries reached.
- **Animasi:** counter 0 → nilai saat masuk viewport (sekali saja). Mobile: grid 2×2.

### 5.5 The Problem — `4148:3602`
- Kiri: eyebrow "THE PROBLEM", judul *"Recurring Expenses **Shouldn't Be a Blind Spot.**"*, paragraf.
- Kanan: 4 kartu, ikon **bergantian kiri/kanan** (zig-zag):
  1. Too Many Subscriptions (ikon kiri)
  2. Unexpected Charges (ikon kanan)
  3. No Clear Overview (ikon kiri)
  4. Missed Savings (ikon kanan)
- **Animasi:** kolom kiri dipin sebentar (opsional) sementara kartu masuk satu per satu dari kanan dengan stagger. Hover kartu: border lebih terang + ikon sedikit naik.
- Mobile: tumpuk vertikal, ikon selalu di kiri.

### 5.6 Meet SpendIQ (Features bento) — `4148:3656`
- Eyebrow "MEET SPENDIQ", judul *"Your Entire Subscription Life **In One Place.**"*, paragraf tengah.
- Grid bento: baris 1 = 2 kartu (lebar ~ 738 / 522), baris 2 = 3 kartu sama lebar.
  1. **Monthly Recurring Spend** — mini-card $284.50 + toast "You have unpaid subscriptions!"
  2. **Spending History** — mini bar chart + tooltip June 2025
  3. **Subscription List** — Netflix / Spotify (item terangkat) / Adobe CC
  4. **Transaction Track** — progress bar + daftar transaksi
  5. **Account Balance** — $3,842.75, 800 points, Pay Bills / Manage Subs
- Mini-UI dibuat dengan HTML/CSS (memakai ulang komponen dari dashboard hero).
- **Animasi:** kartu reveal stagger; saat hover → mini-UI "hidup" (bar tumbuh, item Spotify terangkat, toast muncul). Glow mengikuti kursor (CSS var `--mx/--my`).
- Mobile: 1 kolom.

### 5.7 Testimonial — `4148:4050`
- Ikon kutip, kutipan Sarah Mitchell (Product Designer), rating **4.9 ★**, panah kiri/kanan, tombol **View All Reviews**. Slide samping terlihat pudar (peek).
- **Data:** di Figma ketiga slide berisi teks yang sama → siapkan array `testimonials` di JS (isi placeholder 3–5 item sampai copy final tersedia).
- **Interaksi (carousel.js):** prev/next, keyboard ←/→, swipe (pointer events), autoplay 6 detik yang berhenti saat hover/fokus. Transisi GSAP (`xPercent` + opacity). `aria-live="polite"`.
- Latar: glow biru radial + grain.

### 5.8 Pricing — `4148:4106`
- Eyebrow "SIMPLE PRICING", judul *"Everything You Need **One Simple Plan.**"* (rata kiri).
- 2 kartu 630px:
  - **Free — $0 /month** · tombol **Get Started** (ghost) · Track up to 5 subscriptions, Billing reminders, Monthly spending overview, Basic spending insights.
  - **Pro — $9.99 /month** · badge **Most Popular** · glow biru di pojok kiri atas · tombol **Start Free Trial** (outline gradien) · Unlimited subscriptions, Unlimited transaction history, Advanced spending analytics, Custom savings plans, Smart savings recommendations, Advanced payment reminders.
- **Animasi:** kartu reveal; harga count-up kecil; hover Pro: glow bergeser.
- *(Opsional, tidak ada di desain)* toggle Monthly/Yearly — **tidak** dibuat kecuali diminta.

### 5.9 How It Works — `4148:4188`
- Eyebrow "HOW IT WORKS", judul *"Get Your Subscriptions **Under Control in Minutes**"*.
- 4 step bernomor (01–04) dihubungkan garis; garis aktif bergradien biru-ungu.
- Kartu: **Connect**, **Discover**, **Organize**, **Save** (kartu aktif punya border lebih terang).
- **Animasi:** section dipin, progress line terisi mengikuti scroll (ScrollTrigger `scrub`), step & kartu aktif berganti 01 → 04. Mobile: tanpa pin, garis vertikal.

### 5.10 Logo Strip — `4148:4222`
- Judul kecil *"Works With the Services You Already Use"*.
- Logo: Netflix, Spotify, Amazon, Adobe, Google, Microsoft, Dropbox, Canva (abu-abu, fade di kiri/kanan dengan mask gradien).
- **Animasi:** marquee tak berujung (GSAP `xPercent` loop, kecepatan sedikit naik mengikuti velocity scroll Lenis). Pause saat hover.

### 5.11 FAQ — `4148:4260`
- Kiri: eyebrow "FAQ", judul *"Frequently Asked **Questions**"*, paragraf, tombol **Contact Support**.
- Kanan: accordion 6 item; item pertama terbuka default (latar glow biru).
  1. What is SpendIQ? *(jawaban ada di desain)*
  2. Can I track all of my subscriptions?
  3. Does SpendIQ automatically detect subscriptions?
  4. Can SpendIQ help me save money?
  5. Is my financial information secure?
  6. Can I cancel anytime?
- **Jawaban 2–6 tidak ada di Figma** → ditulis placeholder yang wajar, ditandai `<!-- TODO copy -->`.
- **Interaksi (accordion.js):** satu item terbuka pada satu waktu; tinggi dianimasikan dengan GSAP (`height: auto`), chevron berputar 180°. Markup memakai `<button aria-expanded aria-controls>` + region. Setelah buka/tutup panggil `ScrollTrigger.refresh()` / `lenis.resize()`.

### 5.12 Final CTA + Footer — `4148:4305`
- CTA: *"Stop Losing Money to **Subscriptions You Forget About.**"* (baris 2 serif putih), paragraf, tombol **Get Started →**. Latar glow ungu/biru/oranye besar.
- Footer:
  - Kiri: logo, tagline, form newsletter (input email + **Subscribe**).
  - Kolom: **Product** (Dashboard, Subscriptions, Spending Insights, Savings Plan, Billing Calendar, Integrations) · **Company** (About, Careers, Contact, Partners) · **Resources** (Help Center, Blog, Guides, FAQs) · **Legal** (Privacy Policy, Terms of Service, Security).
  - Tombol back-to-top bulat → `lenis.scrollTo(0)`.
  - Bawah: "© 2026 SpendIQ. All rights reserved." + "Follow our social:" Facebook, Instagram, YouTube, TikTok, X.
- **Animasi:** glow CTA bergerak pelan (parallax `yPercent` saat scroll); judul reveal per baris.
- **Newsletter:** validasi format email, state sukses "Thanks for subscribing!" — tanpa request ke server.

---

## 6. Arsitektur Animasi (GSAP + Lenis)

### 6.1 Setup Lenis ↔ GSAP (`src/js/lenis.js`)

```js
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

- Satu loop RAF (milik GSAP) — **jangan** memanggil `requestAnimationFrame` terpisah untuk Lenis.
- Import CSS bawaan `lenis/dist/lenis.css`.
- Semua anchor link & back-to-top memakai `lenis.scrollTo`.

### 6.2 Reveal generik berbasis data-attribute

```html
<h2 data-reveal="lines">...</h2>
<div data-reveal="fade-up" data-reveal-delay="0.1">...</div>
<ul data-reveal="stagger">...</ul>
```

`reveal.js` mencari semua `[data-reveal]` dan membuat ScrollTrigger (`start: 'top 85%'`, `once: true`). Varian: `fade-up`, `lines`, `words`, `stagger`, `scale`.

### 6.3 Daftar animasi per section

| Section | Jenis | Trigger |
|---|---|---|
| Hero | intro timeline (judul per kata, serif blur-in, tombol) | load |
| Hero dashboard | rotateX → 0, scale 0.92 → 1 | scroll `scrub` |
| Dashboard bars & angka | tumbuh + count-up | masuk viewport |
| Stats | counter | masuk viewport, `once` |
| Problem | kartu stagger dari kanan | masuk viewport |
| Features | kartu stagger + hover micro-interaction | viewport / hover |
| Testimonial | slide transisi | klik / autoplay |
| Pricing | kartu reveal | viewport |
| How It Works | progress line + step aktif | pin + `scrub` |
| Logo strip | marquee loop + velocity boost | terus-menerus |
| FAQ | height accordion | klik |
| CTA | parallax glow | scroll `scrub` |
| Navbar | hide/show + blur | arah scroll |

### 6.4 Aturan performa & aksesibilitas

- Hanya animasikan `transform` dan `opacity` (plus `filter: blur` singkat di intro).
- `gsap.matchMedia()`:
  - `(prefers-reduced-motion: reduce)` → Lenis **tidak** diinisialisasi, semua reveal langsung tampil, marquee & autoplay berhenti.
  - `(max-width: 899px)` → matikan pin "How It Works" & efek 3D dashboard.
- Elemen yang akan di-reveal disembunyikan lewat class `.js-ready` di `<html>` (agar tanpa JS konten tetap terlihat).
- `ScrollTrigger.refresh()` setelah font selesai dimuat (`document.fonts.ready`) dan setelah gambar besar load.

---

## 7. Responsif

| Breakpoint | Lebar | Perubahan utama |
|---|---|---|
| Desktop | ≥ 1200px | Sesuai Figma (container 1280) |
| Laptop | 900–1199px | Padding 40px, judul `clamp()`, bento tetap 2+3 tapi lebih rapat |
| Tablet | 600–899px | Navbar hamburger, Problem & FAQ 1 kolom, bento 2 kolom, pricing 1 kolom |
| Mobile | < 600px | Semua 1 kolom, stats 2×2, steps vertikal, footer kolom 2×2, dashboard hero diskalakan |

Pendekatan: **desktop-first** (karena sumbernya desktop), memakai `max-width` media query.

---

## 8. Aset dari Figma

Diekspor ke `src/assets/` lewat Figma MCP (`get_design_context` / `download_assets`), **tidak** memakai URL sementara Figma (kedaluwarsa 7 hari).

| Aset | Format | Sumber |
|---|---|---|
| Logo SpendIQ | SVG | navbar `4148:1298`, footer |
| Ikon UI (arrow-right, chevron, check, settings, bell, search, dll.) | SVG | vuesax / ep icons |
| Ikon kartu Problem (4) | SVG/PNG | `4148:3603` |
| Ikon kutip | SVG | `4148:4097` |
| Logo partner (8) | SVG | `4148:4224` |
| Ikon sosial (5) | SVG | footer |
| Avatar (Miles Abernathy, Sarah Mitchell) | WebP | hero, testimonial |
| Logo layanan (Netflix, Spotify, Adobe, iCloud) | SVG/PNG | mockup dashboard |
| Tekstur grain / glow | PNG/WebP atau CSS | hero, testimonial, Pro card, CTA |

Gambar raster dioptimalkan ke WebP, diberi `width`/`height` eksplisit dan `loading="lazy"` (kecuali hero).

> ⚠️ Logo merek pihak ketiga (Netflix, Spotify, dll.) dipakai apa adanya dari desain sebagai mockup; untuk produksi, pastikan penggunaannya sesuai pedoman merek masing-masing.

---

## 9. Aksesibilitas & SEO

- Struktur heading: satu `<h1>` (hero), `<h2>` per section, `<h3>` di kartu.
- Judul dua baris = satu elemen heading (`<h2>Everything You Need <em class="title__serif">One Simple Plan.</em></h2>`), bukan dua heading.
- Semua tombol ikon punya `aria-label`; ikon dekoratif `aria-hidden="true"`.
- Fokus terlihat (`:focus-visible`) dengan outline ungu.
- Kontras teks muted (60% putih di #111) ≈ 7:1 — aman.
- Mockup dashboard = dekoratif → `aria-hidden="true"` + satu `aria-label` deskriptif di wrapper (`role="img"`).
- `<title>`, meta description, Open Graph, favicon.

---

## 10. Tahapan Implementasi

| # | Tahap | Hasil |
|---|---|---|
| 0 | Setup Vite, install `gsap` + `lenis`, struktur folder, font | `npm run dev` jalan |
| 1 | `tokens.css`, `base.css`, `components.css` (button, card, badge, title) | Halaman contoh komponen |
| 2 | Ekspor & simpan aset dari Figma | `src/assets/*` lengkap |
| 3 | Markup + CSS statis semua section, urut dari atas (announcement → footer) | Halaman statis mirip Figma di 1440px |
| 4 | Responsif (laptop → tablet → mobile) | Layout rapi di 375 / 768 / 1024 / 1440 |
| 5 | Interaksi: navbar, accordion, carousel, newsletter, back-to-top | Semua elemen interaktif berfungsi tanpa animasi |
| 6 | Lenis + GSAP: setup, reveal generik, animasi khusus per section | Gerakan lengkap |
| 7 | Reduced-motion, performa (Lighthouse), aksesibilitas (keyboard, screen reader) | Skor Lighthouse ≥ 90 semua kategori |
| 8 | Verifikasi visual vs Figma per section, perbaikan | Selesai |

Setiap tahap 3 dibandingkan dengan screenshot Figma per node (tabel di §5).

---

## 11. Kriteria Selesai

- [ ] Di 1440px, setiap section secara visual cocok dengan Figma (spacing, ukuran font, warna, aset).
- [ ] Tidak ada URL aset Figma sementara di kode.
- [ ] Tidak ada horizontal scroll di 375px.
- [ ] Smooth scroll Lenis aktif, anchor link & back-to-top bekerja.
- [ ] Semua animasi ScrollTrigger sinkron dengan Lenis (tidak ada jitter).
- [ ] `prefers-reduced-motion` dihormati.
- [ ] FAQ, carousel, menu mobile bisa dioperasikan dengan keyboard.
- [ ] `npm run build` sukses, bundle JS < 100 KB gzip.

---

## 12. Pertanyaan Terbuka (perlu keputusan sebelum/saat implementasi)

1. **Mockup dashboard hero & bento** — rekomendasi: dibangun **HTML/CSS** agar bisa dianimasikan. Alternatif lebih cepat: ekspor sebagai gambar (WebP) dari Figma, animasi hanya pada level kartu. → *Default: HTML/CSS.*
2. **Copy yang belum ada** — jawaban FAQ 2–6 dan testimonial tambahan. → *Default: placeholder ditandai TODO.*
3. **Tujuan link/tombol** (Sign In, Get Started, Start Free Trial, menu footer) → *Default: `#` / anchor ke section terkait.*
4. **Pin "How It Works" & kolom kiri "The Problem"** — pin membuat scroll lebih panjang. → *Default: pin hanya di How It Works, desktop saja.*
5. **Announcement bar bisa ditutup?** → *Default: tidak (sesuai desain).*
