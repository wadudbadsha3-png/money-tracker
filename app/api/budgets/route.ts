// app/api/budgets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Budget from '@/lib/models/Budget';   // এখনো বানাতে হবে
import { CreateBudgetInput, ApiResponse } from '@/lib/types';

export async function GET() {
  try {
    await dbConnect();
    const budgets = await Budget.find({}).sort({ createdAt: -1 });

    return NextResponse.json<ApiResponse<typeof budgets>>({
      success: true,
      data: budgets,
    });
  } catch (error) {
    console.error('GET Budgets Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch budgets' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body: CreateBudgetInput = await request.json();

    if (!body.categoryId || !body.limit || !body.period) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const budget = await Budget.create({
      categoryId: body.categoryId,
      categoryName: body.categoryName || '', 
      limit: body.limit,
      period: body.period,
    });

    return NextResponse.json<ApiResponse<typeof budget>>(
      { success: true, data: budget },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST Budget Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to create budget' },
      { status: 500 }
    );
  }
}