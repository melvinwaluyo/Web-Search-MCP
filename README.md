# Web Search MCP Server

Server Model Context Protocol (MCP) berbasis TypeScript yang memungkinkan asisten AI untuk melakukan pencarian web dan mengekstrak konten dari halaman web tanpa memerlukan API key.

**Pemrosesan Bahasa Alami - Kelas A | Dosen: Syukron Abu Ishaq Alfarozi, S.T., Ph.D.**

**Kelompok:**
- Melvin Waluyo (22/492978/TK/53972)
- Muhammad Grandiv Lava Putra (22/493242/TK/54023)

---

> **Catatan:** Proyek ini didasarkan pada [web-search-mcp](https://github.com/mrkrsl/web-search-mcp) oleh Mark Russell, dengan modifikasi untuk integrasi dengan proyek [FinancialBot](../LLM-Agent-FinancialBot/) kami.

## Tentang Integrasi Ini

Server MCP ini adalah komponen kunci dari proyek **FinancialBot - LLM-Powered Financial Assistant** kami. Server ini menyediakan integrasi MCP ASLI untuk kemampuan pencarian web real-time, yang memungkinkan bot keuangan untuk:

- **Mencari harga produk online** ketika pengguna ingin membeli barang
- **Mengekstrak informasi harga real-time** dari website e-commerce
- **Memberikan analisis pembelian** berdasarkan harga pasar terkini
- **Mendukung keputusan keuangan yang cerdas** dengan data pasar terkini

Integrasi ini memungkinkan asisten keuangan kami memberikan saran yang lebih akurat dan relevan dengan mengakses informasi real-time dari web, daripada mengandalkan data statis atau kadaluarsa.

### Gambaran Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    FinancialBot System                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐                                          │
│  │ Discord User │                                          │
│  └──────┬───────┘                                          │
│         │                                                   │
│         ↓                                                   │
│  ┌──────────────┐      ┌─────────────────┐                │
│  │ Discord Bot  │ ←──→ │ LLM Agent       │                │
│  │ (Python)     │      │ (OpenRouter API)│                │
│  └──────────────┘      └────────┬────────┘                │
│         │                       │                          │
│         │              ┌────────┴────────┐                 │
│         │              │ Function Calls  │                 │
│         │              └────────┬────────┘                 │
│         ↓                       ↓                          │
│  ┌──────────────┐      ┌─────────────────┐                │
│  │ SQLite DB    │      │ MCP Client      │                │
│  │ (Transactions)│      └────────┬────────┘                │
│  └──────────────┘               │                          │
│                                  │ MCP Protocol            │
└──────────────────────────────────┼──────────────────────────┘
                                   │
                                   ↓
┌──────────────────────────────────────────────────────────────┐
│          Web Search MCP Server (Proyek Ini)                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ MCP Tools:                                             │ │
│  │  • full-web-search (pencarian + ekstraksi lengkap)     │ │
│  │  • get-web-search-summaries (pencarian cepat)         │ │
│  │  • get-single-web-page-content (ekstraksi halaman)    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────┐    ┌──────────────────┐                │
│  │ Search Engines │    │ Content Extractor│                │
│  │ • Bing         │    │ • Playwright     │                │
│  │ • Brave        │    │ • Cheerio        │                │
│  │ • DuckDuckGo   │    │ • Browser Pool   │                │
│  └────────────────┘    └──────────────────┘                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
                     ↓
         ┌───────────────────────┐
         │ Web (Situs E-commerce)│
         └───────────────────────┘
```

## Fitur

- **Pencarian Web Multi-Engine**: Pemilihan mesin pencari otomatis (Bing, Brave, DuckDuckGo) dengan fallback cerdas
- **Ekstraksi Konten Lengkap**: Mengekstrak konten halaman lengkap dari hasil pencarian menggunakan otomasi browser
- **Pemrosesan Konkuren**: Memproses beberapa halaman secara bersamaan untuk hasil yang lebih cepat
- **Opsi Pencarian Ringan**: Dapatkan cuplikan pencarian tanpa ekstraksi konten lengkap
- **Ekstraksi Halaman Tunggal**: Ekstrak konten dari URL tertentu
- **Manajemen Browser Cerdas**: Peralihan otomatis antara otomasi browser dan HTTP request untuk performa optimal
- **Model-Aware**: Secara otomatis menyesuaikan batas panjang konten berdasarkan kemampuan LLM yang terdeteksi
- **Tidak Memerlukan API Key**: Bekerja tanpa memerlukan API key untuk mesin pencari

## Tools yang Tersedia

### 1. `full-web-search` (Tool Utama)

Tool pencarian paling komprehensif yang mencari web dan mengekstrak konten halaman lengkap dari hasil teratas.

**Parameter:**
- `query` (string, wajib): Query pencarian yang akan dieksekusi
- `limit` (number, opsional): Jumlah hasil yang dikembalikan (1-10, default: 5)
- `includeContent` (boolean, opsional): Apakah akan mengambil konten halaman lengkap (default: true)
- `maxContentLength` (number, opsional): Maksimum karakter per hasil (0 = tanpa batas)

**Use Case:** Terbaik untuk riset komprehensif yang memerlukan informasi detail

### 2. `get-web-search-summaries` (Tool Ringan)

Mengembalikan cuplikan hasil pencarian tanpa mengikuti link untuk mengekstrak konten lengkap.

**Parameter:**
- `query` (string, wajib): Query pencarian yang akan dieksekusi
- `limit` (number, opsional): Jumlah hasil pencarian (1-10, default: 5)

**Use Case:** Pencarian cepat ketika cuplikan singkat sudah cukup

### 3. `get-single-web-page-content` (Tool Utilitas)

Mengekstrak konten lengkap dari satu URL tertentu.

**Parameter:**
- `url` (string, wajib): URL untuk mengekstrak konten
- `maxContentLength` (number, opsional): Maksimum karakter untuk konten yang diekstrak (0 = tanpa batas)

**Use Case:** Mendapatkan konten detail dari halaman web tertentu

## Instalasi

### Requirements

- Node.js 18.0.0 atau lebih tinggi
- npm 8.0.0 atau lebih tinggi

### Langkah-langkah

1. Clone atau download repository ini:

```bash
git clone <your-repository-url>
cd Web-Search-MCP
```

2. Install dependencies:

```bash
npm install
```

3. Install browser Playwright:

```bash
npx playwright install
```

4. Build proyek:

```bash
npm run build
```

Server yang sudah dikompilasi akan tersedia di direktori `dist`.

## Konfigurasi

### Untuk Claude Desktop

Tambahkan ke file konfigurasi Claude Desktop (`claude_desktop_config.json`):

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
**Linux:** `~/.config/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["E:\\VSCProjects\\Web-Search-MCP\\dist\\index.js"]
    }
  }
}
```

### Untuk MCP Client Lainnya

Arahkan MCP client Anda ke file `dist/index.js` yang sudah dikompilasi. Contoh konfigurasi:

```json
{
  "mcpServers": {
    "web-search": {
      "command": "node",
      "args": ["/path/to/web-search-mcp/dist/index.js"],
      "env": {
        "MAX_CONTENT_LENGTH": "500000",
        "DEFAULT_TIMEOUT": "6000"
      }
    }
  }
}
```

## Environment Variables

Anda dapat menyesuaikan perilaku server menggunakan environment variables berikut:

| Variable | Deskripsi | Default |
|----------|-----------|---------|
| `MAX_CONTENT_LENGTH` | Batas maksimum karakter untuk konten yang diekstrak | 500,000 |
| `DEFAULT_TIMEOUT` | Request timeout dalam milidetik | 6,000 |
| `MAX_BROWSERS` | Maksimum instance browser konkuren | 3 |
| `ENABLE_RELEVANCE_CHECKING` | Aktifkan validasi kualitas konten | true |

## Contoh Penggunaan

### Contoh 1: Riset Komprehensif

```
Gunakan full-web-search untuk mencari informasi tentang "quantum computing breakthroughs 2025"
```

Tool akan:
1. Mencari query di mesin pencari yang tersedia
2. Mengekstrak konten lengkap dari hasil teratas
3. Mengembalikan konten detail untuk analisis

### Contoh 2: Pencarian Cuplikan Cepat

```
Gunakan get-web-search-summaries untuk mencari "Python asyncio tutorial"
```

Tool akan:
1. Mencari query
2. Mengembalikan hanya judul, URL, dan deskripsi
3. Melewati ekstraksi konten lengkap untuk hasil lebih cepat

### Contoh 3: Ekstrak Halaman Tertentu

```
Gunakan get-single-web-page-content untuk mengekstrak konten dari "https://example.com/article"
```

Tool akan:
1. Navigasi ke URL yang ditentukan
2. Ekstrak konten utama
3. Mengembalikan konten bersih tanpa navigasi/iklan

## Kompatibilitas Model

Server MCP ini bekerja dengan LLM apa pun yang mendukung tool use. Hasil terbaik dicapai dengan:

- **Performa Optimal**: Qwen3, Gemma 3, model Claude terbaru
- **Performa Baik**: Model GPT terbaru, DeepSeek
- **Performa Terbatas**: Model Llama lama (mungkin ada masalah reliabilitas)

Server secara otomatis mendeteksi kemampuan model dan menyesuaikan batas panjang konten.

## Development

### Script yang Tersedia

- `npm run build` - Kompilasi TypeScript ke JavaScript
- `npm run dev` - Jalankan dalam mode development dengan auto-reload
- `npm start` - Mulai server yang sudah dikompilasi
- `npm run lint` - Periksa kualitas kode dengan ESLint
- `npm run format` - Format kode dengan Prettier

### Struktur Proyek

```
Web-Search-MCP/
├── dist/                    # Output JavaScript yang dikompilasi
│   ├── index.js            # File server utama
│   ├── search-engine.js    # Implementasi mesin pencari
│   ├── content-extractor.js
│   ├── enhanced-content-extractor.js
│   ├── browser-pool.js
│   └── types.d.ts          # Definisi tipe TypeScript
├── package.json
└── README.md
```

## Fitur Detail

### Pencarian Multi-Engine

Server secara otomatis mencoba beberapa mesin pencari sesuai urutan prioritas:
1. Bing (utama)
2. Brave (fallback)
3. DuckDuckGo (fallback)

Jika satu mesin gagal, secara otomatis mencoba yang berikutnya.

### Ekstraksi Konten Cerdas

- **Deteksi PDF**: Secara otomatis melewati file PDF dan meminta hasil tambahan
- **Pembersihan Konten**: Menghapus navigasi, iklan, dan konten yang tidak relevan
- **Error Handling**: Mengkategorikan kegagalan (timeout, akses ditolak, deteksi bot, dll.)
- **Retry Logic**: Secara otomatis mencoba ulang request yang gagal dengan exponential backoff

### Manajemen Browser Pool

- Mempertahankan pool instance browser untuk efisiensi
- Secara otomatis menutup browser setelah operasi pencarian
- Mencegah memory leak dari event listener yang terakumulasi
- Penanganan graceful shutdown

## Troubleshooting

### Server Tidak Bisa Start

Periksa bahwa:
- Node.js 18+ terinstall: `node --version`
- Dependencies terinstall: `npm install`
- Proyek sudah di-build: `npm run build`
- Browser Playwright terinstall: `npx playwright install`

### Kegagalan Pencarian

Masalah umum:
- **Timeout errors**: Tingkatkan environment variable `DEFAULT_TIMEOUT`
- **Bot detection**: Beberapa situs memblokir akses otomatis
- **Network issues**: Periksa konektivitas internet
- **Content too long**: Sesuaikan `MAX_CONTENT_LENGTH` atau gunakan parameter `maxContentLength`

### Masalah Memory

Jika mengalami masalah memory:
- Kurangi environment variable `MAX_BROWSERS`
- Turunkan parameter `limit` dalam request pencarian
- Set `maxContentLength` untuk membatasi konten yang diekstrak

## Integrasi dengan FinancialBot

Server MCP ini terintegrasi dengan proyek FinancialBot kami untuk mengaktifkan kemampuan pencarian web real-time:

### Cara Kerjanya

1. **User bertanya tentang harga produk**: "Berapa harga laptop sekarang?"
2. **FinancialBot terhubung ke server MCP ini** melalui protokol MCP
3. **Pencarian web dilakukan** menggunakan tools yang disediakan oleh server ini
4. **Hasil diekstrak dan diproses** oleh bot keuangan
5. **User menerima informasi harga real-time** dan analisis pembelian

### Contoh Use Case di FinancialBot

```
User: aku mau beli iPhone nih, mampu ga ya?

