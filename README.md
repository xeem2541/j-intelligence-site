# J Intelligence — เว็บไซต์

เว็บรับทำ AI Chatbot, เว็บไซต์ + AI และคอนเทนต์ AI
เว็บจริง: https://j-intelligence.netlify.app

## โครงสร้าง

| ไฟล์ / โฟลเดอร์ | คืออะไร |
|---|---|
| `index.html` | ไฟล์หลักของเว็บ (HTML, CSS, JS อยู่ในไฟล์เดียว) แก้ที่ไฟล์นี้ |
| `og.jpg` | ภาพตอนแชร์ลิงก์ (1200×630) |
| `deploy/public/` | โฟลเดอร์ที่ขึ้นเว็บจริง Netlify คัดลอก `index.html` และ `og.jpg` มาไว้ที่นี่เองตอน build |
| `netlify.toml` | การตั้งค่า Netlify (คำสั่ง build และโฟลเดอร์ที่ publish) |
| `chatbot-ai/` | แชทบอท AI จริง (Netlify Function) เก็บไว้ใช้ภายหลัง ต้องมี `ANTHROPIC_API_KEY` และเครดิต |
| `skill/` | แนวทางดีไซน์ที่ใช้อ้างอิง |

## ขึ้นเว็บจริง

GitHub เป็นต้นทาง: push ขึ้น branch `main` แล้ว Netlify จะ build และอัปเดตเว็บให้อัตโนมัติ

```bash
git add -A
git commit -m "อธิบายสิ่งที่แก้"
git push
```

สำรอง (ถ้า Netlify ยังไม่ได้เชื่อมกับ GitHub): deploy ด้วยมือจากโฟลเดอร์นี้

```bash
cp index.html og.jpg deploy/public/
npx -y netlify-cli@17.38.1 deploy --prod --dir=deploy/public
```

## หมายเหตุ

- ร้าน "ลินินดี", "ร่มเงา", "ยิ้มใส คลินิกทันตกรรม" และ "ดอยบรูว์ คาเฟ่" บนเว็บเป็นแบรนด์สมมติเพื่อแสดงผลงาน
- ห้ามใส่ API key ลงในไฟล์ของ repo นี้ ให้ตั้งค่าใน Netlify (Environment variables) เท่านั้น
