import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  const client = await clientPromise;
  const db = client.db("your_database_name");

  const agents = await db.collection("agents").find({}).toArray();
  return NextResponse.json(agents);
}

export async function POST(request: Request) {
  const client = await clientPromise;
  const db = client.db("your_database_name");

  const { name, prompt } = await request.json();
  const result = await db.collection("agents").insertOne({ name, prompt });

  return NextResponse.json({ _id: result.insertedId, name, prompt });
}