Bot: Saya cari harga iPhone online dulu ya...

     🔍 Hasil pencarian harga (via Web Search MCP):
       • Harga terendah: Rp 8,000,000
       • Harga tertinggi: Rp 25,000,000
       • Harga rata-rata: Rp 15,000,000

     🛍️ Analisis Pembelian:
     Saldo kamu: Rp 5,000,000
     ❌ Belum mampu. Kurang: Rp 10,000,000
```

### Proyek Terkait

- **FinancialBot**: [../LLM-Agent-FinancialBot/](../LLM-Agent-FinancialBot/)
  - Asisten keuangan berbasis LLM untuk bahasa Indonesia
  - Menggunakan server MCP ini untuk pencarian harga real-time
  - Dibangun dengan Python, Discord.py, dan OpenRouter API

## License

MIT License

## Credits

**Proyek Original:**
- Mark Russell - [web-search-mcp](https://github.com/mrkrsl/web-search-mcp)

**Dimodifikasi dan Diintegrasikan Oleh:**
- Melvin Waluyo (22/492978/TK/53972)
- Muhammad Grandiv Lava Putra (22/493242/TK/54023)

**Mata Kuliah:**
- Pemrosesan Bahasa Alami - Kelas A
- Dosen: Syukron Abu Ishaq Alfarozi, S.T., Ph.D.

## Contributing

Ini adalah versi modifikasi untuk proyek FinancialBot kami. Untuk proyek original, silakan kunjungi [upstream repository](https://github.com/mrkrsl/web-search-mcp).

Jika Anda ingin berkontribusi pada proyek FinancialBot kami atau integrasi ini:

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buka Pull Request

## Contact

Untuk pertanyaan atau feedback mengenai integrasi ini dengan FinancialBot, silakan buka issue di GitHub repository atau hubungi tim kami.

---

**Made with ❤️ for Pemrosesan Bahasa Alami Class Project**
