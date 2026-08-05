/**
 * Memory Module - Conversational Memory & Personal Information Extraction
 * ========================================================================
 * This module handles:
 * 1. Conversational memory (chat history) per user
 * 2. Personal information extraction from conversations
 * 3. Storage and retrieval of user personal data
 * 4. Responding to queries about stored information
 */

import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

// Store for chat histories (one per user)
const chatHistories = {};

// Store for personal information (one per user)
const personalInfoStore = {};

/**
 * Get or create chat history for a user
 * @param {string} sessionId - User identifier (phone number)
 * @returns {InMemoryChatMessageHistory}
 */
function getChatHistory(sessionId) {
  if (!chatHistories[sessionId]) {
    chatHistories[sessionId] = new InMemoryChatMessageHistory();
  }
  return chatHistories[sessionId];
}

/**
 * Get or create personal info storage for a user
 * @param {string} userId - User identifier (phone number)
 * @returns {Object}
 */
function getPersonalInfo(userId) {
  if (!personalInfoStore[userId]) {
    personalInfoStore[userId] = {
      name: null,
      age: null,
      city: null,
      country: null,
      profession: null,
      occupation: null,
      company: null,
      hobbies: [],
      interests: [],
      favorite_food: [],
      favorite_color: null,
      pets: [],
      family: [],
      education: null,
      languages: [],
      preferences: {},
      other: {},
    };
  }
  return personalInfoStore[userId];
}

/**
 * Extract personal information from user message using LLM
 * @param {string} message - User's message
 * @param {string} userId - User identifier
 * @returns {Promise<Object>} Extracted information
 */
export async function extractPersonalInfo(message, userId) {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    modelName: "llama-3.3-70b-versatile",
    temperature: 0,
  });

  const extractionPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are an information extraction assistant. Extract any personal information from the user's message.

Personal information includes:
- name (first name, last name, or full name)
- age (exact age or age range)
- city or location
- country
- profession, occupation, or job title
- company or workplace
- hobbies or interests
- favorite things (food, color, movie, music, etc.)
- pets (type and names)
- family members
- education (school, degree, major)
- languages spoken
- preferences or likes/dislikes
- any other personal facts

Return the information as JSON with these fields:
{{
  "name": "extracted name or null",
  "age": "extracted age or null",
  "city": "extracted city or null",
  "country": "extracted country or null",
  "profession": "extracted profession or null",
  "company": "extracted company or null",
  "hobbies": ["hobby1", "hobby2"],
  "favorite_food": ["food1", "food2"],
  "favorite_color": "color or null",
  "pets": ["pet info"],
  "family": ["family member info"],
  "education": "education info or null",
  "languages": ["language1", "language2"],
  "other": {{"key": "value"}}
}}

