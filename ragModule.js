/**
 * RAG Module - Retrieval-Augmented Generation
 * =============================================
 * This module implements the RAG pipeline using LangChain:
 * 1. Load documents from knowledge base
 * 2. Split documents into chunks
 * 3. Create embeddings and store in vector database
 * 4. Retrieve relevant context for user queries
 * 5. Generate answers using retrieved context
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Simple embedding class that uses a basic hash function
// In production, you'd use proper embeddings from @langchain/openai or similar
class SimpleEmbeddings {
  constructor() {
    this.dimensions = 384;
  }

  // Create a deterministic embedding from text using a simple hash approach
  async embedDocuments(texts) {
    return texts.map(text => this.textToVector(text));
  }

  async embedQuery(text) {
    return this.textToVector(text);
  }

  // Convert text to a fixed-size vector
  textToVector(text) {
    const vector = new Array(this.dimensions).fill(0);
    const words = text.toLowerCase().split(/\s+/);
    
    words.forEach((word, idx) => {
      for (let i = 0; i < word.length; i++) {
        const charCode = word.charCodeAt(i);
        const position = (charCode + idx + i) % this.dimensions;
        vector[position] += Math.sin(charCode * 0.1) * Math.cos(idx * 0.1);
      }
    });

    // Normalize the vector
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return magnitude > 0 ? vector.map(v => v / magnitude) : vector;
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let vectorStore = null;
let model = null;

/**
 * Initialize the RAG system by loading documents and creating vector store
 */
export async function initializeRAG() {
  console.log("🔧 Initializing RAG system...");

  // Validate API key
  if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "your_groq_api_key_here") {
    console.error("❌ GROQ_API_KEY is not set in .env file!");
    console.error("Please get your API key from https://console.groq.com/keys");
    throw new Error("GROQ_API_KEY not configured");
  }

  try {
    // 1. Load documents from knowledge base
    const knowledgeBasePath = join(__dirname, "knowledge_base");
    const files = readdirSync(knowledgeBasePath).filter(f => f.endsWith(".txt"));
    
    let allDocuments = [];
    
    for (const file of files) {
      const content = readFileSync(join(knowledgeBasePath, file), "utf-8");
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });
      
      const docs = await splitter.createDocuments([content], [{ source: file }]);
      allDocuments = allDocuments.concat(docs);
    }

    console.log(`📚 Loaded ${allDocuments.length} document chunks from ${files.length} files`);

    // 2. Create embeddings and vector store (using in-memory store)
    const embeddings = new SimpleEmbeddings();
    vectorStore = await MemoryVectorStore.fromDocuments(allDocuments, embeddings);
    
    console.log("✅ Vector store created successfully");

    // 3. Initialize the model
    model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      modelName: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    console.log("✅ RAG system initialized successfully\n");
  } catch (error) {
    console.error("❌ Error initializing RAG system:", error.message);
    throw error;
  }
}

/**
 * Query the RAG system with a question
 * @param {string} question - The user's question
 * @returns {Promise<{answer: string, isFromKB: boolean}>}
 */
export async function queryRAG(question) {
  if (!vectorStore || !model) {
    throw new Error("RAG system not initialized. Call initializeRAG() first.");
  }

  try {
    // 1. Retrieve relevant documents
    const relevantDocs = await vectorStore.similaritySearch(question, 3);
    
    if (relevantDocs.length === 0) {
      return {
        answer: "I don't have information about that in my knowledge base.",
        isFromKB: false,
      };
    }

    // 2. Combine context from relevant documents
    const context = relevantDocs.map(doc => doc.pageContent).join("\n\n");

    // 3. Create prompt with context
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a helpful assistant that answers questions based on the provided context.

Context from knowledge base:
{context}

Instructions:
- Answer the question based ONLY on the information provided in the context
- If the context doesn't contain relevant information, say "I don't have information about that in my knowledge base"
- Be concise but informative
- Use a friendly, professional tone`,
      ],
      ["human", "{question}"],
    ]);

    // 4. Create chain and invoke
    const chain = RunnableSequence.from([
      prompt,
      model,
      new StringOutputParser(),
    ]);

    const answer = await chain.invoke({
      context: context,
      question: question,
    });

    // Check if the answer indicates no knowledge base information
    const noInfoPhrases = [
      "don't have information",
      "not in my knowledge base",
      "no information about",
      "cannot find information",
    ];
    
    const isFromKB = !noInfoPhrases.some(phrase => 
      answer.toLowerCase().includes(phrase)
    );

    return {
      answer,
      isFromKB,
    };
  } catch (error) {
    console.error("Error querying RAG:", error.message);
    throw error;
  }
}

/**
 * Check if a query is likely related to the knowledge base
 * @param {string} query - The user's query
 * @returns {Promise<boolean>}
 */
export async function isKnowledgeBaseQuery(query) {
  if (!vectorStore) return false;

  // Perform a similarity search
  const results = await vectorStore.similaritySearch(query, 1);
  
  // If we found relevant documents, it's likely a KB query
  return results.length > 0;
}
