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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '500');
    const page = parseInt(searchParams.get('page') || '1');

    let query: any = {};

    if (category) query.category = category;
    if (type && (type === 'income' || type === 'expense' || type === 'transfer')) {
      query.type = type;
    }
    
    // ডেট রেঞ্জ ফিল্টার
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // ✅ Optimized Query with Pagination
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Transaction.countDocuments(query);

    return NextResponse.json<ApiResponse<typeof transactions>>({
      success: true,
      data: transactions,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('GET Transactions Error:', error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// ✅ আপডেটেড POST - Transfer সাপোর্ট সহ
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    // বেসিক ভ্যালিডেশন
    if (!body.amount || !body.type || !body.category || !body.date || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ট্রান্সফারের জন্য অতিরিক্ত ভ্যালিডেশন
    if (body.type === 'transfer') {
      if (!body.fromAccount || !body.toAccount) {
        return NextResponse.json(
          { success: false, error: 'Transfer requires fromAccount and toAccount' },
          { status: 400 }
        );
      }
    }

    // লোন ক্যাটাগরির জন্য হেল্পার মেসেজ (অপশনাল)
    if (body.category === 'Loan') {
      console.log('💡 Loan transaction:', body.type === 'income' ? 'Loan received' : 'Loan payment');
    }

    // সেভিংস ক্যাটাগরির জন্য অটো টাইপ চেক
    if (body.category === 'Savings' && body.type !== 'transfer') {
      return NextResponse.json(
        { success: false, error: 'Savings transactions must be of type "transfer"' },
        { status: 400 }
      );
    }

    const transactionData: any = {
      amount: body.amount,
      type: body.type,
      category: body.category,
      date: new Date(body.date),
      description: body.description,
    };

    // ট্রান্সফারের অতিরিক্ত ফিল্ড
    if (body.type === 'transfer') {
      transactionData.fromAccount = body.fromAccount;
      transactionData.toAccount = body.toAccount;
    }

    const transaction = await Transaction.create(transactionData);

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

// ✅ PUT রাউট - ট্রানজ্যাকশন আপডেটের জন্য
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // ট্রান্সফার টাইপ চেঞ্জ করলে ভ্যালিডেশন
    if (body.type === 'transfer' && (!body.fromAccount || !body.toAccount)) {
      return NextResponse.json(
        { success: false, error: 'Transfer requires fromAccount and toAccount' },
        { status: 400 }
      );
    }

    const updateData: any = { ...body };
    if (body.date) updateData.date = new Date(body.date);
    updateData.updatedAt = new Date();

    const transaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: transaction },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('PUT Transaction Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// ✅ DELETE রাউট - ট্রানজ্যাকশন ডিলিটের জন্য
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = request.nextUrl;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID required' },
        { status: 400 }
      );
    }

    const transaction = await Transaction.findByIdAndDelete(id);

    if (!transaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Transaction deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE Transaction Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}

// 🆕 অ্যাসেট সামারি API
export async function HEAD(request: NextRequest) {
  try {
    await dbConnect();
    
    // সব ট্রানজ্যাকশন
    const transactions = await Transaction.find({}).lean();
    
    let totalIncome = 0;
    let totalExpense = 0;
    let totalSavings = 0;
    let loansGiven = 0;
    let loansReturned = 0;
    
    for (const transaction of transactions) {
      // ইনকাম ট্র্যাকিং (লোন বাদে)
      if (transaction.type === 'income' && transaction.category !== 'Loan') {
        totalIncome += transaction.amount;
      }
      
      // এক্সপেন্স ট্র্যাকিং (সেভিংস ও লেন্ড বাদে)
      if (transaction.type === 'expense') {
        if (transaction.category !== 'Savings') {
          totalExpense += transaction.amount;
        }
        if (transaction.category === 'Lend') {
          loansGiven += transaction.amount;
        }
      }
      
      // ট্রান্সফার ট্র্যাকিং (সেভিংস)
      if (transaction.type === 'transfer' && transaction.category === 'Savings') {
        totalSavings += transaction.amount;
      }
      
      // রিটার্ন ট্র্যাকিং
      if (transaction.category === 'Return' && transaction.type === 'income') {
        loansReturned += transaction.amount;
      }
    }
    
    const netLoansGiven = loansGiven - loansReturned;
    const bankBalance = totalIncome - totalExpense - totalSavings - loansGiven;
    const savingsBalance = totalSavings;
    const totalAsset = bankBalance + savingsBalance + netLoansGiven;
    
    return NextResponse.json({
      success: true,
      data: {
        totalIncome,
        totalExpense,
        totalSavings,
        netLoansGiven,
        bankBalance,
        savingsBalance,
        loansGiven,
        loansReturned,
        totalAsset,
      },
    });
  } catch (error: any) {
    console.error('Asset Summary Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to calculate asset summary' },
      { status: 500 }
    );
  }
}