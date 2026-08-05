# 🚀 Quick Start Guide

## Step 1: Get Your Groq API Key (2 minutes)

1. Go to: **https://console.groq.com/**
2. Click **"Sign Up"** (it's FREE - no credit card needed)
3. After logging in, click **"API Keys"** in the sidebar
4. Click **"Create API Key"**
5. **Copy the key** (starts with `gsk_`)

## Step 2: Configure the Bot (30 seconds)

1. Open the `.env` file in this folder
2. Replace `your_groq_api_key_here` with your actual key:
   ```
   GROQ_API_KEY=gsk_paste_your_key_here
   ```
3. Save the file

## Step 3: Install Dependencies (2-3 minutes)

Open PowerShell/Terminal in this folder and run:

```bash
npm install
```

Wait for it to complete. **Ignore warning messages** - they're safe.

## Step 4: Verify Setup (30 seconds)

```bash
npm run check
```

You should see:
```
✅ All checks passed! You're ready to run the bot
```

If you see errors, check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file.

## Step 5: Start the Bot (1 minute)

```bash
npm start
```

You'll see:
```
🚀 Starting WhatsApp LangChain Bot...
✅ RAG system initialized successfully

📱 Scan this QR code with WhatsApp:
[QR CODE APPEARS HERE]
```

## Step 6: Link Your Phone (30 seconds)

1. Open **WhatsApp** on your phone
2. Go to: **Settings → Linked Devices**
3. Tap **"Link a Device"**
4. Scan the QR code shown in your terminal
5. Wait for **"✅ Connected to WhatsApp successfully!"**

## Step 7: Test the Bot (1 minute)

**IMPORTANT:** You need a **second phone/WhatsApp number** to test!

From another phone, message your WhatsApp number with:

### Test 1: Knowledge Base Query
```
What is SmartAssist AI?
```
Bot should answer from the knowledge base.

### Test 2: Store Personal Info
```
Hi, my name is Alex and I'm 25 years old
```
Bot acknowledges and stores this info.

### Test 3: Retrieve Memory
```
What do you know about me?
```
Bot returns all stored information.

---

## ⚠️ Common Issues

### Issue: "Invalid API Key"
**Fix:** Your Groq API key is wrong. Double-check:
1. It starts with `gsk_`
2. No spaces before/after
3. Get a new key from: https://console.groq.com/keys

### Issue: "Bad MAC Error"
**Fix:** Clean the session and restart:
```bash
npm run clean
npm start
```
Then scan QR code again.

### Issue: Bot not responding
**Fix:** Make sure you're messaging from a **DIFFERENT phone** than the one you used to scan the QR code. You can't message yourself!

---

## 📋 Quick Commands

| Command | What it does |
|---------|-------------|
| `npm start` | Start the bot |
| `npm run check` | Verify setup |
| `npm run clean` | Clean WhatsApp session |
| `Ctrl + C` | Stop the bot |

---

## 📱 Where Does the Bot Appear?

```
Your Computer (Bot) ← Linked to → Your Phone (Auth)
                                       ↕
                                  WhatsApp Network
                                       ↕
                         Other People's Phones (Testing)
```

- **Your computer** = Runs the bot
- **Your phone** = Used only for authentication
- **Other phones** = Where people can chat with the bot

When someone messages your WhatsApp number, the bot on your computer automatically responds.

---

## 🎯 Success Checklist

After setup, you should have:

- [x] Groq API key in `.env` file
- [x] `npm install` completed successfully
- [x] `npm run check` shows all green checkmarks
- [x] Bot started with `npm start`
- [x] QR code scanned with your phone
- [x] "Connected successfully" message appeared
- [x] Bot responded to test messages from another phone

---

## 📚 Next Steps

- Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md) if you have issues
- Check [README.md](README.md) for detailed documentation
- Customize `knowledge_base/*.txt` files with your own content

---

## ⏱️ Total Time: ~7 minutes

1. Get API key: 2 min
2. Configure: 30 sec
3. Install: 2-3 min
4. Verify: 30 sec
5. Start & Link: 1.5 min
6. Test: 1 min

---

**Need help?** Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for solutions to common problems.
