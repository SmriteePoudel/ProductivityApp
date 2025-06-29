import { NextResponse } from "next/server";

// In-memory notes array
let notes = [];

// GET - Fetch all notes
export async function GET(request) {
  return NextResponse.json({ notes });
}

// POST - Create a new note
export async function POST(request) {
  try {
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }
    const note = {
      id: Date.now().toString(),
      title,
      content,
      createdAt: new Date().toISOString(),
    };
    notes.push(note);
    return NextResponse.json(
      { message: "Note created", note },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