If no personal information is found, return an empty object: {{}}
Only extract information that is explicitly stated. Do not make assumptions.`,
    ],
    ["human", "{message}"],
  ]);

  try {
    const chain = extractionPrompt.pipe(model).pipe(new StringOutputParser());
    const result = await chain.invoke({ message });
    
    // Parse JSON response
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return {};
    
    const extracted = JSON.parse(jsonMatch[0]);
    
    // Store the extracted information
    if (Object.keys(extracted).length > 0) {
      const userInfo = getPersonalInfo(userId);
      
      // Update personal info (merge new data with existing)
      if (extracted.name) userInfo.name = extracted.name;
      if (extracted.age) userInfo.age = extracted.age;
      if (extracted.city) userInfo.city = extracted.city;
      if (extracted.country) userInfo.country = extracted.country;
      if (extracted.profession) userInfo.profession = extracted.profession;
      if (extracted.company) userInfo.company = extracted.company;
      if (extracted.favorite_color) userInfo.favorite_color = extracted.favorite_color;
      if (extracted.education) userInfo.education = extracted.education;
      
      // Merge arrays (avoid duplicates)
      if (extracted.hobbies) {
        extracted.hobbies.forEach(h => {
          if (!userInfo.hobbies.includes(h)) userInfo.hobbies.push(h);
        });
      }
      if (extracted.favorite_food) {
        extracted.favorite_food.forEach(f => {
          if (!userInfo.favorite_food.includes(f)) userInfo.favorite_food.push(f);
        });
      }
      if (extracted.pets) {
        extracted.pets.forEach(p => {
          if (!userInfo.pets.includes(p)) userInfo.pets.push(p);
        });
      }
      if (extracted.family) {
        extracted.family.forEach(f => {
          if (!userInfo.family.includes(f)) userInfo.family.push(f);
        });
      }
      if (extracted.languages) {
        extracted.languages.forEach(l => {
          if (!userInfo.languages.includes(l)) userInfo.languages.push(l);
        });
      }
      
      // Merge other info
      if (extracted.other) {
        userInfo.other = { ...userInfo.other, ...extracted.other };
      }
      
      console.log(`💾 Stored personal info for user ${userId}:`, extracted);
    }
    
    return extracted;
  } catch (error) {
    console.error("Error extracting personal info:", error.message);
    return {};
  }
}

/**
 * Check if user is asking about their stored information
 * @param {string} message - User's message
 * @returns {boolean}
 */
export function isMemoryQuery(message) {
  const memoryKeywords = [
    "what do you know about me",
    "who am i",
    "what do you remember",
    "tell me about myself",
    "what information do you have",
    "my details",
    "my info",
    "my profile",
    "what you know",
    "do you remember me",
    "my data",
  ];
  
  const lowerMessage = message.toLowerCase();
  return memoryKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Get all stored information about a user
 * @param {string} userId - User identifier
 * @returns {string} Formatted user information
 */
export function getUserInfo(userId) {
  const info = getPersonalInfo(userId);
  
  const parts = [];
  
  if (info.name) parts.push(`Name: ${info.name}`);
  if (info.age) parts.push(`Age: ${info.age}`);
  if (info.city) parts.push(`City: ${info.city}`);
  if (info.country) parts.push(`Country: ${info.country}`);
  if (info.profession) parts.push(`Profession: ${info.profession}`);
  if (info.company) parts.push(`Company: ${info.company}`);
  if (info.education) parts.push(`Education: ${info.education}`);
  if (info.favorite_color) parts.push(`Favorite Color: ${info.favorite_color}`);
  
  if (info.hobbies.length > 0) {
    parts.push(`Hobbies: ${info.hobbies.join(", ")}`);
  }
  if (info.favorite_food.length > 0) {
    parts.push(`Favorite Food: ${info.favorite_food.join(", ")}`);
  }
  if (info.pets.length > 0) {
    parts.push(`Pets: ${info.pets.join(", ")}`);
  }
  if (info.family.length > 0) {
    parts.push(`Family: ${info.family.join(", ")}`);
  }
  if (info.languages.length > 0) {
    parts.push(`Languages: ${info.languages.join(", ")}`);
  }
  
  if (Object.keys(info.other).length > 0) {
    Object.entries(info.other).forEach(([key, value]) => {
      parts.push(`${key}: ${value}`);
    });
  }
  
  if (parts.length === 0) {
    return "I don't have any personal information stored about you yet. Feel free to tell me about yourself!";
  }
  
  return "Here's what I know about you:\n\n" + parts.join("\n");
}

/**
 * Create a conversational chain with memory
 * @returns {RunnableWithMessageHistory}
 */
export function createConversationalChain() {
  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    modelName: "llama-3.3-70b-versatile",
    temperature: 0.7,
  });

  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a friendly and helpful WhatsApp assistant. You have a conversation history with the user and can remember what they've told you.

Guidelines:
- Be conversational and natural
- Use the conversation history to provide context-aware responses
- If the user shares personal information, acknowledge it warmly
- Be concise in your responses (2-3 sentences max unless more detail is needed)
- Use emojis occasionally to be friendly 😊
- If you don't know something, be honest about it`,
    ],
    new MessagesPlaceholder("history"),
    ["human", "{message}"],
  ]);

  const chain = prompt.pipe(model).pipe(new StringOutputParser());

  return new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: getChatHistory,
    inputMessagesKey: "message",
    historyMessagesKey: "history",
  });
}

/**
 * Generate a response with conversational memory
 * @param {string} message - User's message
 * @param {string} userId - User identifier
 * @returns {Promise<string>} Bot's response
 */
export async function getConversationalResponse(message, userId) {
  const chain = createConversationalChain();
  
  try {
    const response = await chain.invoke(
      { message },
      { configurable: { sessionId: userId } }
    );
    return response;
  } catch (error) {
    console.error("Error generating conversational response:", error.message);
    throw error;
  }
}

/**
 * Clear all stored data for a user (optional utility)
 * @param {string} userId - User identifier
 */
export function clearUserData(userId) {
  delete chatHistories[userId];
  delete personalInfoStore[userId];
  console.log(`🗑️ Cleared all data for user ${userId}`);
}
