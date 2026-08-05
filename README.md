# WhatsApp Chatbot with LangChain, RAG, and Memory

A sophisticated WhatsApp chatbot built with **Baileys** (WhatsApp Web library) and **LangChain** that features:

- 🤖 **Retrieval-Augmented Generation (RAG)** - Answers questions from a custom knowledge base
- 🧠 **Conversational Memory** - Maintains chat history for context-aware conversations
- 💾 **Personal Information Extraction** - Automatically detects and stores user information
- 📊 **Memory Retrieval** - Recalls stored information when asked
- ⚡ **Clean Architecture** - Separated RAG, memory, and WhatsApp handling logic

---

## 📋 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Bot](#running-the-bot)
- [How It Works](#how-it-works)
- [Example Conversations](#example-conversations)
- [Files to Submit](#files-to-submit)
- [Troubleshooting](#troubleshooting)
- [Technology Stack](#technology-stack)

---

## ✨ Features

### 1. **RAG (Retrieval-Augmented Generation)**
- Custom knowledge base about tech products and company policies
- Vector store using HNSWLib for efficient similarity search
- Retrieves relevant context and generates accurate answers
- Falls back to conversational mode if information not in knowledge base

### 2. **Conversational Memory**
- Per-user chat history using LangChain's memory system
- Context-aware responses based on conversation history
- Persistent throughout the session

### 3. **Personal Information Extraction**
- Automatically detects personal information shared in conversations:
  - Name, age, city, country
  - Profession, company, education
  - Hobbies, interests, favorite foods
  - Pets, family members, languages
  - Any other personal facts
- Uses LLM-based extraction for accuracy
- Stores information per user

### 4. **Memory Retrieval**
- Responds to queries like:
  - "What do you know about me?"
  - "Who am I?"
  - "What do you remember about me?"
  - "Tell me about myself"
- Returns all stored personal information in a formatted response

---

## 📁 Project Structure

```
whatsapp_chatbot/
│
├── index.js                      # Main bot file - integrates everything
├── ragModule.js                  # RAG implementation (LangChain)
├── memoryModule.js               # Memory & personal info extraction (LangChain)
│
├── knowledge_base/               # Custom knowledge base for RAG
│   ├── tech_products.txt         # Information about products
│   └── company_policies.txt      # Company policies and FAQs
│
├── package.json                  # Dependencies
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules
└── README.md                     # This file
```

### LangChain Implementation Files (for submission):
- **`ragModule.js`** - RAG pipeline implementation
- **`memoryModule.js`** - Memory and personal information handling
- These files contain the core AI workflow logic

---

## 🔧 Prerequisites

Before running the bot, ensure you have:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Groq API Key** (free)
   - Sign up at: https://console.groq.com/
   - Create an API key at: https://console.groq.com/keys

4. **WhatsApp Account**
   - An active WhatsApp account on your phone
   - The bot will connect as a linked device (like WhatsApp Web)

---

## 📦 Installation

### ⚠️ IMPORTANT: If You're Getting Errors

If you see "Invalid API Key" or "Bad MAC Error", **read [FIX_ERRORS.md](FIX_ERRORS.md) first!**

### Quick Setup (7 minutes)

**For fastest setup, follow [QUICK_START.md](QUICK_START.md)**

### Detailed Setup

### Step 1: Navigate to Project Directory

```bash
cd "e:\D drive\AI_season\session_6\whatsapp_chatbot"
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `baileys` - WhatsApp Web API library
- `@langchain/core` - LangChain core functionality
- `@langchain/groq` - Groq LLM integration
- `@langchain/community` - Community integrations
- `langchain` - Main LangChain package
- `hnswlib-node` - Vector store for RAG
- `dotenv` - Environment variable management
- `pino` - Logging library
- `qrcode-terminal` - QR code display for WhatsApp pairing

**Installation time:** 2-5 minutes depending on internet speed

---

## ⚙️ Configuration

### Step 1: Create Environment File

Copy the example environment file:

```bash
copy .env.example .env
```

### Step 2: Add Your Groq API Key

Open `.env` file and replace `your_groq_api_key_here` with your actual Groq API key:

```env
GROQ_API_KEY=gsk_your_actual_api_key_here
```

**How to get Groq API Key:**
1. Go to https://console.groq.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into your `.env` file

---

## 🚀 Running the Bot

### Start the Bot

```bash
npm start
```

Or directly:

```bash
node index.js
```

### First Time Setup - QR Code Pairing

1. The bot will display a QR code in the terminal
2. Open WhatsApp on your phone
3. Go to: **Settings > Linked Devices > Link a Device**
4. Scan the QR code shown in your terminal
5. Wait for connection confirmation

**Output will look like:**
```
🚀 Starting WhatsApp LangChain Bot...

🔧 Initializing RAG system...
📚 Loaded 45 document chunks from 2 files
✅ Vector store created successfully
✅ RAG system initialized successfully

📱 Scan this QR code with WhatsApp:
   (Open WhatsApp > Settings > Linked Devices > Link a Device)

[QR CODE APPEARS HERE]

✅ Connected to WhatsApp successfully!
🤖 Bot is now live and ready to receive messages
```

### Subsequent Runs

After the first pairing:
- Authentication is saved in `auth_info_baileys/` folder
- Bot will connect automatically without QR code
- Just run `npm start` and wait for "Connected" message

### Stopping the Bot

Press `Ctrl + C` in the terminal to stop the bot gracefully.

---

## 🔍 How It Works

### Message Flow

```
User sends message via WhatsApp
         ↓
Baileys receives message
         ↓
Message Processing Logic (index.js)
         ↓
    ┌────┴────┐
    ↓         ↓
Memory Query?  Knowledge Base Query?
    ↓         ↓
    Yes       No → Check if KB-related
    ↓              ↓
Return stored    Yes → RAG Module
info            ↓
              Query vector store
              Retrieve context
              Generate answer
              ↓
              No → Conversational Mode
                   ↓
              Memory Module
              (with chat history)
              ↓
Extract personal info (background)
              ↓
Store in memory
              ↓
Send response via Baileys
```

### RAG Pipeline (`ragModule.js`)

1. **Document Loading**: Reads `.txt` files from `knowledge_base/`
2. **Text Splitting**: Splits documents into 500-character chunks with 50-character overlap
3. **Embeddings**: Creates vector embeddings using custom embedding function
4. **Vector Store**: Stores embeddings in HNSWLib for fast similarity search
5. **Retrieval**: Finds top 3 most relevant chunks for user query
6. **Generation**: LLM generates answer using retrieved context

### Memory System (`memoryModule.js`)

1. **Chat History**: Maintains conversation history per user (phone number)
2. **Personal Info Extraction**: 
   - Uses LLM to analyze messages for personal information
   - Extracts structured data (name, age, hobbies, etc.)
   - Stores in memory per user
3. **Memory Retrieval**: Formats and returns all stored information when requested
4. **Conversational Responses**: Generates context-aware replies using chat history

---

## 💬 Example Conversations

### Example 1: RAG - Knowledge Base Query

```
User: What is SmartAssist AI?

Bot: SmartAssist AI is an advanced virtual assistant powered by natural 
language processing. It can handle customer queries, schedule appointments, 
send reminders, and integrate with over 100 business applications. The basic 
plan starts at $29/month with up to 1000 conversations, and the premium plan 
is $99/month with unlimited conversations and priority support.
```

### Example 2: RAG - Product Pricing

```
User: How much does DataVision Analytics cost?

Bot: DataVision Analytics pricing starts at $199/month for small teams (up to 
10 users) and scales to $999/month for enterprise plans. Enterprise plans 
include advanced features like white-labeling and API access.
```

### Example 3: RAG - Company Policy

```
User: What is your refund policy?

Bot: We offer a 30-day money-back guarantee for all products. If you're not 
satisfied with your purchase, contact our support team within 30 days for a 
full refund. Refunds are processed within 5-7 business days, and annual 
subscriptions are prorated if cancelled mid-term.
```

### Example 4: Personal Information Storage

```
User: Hi, my name is Sarah and I'm 28 years old

Bot: Nice to meet you, Sarah! 😊 It's great to know you're 28. How can I 
help you today?

[Bot automatically stores: name=Sarah, age=28]
```

### Example 5: Multiple Personal Details

```
User: I live in New York and work as a software engineer. I love pizza and 
playing guitar in my free time.

Bot: That's awesome! New York is such a vibrant city, and software engineering 
is a great field 🎸 Pizza and guitar are excellent choices for relaxation. 
Is there anything specific you'd like to know?

[Bot stores: city=New York, profession=software engineer, 
favorite_food=pizza, hobbies=playing guitar]
```

### Example 6: Memory Retrieval

```
User: What do you know about me?

Bot: Here's what I know about you:

Name: Sarah
Age: 28
City: New York
Profession: software engineer
Favorite Food: pizza
Hobbies: playing guitar
```

### Example 7: Conversational Memory

```
User: Hi, I need help choosing a product

Bot: Hello! I'd be happy to help you choose the right product. What kind of 
solution are you looking for?

User: Something for analytics

Bot: Great! Based on analytics, I'd recommend DataVision Analytics. It's a 
comprehensive business intelligence platform with machine learning capabilities...

User: What was the product you just mentioned?

Bot: I just mentioned DataVision Analytics - it's our business intelligence 
platform that I thought would be perfect for your analytics needs. 😊
```

### Example 8: No Knowledge Base Information

```
User: What's the weather like today?

Bot: I don't have information about that in my knowledge base. However, 
I can help you with questions about our products and company policies!
```

---

## 📤 Files to Submit

**For your assignment, submit ONLY these LangChain implementation files:**

### Required Files:
1. **`ragModule.js`** - Complete RAG pipeline implementation
2. **`memoryModule.js`** - Memory and personal information handling

### Optional (if requested):
3. **`knowledge_base/tech_products.txt`** - Sample knowledge base
4. **`knowledge_base/company_policies.txt`** - Sample knowledge base

### DO NOT Submit:
- ❌ `index.js` (WhatsApp integration code)
- ❌ `node_modules/` folder
- ❌ `auth_info_baileys/` folder (authentication files)
- ❌ `package-lock.json`
- ❌ `.env` file (contains API keys)

### Why Only These Files?

The assignment asks for **LangChain implementation files** that contain:
- RAG workflow logic
- Memory management logic
- Tool implementations
- AI pipeline architecture

The `ragModule.js` and `memoryModule.js` files contain all the LangChain-specific 
logic independent of the WhatsApp integration, making them perfect for evaluation.

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'dotenv'"

**Solution:**
```bash
npm install
```

### Issue: "GROQ_API_KEY is not defined"

**Solution:**
- Ensure `.env` file exists
- Verify API key is correctly set in `.env`
- Restart the bot after editing `.env`

### Issue: QR Code Not Appearing

**Solution:**
- Make sure terminal supports UTF-8 characters
- Try running in Windows Terminal or VS Code integrated terminal
- Ensure `qrcode-terminal` is installed

### Issue: "Connection closed" Immediately After Connecting

**Solution:**
- Delete `auth_info_baileys/` folder
- Restart bot and scan QR code again
- Make sure WhatsApp is updated on your phone

### Issue: Bot Not Responding to Messages

**Solution:**
- Check if bot is still running (look for "Connected" message)
- Verify you're sending text messages (not images/voice)
- Check terminal for error messages
- Ensure Groq API key is valid

### Issue: "Error initializing RAG system"

**Solution:**
- Verify `knowledge_base/` folder exists
- Ensure `.txt` files are present in knowledge_base
- Check file permissions

### Issue: Personal Information Not Being Stored

**Solution:**
- Information extraction runs in background
- Check terminal logs for "Stored personal info" messages
- Try asking "What do you know about me?" to verify storage

---

## 🛠️ Technology Stack

### Core Technologies:
- **Node.js** - Runtime environment
- **Baileys** - WhatsApp Web API library
- **LangChain.js** - AI workflow orchestration framework

### LangChain Components:
- `@langchain/groq` - Groq LLM integration (Llama 3.3)
- `@langchain/core` - Core abstractions (prompts, output parsers, runnables)
- `@langchain/community` - Community integrations (vector stores)
- `RunnableWithMessageHistory` - Conversational memory management
- `ChatPromptTemplate` - Structured prompt creation
- `StringOutputParser` - Output parsing
- `InMemoryChatMessageHistory` - Chat history storage

### Vector Store & Embeddings:
- **HNSWLib** - Hierarchical Navigable Small World library for similarity search
- **Custom Embeddings** - Simple deterministic embedding function

### AI Model:
- **Groq Cloud** - Fast LLM inference
- **Llama 3.3 70B** - Large language model

### Utilities:
- **dotenv** - Environment variable management
- **pino** - Logging
- **qrcode-terminal** - QR code display

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    WhatsApp User                         │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ↓
         ┌────────────────────────┐
         │   Baileys Library      │
         │  (WhatsApp Web API)    │
         └────────────┬───────────┘
                      │
                      ↓
         ┌────────────────────────┐
         │      index.js          │
         │  (Message Router)      │
         └────┬──────────────┬────┘
              │              │
    ┌─────────┘              └──────────┐
    ↓                                   ↓
┌───────────────────┐         ┌──────────────────┐
│   ragModule.js    │         │ memoryModule.js  │
│                   │         │                  │
│ - Load docs       │         │ - Chat history   │
│ - Create vectors  │         │ - Info extract   │
│ - Similarity      │         │ - Store data     │
│   search          │         │ - Recall info    │
│ - Generate answer │         │                  │
└─────────┬─────────┘         └─────────┬────────┘
          │                             │
          ↓                             ↓
    ┌──────────────────────────────────────┐
    │         Groq Cloud API               │
    │    (Llama 3.3 70B Versatile)         │
    └──────────────────────────────────────┘
```

---

## 📝 Key Features Summary

✅ **RAG Implementation** - Custom knowledge base with vector search  
✅ **Conversational Memory** - Per-user chat history with LangChain  
✅ **Personal Info Extraction** - LLM-powered information detection  
✅ **Memory Retrieval** - Recall stored information on demand  
✅ **Clean Code Structure** - Separated concerns and modular design  
✅ **Production-Ready** - Error handling, logging, and graceful shutdown  
✅ **Well-Documented** - Comprehensive comments and README  

---

## 📞 Support

If you encounter any issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Verify all prerequisites are installed
3. Ensure `.env` file is configured correctly
4. Check terminal logs for error messages

---

## 📜 License

This project is created for educational purposes as part of AI Season coursework.

---

## 🎓 Assignment Submission Checklist

- [x] RAG pipeline implemented with LangChain
- [x] Custom knowledge base created
- [x] Vector store (HNSWLib) configured
- [x] Conversational memory implemented
- [x] Personal information extraction working
- [x] Memory retrieval functional
- [x] Clean code structure with separated modules
- [x] Comprehensive documentation
- [x] Example conversations provided
- [x] Installation and running instructions included

**Files to submit:**
- `ragModule.js`
- `memoryModule.js`
- (Optional) Knowledge base files

---

**Built with ❤️ using LangChain and Baileys**
