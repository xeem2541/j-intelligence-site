# J Intelligence — เว็บไซต์

เว็บรับทำ AI Chatbot, เว็บไซต์ + AI และคอนเทนต์ AI
เว็บจริง: https://j-intelligence.netlify.app (สำรอง: https://xeem2541.github.io/j-intelligence-site/)

## โครงสร้าง

| ไฟล์ / โฟลเดอร์ | คืออะไร |
|---|---|
| `src/pages/` | เนื้อหาของแต่ละหน้า แก้ที่นี่ บรรทัดแรกของทุกหน้าคือ `<!--page {...} -->` (ชื่อหน้า คำอธิบาย และที่อยู่) |
| `src/pages/index.html` | หน้าแรก |
| `src/pages/services/*/index.html` | หน้าบริการ: `ai-chatbot`, `website-ai`, `ai-content` |
| `src/header.html`, `src/end.html` | เมนูด้านบน และส่วนท้าย (แถบมือถือ, footer, ผู้ช่วยตอบคำถาม) ใช้ร่วมทุกหน้า |
| `src/site.css`, `src/js/` | สไตล์และสคริปต์ที่ใช้ร่วมกัน |
| `src/meta.html`, `src/head-end.html`, `src/sprite.html` | ส่วน `<head>` ไอคอน และฟอนต์ |
| `build.mjs` | ประกอบทุกส่วนเป็นเว็บที่โฟลเดอร์ `dist/` |
| `og.jpg` | ภาพตอนแชร์ลิงก์ (1200×630) |
| `netlify.toml` | การตั้งค่า Netlify (สั่ง build และ publish `dist/`) |
| `.github/workflows/pages.yml` | build และขึ้น GitHub Pages |
| `chatbot-ai/` | แชทบอท AI จริง (Netlify Function) เก็บไว้ใช้ภายหลัง ต้องมี `ANTHROPIC_API_KEY` และเครดิต |
| `skill/` | แนวทางดีไซน์ที่ใช้อ้างอิง |

ลิงก์ในเว็บใช้ `{{root}}` (เช่น `{{root}}services/ai-chatbot/`) เพื่อให้ใช้ได้ทั้งบน Netlify และ GitHub Pages

## ดูบนเครื่อง

```bash
node build.mjs
```

แล้วเปิด `dist/index.html` ผ่าน local server (เช่น `npx serve dist`) ไม่ต้องติดตั้งอะไรเพิ่ม ใช้แค่ Node

## ขึ้นเว็บจริง

GitHub เป็นต้นทาง: push ขึ้น branch `main` แล้ว Netlify และ GitHub Pages จะ build และอัปเดตเว็บให้อัตโนมัติ

```bash
git add -A
git commit -m "อธิบายสิ่งที่แก้"
git push
```

## หมายเหตุ

- ร้าน "ลินินดี", "ร่มเงา", "ยิ้มใส คลินิกทันตกรรม" และ "ดอยบรูว์ คาเฟ่" บนเว็บเป็นแบรนด์สมมติเพื่อแสดงผลงาน
- ห้ามใส่ API key ลงในไฟล์ของ repo นี้ ให้ตั้งค่าใน Netlify (Environment variables) เท่านั้น
