import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface UserProfile {
  // Add your user profile properties here
  // Example:
  // id?: string;
  // name?: string;
  // email?: string;
  // interests?: string[];
  [key: string]: any; // Allow for flexible properties
}

interface RequestBody {
  message: string;
  userProfile: UserProfile;
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { message, userProfile } = body;

    const systemPrompt = `
You are Aqua, a short, chill, Gen-Z style chatbot. 
  Keep responses brief (2–4 lines max), use emojis sparingly, 
  and sound conversational — like texting a friend, not teaching a class. 
  Example tone: “Sure thing! Try starting with small steps 💪
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // fallback if gpt-5-mini not available
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    return NextResponse.json(
      { reply: response.choices[0].message.content },
      { status: 200 }
    );
  } catch (err) {
    console.error("OpenAI API failed:", err);
    return NextResponse.json(
      { reply: "⚠️ Aqua's thinking pool ran dry, try again later!" },
      { status: 500 }
    );
  }
}