# Troubleshooting Guide

## 🔴 Common Errors and Solutions

### Error 1: "Invalid API Key" (401 Error)

**Symptoms:**
```
Error querying RAG: 401 {"error":{"message":"Invalid API Key"}}
```

**Cause:** Your Groq API key is incorrect or not set properly.

**Solution:**

1. **Get a valid Groq API key:**
   - Go to: https://console.groq.com/
   - Sign up (it's FREE - no credit card required)
   - Click "API Keys" in the left sidebar
   - Click "Create API Key"
   - Copy the key (should look like: `gsk_xxxxxxxxxxxxx...`)

2. **Update your .env file:**
   ```bash
   # Open the .env file and replace the key
   GROQ_API_KEY=gsk_your_actual_key_here
   ```

3. **Verify the key format:**
   - Must start with `gsk_`
   - About 48 characters long
   - No spaces before or after

4. **Restart the bot:**
   ```bash
   # Press Ctrl+C to stop
   # Then start again
   npm start
   ```

5. **Test your setup:**
   ```bash
   npm run check
   ```

---

### Error 2: "Bad MAC Error" / "Failed to decrypt message"

**Symptoms:**
```
Failed to decrypt message with any known session...
Session error:Error: Bad MAC Error: Bad MAC
```

**Cause:** WhatsApp session data is corrupted or outdated.

**Solution:**

**Method 1: Clean restart (RECOMMENDED)**
```bash
# 1. Stop the bot (Ctrl+C)

# 2. Delete the auth folder
Remove-Item -Recurse -Force auth_info_baileys

# Or use npm script:
npm run clean

# 3. Restart the bot
npm start

# 4. Scan the QR code again with your phone
```

**Method 2: Manual cleanup**
1. Close the bot
2. Navigate to project folder
3. Delete the `auth_info_baileys` folder manually
4. Start the bot again
5. Scan QR code with your phone

**Why this happens:**
- WhatsApp updated their protocol
- Multiple devices tried to connect
- Session expired or got corrupted

---

### Error 3: "Cannot find module" Errors

**Symptoms:**
```
Error: Cannot find module '@whiskeysockets/baileys'
Error: Cannot find module '@langchain/groq'
```

**Solution:**

1. **Delete old modules:**
   ```bash
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   ```

2. **Reinstall:**
   ```bash
   npm install
   ```

3. **If still failing, try:**
   ```bash
   npm cache clean --force
   npm install
   ```

---

### Error 4: npm Warning Messages

**Warnings you can IGNORE:**
```
npm warn deprecated node-domexception@1.0.0
npm warn deprecated uuid@10.0.0
npm warn deprecated @langchain/community@0.3.59
```

**These are safe to ignore** - they're just informational warnings from dependencies.

**To fix them (optional):**
```bash
npm audit fix
```

**DO NOT run `npm audit fix --force`** - it may break compatibility!

---

### Error 5: Bot Not Responding to Messages

**Symptoms:**
- Bot connects successfully
- No response when you message it

**Possible Causes & Solutions:**

1. **You're messaging from the SAME phone that scanned the QR code**
   - ❌ Can't message yourself on WhatsApp
   - ✅ Use a different phone/number to test

2. **API Key is invalid**
   - Run: `npm run check`
   - Fix the API key if needed

3. **Bot is filtering the messages**
   - Check terminal logs
   - Look for: "📨 Processing message from..."
   - If you don't see this, the message is being filtered

4. **Groq API is down or rate-limited**
   - Check Groq status: https://status.groq.com/
   - Wait a few seconds and try again

---

### Error 6: QR Code Not Appearing

**Symptoms:**
- Bot starts but no QR code shows up

**Solution:**

1. **Check if already connected:**
   ```
   Look for: "✅ Connected to WhatsApp successfully!"
   ```
   If you see this, you're already connected (no QR needed)

2. **Force new QR code:**
   ```bash
   # Stop bot (Ctrl+C)
   Remove-Item -Recurse -Force auth_info_baileys
   npm start
   ```

3. **Terminal doesn't support QR codes:**
   - Use Windows Terminal (not CMD)
   - Or use VS Code integrated terminal

---

### Error 7: "Connection closed" Immediately

**Symptoms:**
```
✅ Connected to WhatsApp successfully!
⚠️ Connection closed
```

**Solution:**

1. **WhatsApp banned/restricted your number**
   - Use a different phone number
   - Or wait 24 hours

2. **Too many reconnection attempts**
   - Clean auth folder
   - Wait 5 minutes
   - Try again

3. **WhatsApp updated their protocol**
   - Update packages:
     ```bash
     npm update @whiskeysockets/baileys
     ```

---

## 🛠️ Complete Reset (Nuclear Option)

If nothing else works:

```bash
# 1. Stop the bot
# Press Ctrl+C

# 2. Clean everything
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force auth_info_baileys
Remove-Item package-lock.json

# 3. Reinstall
npm install

# 4. Verify setup
npm run check

# 5. Start fresh
npm start
```

---

## ✅ Pre-flight Checklist

Before starting the bot, verify:

- [ ] Node.js v16+ installed (`node --version`)
- [ ] `.env` file exists
- [ ] `GROQ_API_KEY` is set and starts with `gsk_`
- [ ] `knowledge_base` folder has `.txt` files
- [ ] No other WhatsApp bot is running
- [ ] You have a second phone to test with

**Run the setup checker:**
```bash
npm run check
```

---

## 📞 Testing the Bot

### Correct Testing Method:

1. **Start bot on your computer**
   ```bash
   npm start
   ```

2. **Scan QR with Phone A** (your main phone)

3. **Message from Phone B** (friend's phone or second number)
   - Phone B messages Phone A's number
   - Bot on computer responds automatically

4. **Watch terminal logs** to see bot processing

### What You'll See:

**On your terminal:**
```
============================================================
📱 From: 923001234567
💬 Message: Hello
📨 Processing message...
🤖 Response sent: Hi! How can I help you?
============================================================
```

**On Phone A (your phone):**
- You'll see the conversation in your WhatsApp
- But you're not replying - the bot is

**On Phone B (tester's phone):**
- They see your profile picture and name
- They receive bot's automatic responses

---

## 🔍 Debugging Tips

### Enable Detailed Logs:

Edit `index.js` and change:
```javascript
logger: pino({ level: "silent" })
```

To:
```javascript
logger: pino({ level: "debug" })
```

This shows all WhatsApp protocol messages.

### Check API Connection:

```bash
npm run check
```

This tests:
- ✅ .env file exists
- ✅ API key is set
- ✅ API key format is correct
- ✅ Groq API is reachable
- ✅ Knowledge base files exist
- ✅ All modules installed

---

## 📊 Understanding Logs

### Good Logs (Everything Working):
```
🚀 Starting WhatsApp LangChain Bot...
🔧 Initializing RAG system...
✅ Vector store created successfully
✅ RAG system initialized successfully
📱 Using WhatsApp Web v2.2412.54
✅ Connected to WhatsApp successfully!
🤖 Bot is now live and ready to receive messages
```

### Bad Logs (Problems):

**API Key Issue:**
```
❌ GROQ_API_KEY is not set in .env file!
```
→ Fix: Set your API key in .env

**Session Issue:**
```
Failed to decrypt message with any known session
Bad MAC Error
```
→ Fix: Delete auth_info_baileys folder

**Connection Issue:**
```
Connection closed
Reconnecting...
```
→ Fix: Clean auth, wait, restart

---

## 🆘 Still Not Working?

If you've tried everything:

1. **Verify Node.js version:**
   ```bash
   node --version
   # Should be v16.0.0 or higher
   ```

2. **Share terminal logs** (from start to error)

3. **Check `.env` file** (hide your actual API key):
   ```bash
   Get-Content .env
   ```

4. **Test Groq API separately:**
   ```bash
   npm run check
   ```

5. **Try a simple test:**
   - Clean install
   - Valid API key
   - Fresh QR scan
   - Message from different phone

---

## 📝 Quick Commands Reference

```bash
# Start the bot
npm start

# Check setup
npm run check

# Clean authentication
npm run clean

# Reinstall packages
npm install

# Update packages
npm update

# Clean reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

---

**Remember:** Most issues are solved by:
1. ✅ Valid Groq API key in .env
2. ✅ Clean WhatsApp session (delete auth_info_baileys)
3. ✅ Testing from a DIFFERENT phone
