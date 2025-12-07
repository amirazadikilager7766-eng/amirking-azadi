import { GoogleGenAI } from "@google/genai";
import { PlayerStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are the "Cyber-Naghali" (Digital Storyteller) of Yalda 2077.
Setting: A fusion of Ancient Achaemenid Empire and Cyberpunk Future.
Key Themes: Yalda Night, Cyrus the Great, Business Strategy, Digital Marketing.
Language: Persian (Farsi).
Tone: Epic, Mystical, but strictly Professional and Actionable regarding business advice.
`;

export const generateBossTaunt = async (stats: PlayerStats): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `
        The player has reached the "Giant of Financial Failure" (Boss).
        Player Name: ${stats.name}
        Player Problem: ${stats.analysis?.mainProblem || "Unknown Fear"}
        Generate a short, terrifying, epic taunt in Persian that specifically mocks their problem.
        Keep it under 20 words.
      `,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "تاریکی ورشکستگی تو را می‌بلعد، ای بازرگان کوچک!";
  } catch (error) {
    return "سیستم ارتباطی هخامنشی قطع شده است... اما سایه‌ها نزدیکند.";
  }
};

export const generateFinalReport = async (stats: PlayerStats, history: string[]): Promise<string> => {
  try {
    const hasBusiness = stats.analysis?.hasBusiness;
    const problem = stats.analysis?.mainProblem;

    const prompt = `
      Create a "Yalda Business Decree" from Cyrus the Great (Hologram).
      
      User Profile:
      - Name: ${stats.name}
      - Has Business: ${hasBusiness ? "YES" : "NO"}
      - Main Struggle: ${problem}
      
      Mandatory Output Structure (Persian Markdown):
      
      1. **The Verdict**: Epic praise for completing the game.
      2. **The Strategic Roadmap (CRITICAL)**:
         - IF HAS BUSINESS: Give 3 specific steps to fix "${problem}". Mention "Website Optimization", "Lead Generation", and "Instagram Funnels".
         - IF NO BUSINESS: Give a plan to start a "Web Design Agency" or "Instagram Business". Step 1: Learn Skill, Step 2: Personal Brand, Step 3: First Client.
      3. **The Yalda Blessing**: A poetic closing wishes them wealth.
      
      Keep it actionable but styled like an ancient scroll.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text || "تحلیل داده‌ها امکان‌پذیر نیست. اما نام تو در کتیبه‌ها ثبت شد.";
  } catch (error) {
    return "ارتباط با سرور تاریخ قطع شد. اما پیروزی تو جاودانه است.";
  }
};