# J Intelligence — เว็บไซต์

เว็บรับทำ AI Chatbot, เว็บไซต์ + AI และคอนเทนต์ AI
เว็บจริง: https://j-intelligence.netlify.app

## โครงสร้าง

| ไฟล์ / โฟลเดอร์ | คืออะไร |
|---|---|
| `index.html` | ไฟล์หลักของเว็บ (HTML, CSS, JS อยู่ในไฟล์เดียว) แก้ที่ไฟล์นี้ |
| `og.jpg` | ภาพตอนแชร์ลิงก์ (1200×630) |
| `deploy/public/` | สำเนาที่ขึ้นเว็บจริง คัดลอก `index.html` และ `og.jpg` มาที่นี่ก่อน deploy |
| `deploy/netlify.toml` | การตั้งค่า Netlify |
| `chatbot-ai/` | แชทบอท AI จริง (Netlify Function) เก็บไว้ใช้ภายหลัง ต้องมี `ANTHROPIC_API_KEY` และเครดิต |
| `skill/` | แนวทางดีไซน์ที่ใช้อ้างอิง |

## ขึ้นเว็บจริง

```bash
cp index.html og.jpg deploy/public/
cd deploy
npx -y netlify-cli@17.38.1 deploy --prod --dir=public
```

ต้องใส่ `--dir=public` ทุกครั้ง ถ้าไม่ใส่ CLI จะเลือกโฟลเดอร์ผิด

## หมายเหตุ

- ร้าน "ลินินดี", "ร่มเงา", "ยิ้มใส คลินิกทันตกรรม" และ "ดอยบรูว์ คาเฟ่" บนเว็บเป็นแบรนด์สมมติเพื่อแสดงผลงาน
- ห้ามใส่ API key ลงในไฟล์ของ repo นี้ ให้ตั้งค่าใน Netlify (Environment variables) เท่านั้น
