/**
 * Setup Verification Script
 * Run this before starting the bot to verify everything is configured correctly
 */

import "dotenv/config";
import { readFileSync, existsSync } from "fs";

console.log("🔍 Checking WhatsApp Bot Setup...\n");

let hasErrors = false;

// Check 1: Environment file exists
console.log("1️⃣ Checking .env file...");
if (!existsSync(".env")) {
  console.error("   ❌ .env file not found!");
  console.error("   → Copy .env.example to .env");
  hasErrors = true;
} else {
  console.log("   ✅ .env file exists");
}

// Check 2: Groq API Key
console.log("\n2️⃣ Checking Groq API Key...");
if (!process.env.GROQ_API_KEY) {
  console.error("   ❌ GROQ_API_KEY not set in .env file!");
  console.error("   → Get your API key from: https://console.groq.com/keys");
  hasErrors = true;
} else if (process.env.GROQ_API_KEY === "your_groq_api_key_here") {
  console.error("   ❌ GROQ_API_KEY is still the placeholder value!");
  console.error("   → Replace it with your actual API key from Groq");
  hasErrors = true;
} else if (!process.env.GROQ_API_KEY.startsWith("gsk_")) {
  console.error("   ⚠️  Warning: API key doesn't look like a Groq key (should start with 'gsk_')");
  console.error("   → Double-check your API key");
  hasErrors = true;
} else {
  console.log("   ✅ Groq API Key is set");
  console.log(`   Key: ${process.env.GROQ_API_KEY.substring(0, 10)}...${process.env.GROQ_API_KEY.substring(process.env.GROQ_API_KEY.length - 4)}`);
}

// Check 3: Knowledge base files
console.log("\n3️⃣ Checking knowledge base files...");
const kbFiles = [
  "knowledge_base/tech_products.txt",
  "knowledge_base/company_policies.txt",
];

let kbOk = true;
for (const file of kbFiles) {
  if (!existsSync(file)) {
    console.error(`   ❌ ${file} not found!`);
    kbOk = false;
    hasErrors = true;
  }
}

if (kbOk) {
  console.log("   ✅ All knowledge base files present");
}

// Check 4: Required modules
console.log("\n4️⃣ Checking Node.js modules...");
try {
  await import("@whiskeysockets/baileys");
  console.log("   ✅ Baileys installed");
} catch {
  console.error("   ❌ Baileys not installed");
  console.error("   → Run: npm install");
  hasErrors = true;
}

try {
  await import("@langchain/groq");
  console.log("   ✅ LangChain Groq installed");
} catch {
  console.error("   ❌ LangChain Groq not installed");
  console.error("   → Run: npm install");
  hasErrors = true;
}

try {
  await import("langchain/vectorstores/memory");
  console.log("   ✅ MemoryVectorStore installed");
} catch {
  console.error("   ❌ LangChain VectorStore not installed");
  console.error("   → Run: npm install");
  hasErrors = true;
}

// Check 5: Test Groq API connection
console.log("\n5️⃣ Testing Groq API connection...");
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY.startsWith("gsk_")) {
  try {
    const { ChatGroq } = await import("@langchain/groq");
    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: "llama-3.3-70b-versatile",
    });
    
    const response = await model.invoke("Say 'OK' if you can hear me");
    console.log("   ✅ Groq API is working!");
    console.log(`   Response: ${response.content}`);
  } catch (error) {
    console.error("   ❌ Groq API test failed!");
    console.error(`   Error: ${error.message}`);
    if (error.message.includes("401") || error.message.includes("Invalid API Key")) {
      console.error("   → Your API key is invalid. Get a new one from: https://console.groq.com/keys");
    }
    hasErrors = true;
  }
} else {
  console.log("   ⏭️  Skipping (API key not configured)");
}

// Summary
console.log("\n" + "=".repeat(60));
if (hasErrors) {
  console.log("❌ Setup check FAILED - Please fix the issues above");
  console.log("=".repeat(60));
  process.exit(1);
} else {
  console.log("✅ All checks passed! You're ready to run the bot");
  console.log("\nTo start the bot, run:");
  console.log("  npm start");
  console.log("=".repeat(60));
}
