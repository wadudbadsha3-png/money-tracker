// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/lib/models/Transaction';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    let query: any = {};

    if (category) query.category = category;
    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    // ✅ Optimized Query
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(500)           // ← প্রথম ৫০০টা লোড করবে (পরে pagination যোগ করবো)
      .lean();              // ← অনেক ফাস্ট করে (plain JS object)

    return NextResponse.json<ApiResponse<typeof transactions>>({
      success: true,
      data: transactions,
    });
  } catch (error: any) {
    console.error('GET Transactions Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST অংশটা একই রাখলাম (শুধু ছোট উন্নতি)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.amount || !body.type || !body.category || !body.date || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.create({
      amount: body.amount,
      type: body.type,
      category: body.category,
      date: new Date(body.date),
      description: body.description,
    });

    return NextResponse.json(
      { success: true, data: transaction },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('POST Transaction Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}