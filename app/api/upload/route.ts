import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs'; // Ensure Node APIs are available

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract files from formData
    const files: File[] = [];
    for (const [key, value] of formData.entries()) {
      console.log("uploading: ", key)
      if (value instanceof File) {
        files.push(value);
      }
    }

    // Enforce a maximum of 50 files
    if (files.length > 50) {
      return NextResponse.json({ success: false, error: 'Too many files. Maximum allowed is 50.' }, { status: 400 });
    }

    const filesDir = path.join(process.cwd(), 'public', 'files');

    // Ensure that the files directory exists
    if (!fs.existsSync(filesDir)) {
      fs.mkdirSync(filesDir, { recursive: true });
    }

    // Write each file to the files directory
    for (const file of files) {
      const filePath = path.join("public", file.name);
      const arrayBuffer = await file.arrayBuffer();
      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "something went wrong" }, { status: 500 });
  }
}
