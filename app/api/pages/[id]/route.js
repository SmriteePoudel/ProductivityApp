import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Page from "@/lib/models/Page";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req, { params }) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const page = await Page.findById(params.id);
  if (
    !page ||
    (String(page.user) !== String(user._id) &&
      !page.sharedWith.includes(user._id))
  ) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 404 }
    );
  }
  return NextResponse.json({ page });
}

export async function PUT(req, { params }) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const page = await Page.findById(params.id);
  if (!page || String(page.user) !== String(user._id)) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 404 }
    );
  }
  const { name, boxes } = await req.json();
  if (name) page.name = name;
  if (boxes) page.boxes = boxes;
  await page.save();
  return NextResponse.json({ page });
}

export async function DELETE(req, { params }) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const page = await Page.findById(params.id);
  if (!page || String(page.user) !== String(user._id)) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 404 }
    );
  }
  await page.deleteOne();
  return NextResponse.json({ success: true });
}

export async function PATCH(req, { params }) {
  await dbConnect();
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const page = await Page.findById(params.id);
  if (!page || String(page.user) !== String(user._id)) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 404 }
    );
  }
  const { name, shareWith } = await req.json();
  if (name) page.name = name;
  if (shareWith) page.sharedWith = shareWith;
  await page.save();
  return NextResponse.json({ page });
}
