# 🚀 START HERE - WhatsApp LangChain Bot

## 🎯 Choose Your Path:

### Path 1: Quick Start (Recommended) ⚡
**For first-time setup - Takes 7 minutes**

👉 **Follow: [QUICK_START.md](QUICK_START.md)**

---

### Path 2: You Have Errors ❌
**If you see "Invalid API Key" or "Bad MAC Error"**

👉 **Follow: [FIX_ERRORS.md](FIX_ERRORS.md)**

---

### Path 3: Automatic Reset 🔄
**Use PowerShell script for automatic cleanup**

```powershell
.\reset-and-start.ps1
```

---

## 🆘 Need Help?

- **Setup issues** → [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- **Full documentation** → [README.md](README.md)
- **Quick reference** → See below

---

## ⚡ Super Quick Start (For Experienced Users)

```bash
# 1. Get API key from https://console.groq.com/keys

# 2. Add to .env
GROQ_API_KEY=gsk_your_key_here

# 3. Install
npm install

# 4. Check
npm run check

# 5. Start
npm start

# 6. Scan QR with phone

# 7. Test from another phone
```

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `QUICK_START.md` | Fast 7-minute setup guide |
| `FIX_ERRORS.md` | Solutions for common errors |
| `TROUBLESHOOTING.md` | Detailed problem solving |
| `README.md` | Complete documentation |
| `.env` | Your API key configuration |
| `index.js` | Main bot file |
| `ragModule.js` | RAG implementation (submit this) |
| `memoryModule.js` | Memory implementation (submit this) |

---

## 🎓 For Assignment Submission

**Submit ONLY these files:**
1. `ragModule.js`
2. `memoryModule.js`

Optional:
3. `knowledge_base/tech_products.txt`
4. `knowledge_base/company_policies.txt`

**DO NOT submit:**
- ❌ node_modules/
- ❌ auth_info_baileys/
- ❌ package-lock.json
- ❌ .env

---

## 💡 Quick Tips

- **Can't test yourself:** Need another phone to test
- **Bot location:** Runs on your computer, not your phone
- **QR code:** Only scan once, then session is saved
- **Stop bot:** Press `Ctrl + C`
- **Restart clean:** Delete `auth_info_baileys` folder

---

## 🔧 Quick Commands

```bash
npm start          # Start the bot
npm run check      # Verify setup
npm run clean      # Clean WhatsApp session
Ctrl + C           # Stop bot
```

---

## ✅ What You Need

- ✅ Node.js v16+ installed
- ✅ Groq API key (free from console.groq.com)
- ✅ WhatsApp on your phone
- ✅ Another phone/number for testing

---

## 🎬 Video Tutorial Equivalent

**Step-by-step as if watching a video:**

1. **Get API Key** (2 min)
   - Go to console.groq.com
   - Sign up (free)
   - Create API key
   - Copy it

2. **Configure** (30 sec)
   - Open `.env` file
   - Paste API key
   - Save

3. **Install** (2-3 min)
   - Run `npm install`
   - Wait for completion

4. **Verify** (30 sec)
   - Run `npm run check`
   - Should see all ✅

5. **Start** (30 sec)
   - Run `npm start`
   - QR code appears

6. **Link** (1 min)
   - Open WhatsApp on phone
   - Settings → Linked Devices
   - Scan QR code
   - See "Connected!"

7. **Test** (1 min)
   - From another phone
   - Message your number
   - Bot responds!

---

## 📊 Feature Overview

| Feature | Description |
|---------|-------------|
| **RAG** | Answers from knowledge base (products, policies) |
| **Memory** | Remembers personal info (name, age, hobbies, etc.) |
| **Chat History** | Maintains conversation context per user |
| **Multi-User** | Handles multiple conversations simultaneously |
| **LangChain** | Uses LangChain framework throughout |
| **Baileys** | WhatsApp connection via Baileys library |

---

## 🎯 Success Indicators

You'll know it's working when you see:

```
✅ Connected to WhatsApp successfully!
🤖 Bot is now live and ready to receive messages

============================================================
📱 From: 923001234567
💬 Message: What is SmartAssist AI?
🤖 Response sent: SmartAssist AI is an advanced...
============================================================
```

**No "Bad MAC" errors!**
**No "Invalid API Key" errors!**

---

## 🚨 Common Mistakes

1. ❌ Testing from same phone that scanned QR
   ✅ Use different phone

2. ❌ API key still says "your_groq_api_key_here"
   ✅ Replace with actual key from Groq

3. ❌ Old `auth_info_baileys` causing "Bad MAC"
   ✅ Delete folder and scan QR again

4. ❌ Didn't run `npm install`
   ✅ Run it first before starting

---

## 📞 Testing Checklist

- [ ] Bot started successfully
- [ ] QR code scanned
- [ ] "Connected" message appeared
- [ ] Using DIFFERENT phone to test
- [ ] Sent: "What is SmartAssist AI?" → Got answer
- [ ] Sent: "My name is Alex" → Got acknowledgment
- [ ] Sent: "What do you know about me?" → Got stored info

---

## 🎉 You're Ready!

**Choose your path above and get started!**

Most users should start with **[QUICK_START.md](QUICK_START.md)**

Having errors? Go to **[FIX_ERRORS.md](FIX_ERRORS.md)**

---

**Total setup time: 7 minutes**
**Difficulty: Easy**
**Prerequisites: Node.js, WhatsApp**
