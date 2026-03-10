/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Copy, Check, Loader2, Wand2, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// The GEMINI_API_KEY is automatically injected by the platform.
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default function App() {
  const [userInput, setUserInput] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePrompt = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key is not configured.");
      }

      const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userInput,
        config: {
          systemInstruction: "You are an expert prompt engineer for AI image generators like Midjourney and Stable Diffusion. Your task is to take a short, simple user input and expand it into a rich, highly detailed, comma-separated prompt. Include specific details on: 1. Lighting (e.g., cinematic, volumetric, golden hour), 2. Camera angle and lens (e.g., low angle, 85mm, macro), 3. Art style and medium (e.g., hyper-realistic, oil painting, 3D render), 4. Rendering engine (e.g., Unreal Engine 5, Octane Render, Redshift), 5. Mood and atmosphere (e.g., ethereal, gritty, whimsical), and 6. Technical details (e.g., 8k, highly detailed, ray tracing). Output ONLY the expanded prompt, no other text.",
        },
      });

      const text = response.text;
      if (text) {
        setGeneratedPrompt(text.trim());
      } else {
        throw new Error("Failed to generate a prompt. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!generatedPrompt) return;
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative max-w-3xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
            <Sparkles size={14} />
            AI-Powered Prompt Engineering
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
            Perfect Prompt Generator
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Turn simple ideas into highly detailed prompts for Midjourney and Stable Diffusion.
          </p>
        </motion.header>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="relative group">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="e.g., a 2D mini toon character holding a glowing sword..."
              className="w-full h-40 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600 resize-none"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-zinc-500 text-xs">
              <Terminal size={14} />
              <span>Input your base concept</span>
            </div>
          </div>

          <button
            onClick={generatePrompt}
            disabled={isLoading || !userInput.trim()}
            className="w-full group relative overflow-hidden bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:cursor-not-allowed text-black font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Engineering Prompt...</span>
              </>
            ) : (
              <>
                <Wand2 size={20} className="group-hover:rotate-12 transition-transform" />
                <span>Generate Prompt</span>
              </>
            )}
          </button>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output Section */}
        <AnimatePresence>
          {generatedPrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="mt-12"
            >
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Generated Result</h2>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {isCopied ? (
                    <>
                      <Check size={14} />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copy to Clipboard</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                <div className="relative bg-zinc-900/80 border border-zinc-800 rounded-2xl p-8 leading-relaxed text-zinc-200 shadow-2xl backdrop-blur-sm">
                  {generatedPrompt}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-24 text-center text-zinc-600 text-sm">
          <p>© {new Date().getFullYear()} Perfect Prompt Generator • Powered by Gemini AI</p>
        </footer>
      </main>
    </div>
  );
}
