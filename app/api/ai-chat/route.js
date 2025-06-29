import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "AI service is not configured. Please contact the administrator.",
        },
        { status: 500 }
      );
    }

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "https://productivity-app.vercel.app",
        "X-Title": "Productivity App AI Chat",
      },
      body: JSON.stringify({
        model: "anthropic/claude-3-haiku",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful AI assistant for a productivity app. Help users with task management, project planning, time management, and general productivity advice. Keep responses concise and practical.",
          },
          ...messages.map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const errorData = await res
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error("OpenRouter API error:", errorData);

      // Handle specific error cases
      if (res.status === 404) {
        return NextResponse.json(
          {
            error: "AI model is currently unavailable. Please try again later.",
          },
          { status: 503 }
        );
      }

      if (res.status === 401) {
        return NextResponse.json(
          {
            error: "AI service authentication failed. Please contact support.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          error:
            errorData.error?.message ||
            "AI service is temporarily unavailable. Please try again.",
        },
        { status: 500 }
      );
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json(
        {
          error: "Sorry, I couldn't generate a response. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("AI Chat API error:", err);
    return NextResponse.json(
      {
        error: "Server error. Please try again later.",
      },
      { status: 500 }
    );
  }
}
