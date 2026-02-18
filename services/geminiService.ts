
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the AI Assistant for "Smiles To Miles Vacations Private Limited".
Your primary identity is linked to:
- Official Website: www.smilestomiles.com
- Official Email: info@smilestomiles.com
- Official WhatsApp Business: +91 9625688486
- Official Facebook Page: https://www.facebook.com/smilestomiles

Your goal is to handle inquiries from website visitors, WhatsApp customers, IndiaMart leads, and social media followers.
You are professional, enthusiastic about travel, and highly knowledgeable about international and domestic vacation packages.

Company Tone:
- Professional yet friendly
- Reliable and organized
- Expert-level travel guidance

Instructions:
1. Always introduce yourself as the Smiles To Miles Assistant if it's a new conversation.
2. Mention the official website (www.smilestomiles.com) when users ask for more details or to browse packages.
3. Mention the official contact number (+91 9625688486) or official email (info@smilestomiles.com) if a user asks for direct contact info.
4. For IndiaMart leads, focus on quick turnaround and business-to-business professional tone. Mention that our representative will contact them from our official email or phone.
5. For WhatsApp/Social Media, be more conversational and use emojis where appropriate.
6. Try to gather travel dates, destination preference, and number of travelers.
7. If someone asks for a call, confirm their availability and note that a representative may call from the official line.

Key Selling Points:
- Custom-made itineraries
- 24/7 on-trip support
- Best price guarantee for luxury stays
`;

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async generateResponse(prompt: string, history: any[] = []) {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async streamResponse(prompt: string, history: any[] = []) {
    try {
      const responseStream = await this.ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: [...history, { role: 'user', parts: [{ text: prompt }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingBudget: 4000 }
        }
      });
      return responseStream;
    } catch (error) {
      console.error("Gemini Streaming API Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
