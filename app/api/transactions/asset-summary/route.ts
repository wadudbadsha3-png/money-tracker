// app/api/transactions/asset-summary/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/lib/models/Transaction';

export async function GET() {
  try {
    await dbConnect();
    
    const assetSummary = await Transaction.getAssetSummary();
    
    return NextResponse.json({
      success: true,
      data: assetSummary,
    });
  } catch (error: any) {
    console.error('Asset Summary Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch asset summary' },
      { status: 500 }
    );
  }
}