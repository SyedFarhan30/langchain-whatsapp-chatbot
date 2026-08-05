/**
 * WhatsApp LangChain Bot with RAG and Memory
 * ===========================================
 * A comprehensive WhatsApp chatbot using Baileys library and LangChain that:
 * 1. Answers questions from a knowledge base using RAG (Retrieval-Augmented Generation)
 * 2. Maintains conversational memory per user
 * 3. Extracts and stores personal information from conversations
 * 4. Retrieves stored information when asked
 * 
 * Architecture:
 * - Baileys: WhatsApp connection and message handling
 * - LangChain: AI workflow orchestration
 * - RAG Module: Knowledge base retrieval and question answering
 * - Memory Module: Chat history and personal information management
 */

import "dotenv/config";
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
} from "@whiskeysockets/baileys";
import pino from "pino";
import qrcodeTerminal from "qrcode-terminal";

// Import our LangChain modules
import { initializeRAG, queryRAG, isKnowledgeBaseQuery } from "./ragModule.js";
import {
  extractPersonalInfo,
  isMemoryQuery,
  getUserInfo,
  getConversationalResponse,
} from "./memoryModule.js";

/**
 * Process incoming WhatsApp message and generate appropriate response
 * @param {string} message - User's message text
 * @param {string} userId - User identifier (phone number)
 * @returns {Promise<string>} Bot's response
 */
async function processMessage(message, userId) {
  console.log(`\n📨 Processing message from ${userId}: "${message}"`);

  try {
    // STEP 1: Check if user is asking about their stored information
    if (isMemoryQuery(message)) {
      console.log("🔍 Memory query detected");
      const userInfo = getUserInfo(userId);
      return userInfo;
    }

    // STEP 2: Extract personal information from message (runs in background)
    extractPersonalInfo(message, userId).catch(err => {
      console.error("Error extracting personal info:", err.message);
    });

    // STEP 3: Check if query is related to knowledge base
    const isKBQuery = await isKnowledgeBaseQuery(message);
    
    if (isKBQuery) {
      console.log("📚 Knowledge base query detected");
      const ragResult = await queryRAG(message);
      
      if (ragResult.isFromKB) {
        console.log("✅ Answered from knowledge base");
        return ragResult.answer;
      } else {
        console.log("⚠️ No relevant information in knowledge base, using conversational mode");
      }
    }

    // STEP 4: Use conversational chain with memory for general chat
    console.log("💬 Using conversational mode with memory");
    const response = await getConversationalResponse(message, userId);
    return response;

  } catch (error) {
    console.error("❌ Error processing message:", error.message);
    return "Sorry, I encountered an error processing your message. Please try again.";
  }
}

/**
 * Initialize and start the WhatsApp bot
 */
async function startBot() {
  console.log("🚀 Starting WhatsApp LangChain Bot...\n");

  // Initialize RAG system first
  try {
    await initializeRAG();
  } catch (error) {
    console.error("❌ Failed to initialize RAG system:", error.message);
    console.error("Bot will continue without RAG capabilities\n");
  }

  // Set up Baileys authentication
  const { state, saveCreds } = await useMultiFileAuthState("auth_info_baileys");
  const { version, isLatest } = await fetchLatestBaileysVersion();
  
  console.log(`📱 Using WhatsApp Web v${version.join(".")}, isLatest: ${isLatest}\n`);

  // Create WhatsApp socket connection
  const sock = makeWASocket({
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "silent" })),
    },
    version,
    logger: pino({ level: "silent" }), // Suppress Baileys protocol logs
    printQRInTerminal: false, // We'll use qrcode-terminal instead for better formatting
    generateHighQualityLinkPreview: true,
    markOnlineOnConnect: true,
  });

  // Save credentials whenever they update
  sock.ev.on("creds.update", saveCreds);

  // Handle connection updates
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    // Display QR code for initial pairing
    if (qr) {
      console.log("📱 Scan this QR code with WhatsApp:");
      console.log("   (Open WhatsApp > Settings > Linked Devices > Link a Device)\n");
      qrcodeTerminal.generate(qr, { small: true });
    }

    // Connection established
    if (connection === "open") {
      console.log("\n✅ Connected to WhatsApp successfully!");
      console.log("🤖 Bot is now live and ready to receive messages\n");
      console.log("=" .repeat(60));
    }

    // Connection closed
    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

      console.log("\n⚠️ Connection closed");
      
      if (statusCode === DisconnectReason.loggedOut) {
        console.log("🔓 Logged out from WhatsApp");
        console.log("To reconnect, delete the 'auth_info_baileys' folder and restart");
      } else {
        console.log("🔄 Attempting to reconnect...\n");
        if (shouldReconnect) {
          setTimeout(startBot, 3000); // Reconnect after 3 seconds
        }
      }
    }
  });

  // Handle incoming messages
  sock.ev.on("messages.upsert", async ({ messages }) => {
    for (const msg of messages) {
      // Skip if no key or remote JID
      if (!msg.key || !msg.key.remoteJid) continue;

      const jid = msg.key.remoteJid;
      const isGroup = jid.endsWith("@g.us");
      const isStatus = jid === "status@broadcast";
      const fromMe = msg.key.fromMe;

      // Skip: our own messages, group messages, status updates
      if (fromMe || isGroup || isStatus) continue;

      // Extract phone number (use remoteJid, fallback to participant for groups)
      const phoneNumber = jid.split("@")[0];

      // Extract message text
      const messageText = 
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        null;

      // Only process text messages
      if (!messageText) {
        console.log(`⚠️ Skipping non-text message from ${phoneNumber}`);
        continue;
      }

      console.log("\n" + "=".repeat(60));
      console.log(`📱 From: ${phoneNumber}`);
      console.log(`💬 Message: ${messageText}`);

      // Process the message and get response
      const response = await processMessage(messageText, phoneNumber);

      // Send response back to user
      await sock.sendMessage(jid, { text: response });
      console.log(`🤖 Response sent: ${response.substring(0, 100)}${response.length > 100 ? "..." : ""}`);
      console.log("=".repeat(60));
    }
  });

  // Handle messages being read
  sock.ev.on("messages.update", (updates) => {
    // Optional: handle message updates (read receipts, etc.)
  });

  // Handle presence updates
  sock.ev.on("presence.update", (presence) => {
    // Optional: handle user online/offline status
  });
}

// Start the bot
console.log("\n" + "=".repeat(60));
console.log("  WhatsApp LangChain Bot with RAG & Memory");
console.log("=".repeat(60) + "\n");

startBot().catch((error) => {
  console.error("❌ Fatal error starting bot:", error);
  process.exit(1);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n\n🛑 Bot shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n\n🛑 Bot shutting down gracefully...");
  process.exit(0);
});
