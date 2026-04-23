// app/api/transactions/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Transaction from '@/lib/models/Transaction';

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
    if (type && (type === 'income' || type === 'expense' || type === 'transfer' || type === 'liability')) {
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

    return NextResponse.json({
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
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// ✅ আপডেটেড POST - Loan Taken & Loan Repayment সাপোর্ট সহ
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    console.log('📥 Received payload:', body);

    // বেসিক ভ্যালিডেশন
    if (!body.amount || !body.date || !body.description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount, date and description are required' },
        { status: 400 }
      );
    }

    // =============================================
    // LOAN TAKEN (নেওয়া) - Liability
    // =============================================
    if (body.category === 'Loan Taken') {
      const transaction = await Transaction.create({
        amount: parseFloat(body.amount),
        type: 'liability',
        category: 'Loan Taken',
        date: new Date(body.date),
        description: body.description || '',
        loanPersonName: body.loanPersonName || body.personName || null,
        personName: body.loanPersonName || body.personName || null,
      });
      console.log('✅ Loan Taken created:', transaction);
      return NextResponse.json({ success: true, data: transaction }, { status: 201 });
    }

    // =============================================
    // LOAN REPAYMENT (পরিশোধ) - Reduce Liability
    // =============================================
    if (body.category === 'Loan Repayment') {
      // আগের সব Loan Taken খুঁজে বের করো
      const pendingLoans = await Transaction.find({
        category: 'Loan Taken',
        type: 'liability',
        loanPersonName: body.loanPersonName || body.personName,
      }).sort({ date: 1 });

      console.log(`🔍 Found ${pendingLoans.length} pending loans for ${body.loanPersonName || body.personName}`);

      if (pendingLoans.length === 0) {
        return NextResponse.json(
          { success: false, error: `No pending loan found for ${body.loanPersonName || body.personName}` },
          { status: 400 }
        );
      }

      let repaymentAmount = parseFloat(body.amount);
      let remainingRepayment = repaymentAmount;

      for (const loan of pendingLoans) {
        if (remainingRepayment <= 0) break;

        if (remainingRepayment >= loan.amount) {
          remainingRepayment -= loan.amount;
          await Transaction.findByIdAndDelete(loan._id);
          console.log(`🗑️ Deleted loan: ${loan._id}`);
        } else {
          const newAmount = loan.amount - remainingRepayment;
          await Transaction.findByIdAndUpdate(loan._id, {
            amount: newAmount,
            description: `${loan.description} ($${remainingRepayment} repaid, $${newAmount} remaining)`
          });
          console.log(`✏️ Updated loan: ${loan._id} from ${loan.amount} to ${newAmount}`);
          remainingRepayment = 0;
        }
      }

      const repaymentRecord = await Transaction.create({
        amount: repaymentAmount,
        type: 'liability',
        category: 'Loan Repayment',
        date: new Date(body.date),
        description: body.description || '',
        loanPersonName: body.loanPersonName || body.personName,
        personName: body.loanPersonName || body.personName,
      });

      console.log('✅ Loan Repayment created:', repaymentRecord);
      return NextResponse.json({ success: true, data: repaymentRecord }, { status: 201 });
    }

    // =============================================
    // LEND
    // =============================================
    if (body.category === 'Lend') {
      const transaction = await Transaction.create({
        amount: parseFloat(body.amount),
        type: 'expense',
        category: 'Lend',
        date: new Date(body.date),
        description: body.description || '',
        personName: body.personName || null,
      });
      console.log('✅ Lend created:', transaction);
      return NextResponse.json({ success: true, data: transaction }, { status: 201 });
    }

    // =============================================
    // RETURN
    // =============================================
    if (body.category === 'Return') {
      const pendingLends = await Transaction.find({
        category: 'Lend',
        type: 'expense',
        personName: body.personName,
      }).sort({ date: 1 });

      console.log(`🔍 Found ${pendingLends.length} pending lends for ${body.personName}`);

      if (pendingLends.length === 0) {
        return NextResponse.json(
          { success: false, error: `No pending lend found for ${body.personName}` },
          { status: 400 }
        );
      }

      let returnAmount = parseFloat(body.amount);
      let remainingReturn = returnAmount;

      for (const lend of pendingLends) {
        if (remainingReturn <= 0) break;

        if (remainingReturn >= lend.amount) {
          remainingReturn -= lend.amount;
          await Transaction.findByIdAndDelete(lend._id);
          console.log(`🗑️ Deleted lend: ${lend._id}`);
        } else {
          const newAmount = lend.amount - remainingReturn;
          await Transaction.findByIdAndUpdate(lend._id, {
            amount: newAmount,
            description: `${lend.description} ($${remainingReturn} returned, $${newAmount} remaining)`
          });
          console.log(`✏️ Updated lend: ${lend._id} from ${lend.amount} to ${newAmount}`);
          remainingReturn = 0;
        }
      }

      const returnRecord = await Transaction.create({
        amount: returnAmount,
        type: 'expense',
        category: 'Return',
        date: new Date(body.date),
        description: body.description || '',
        personName: body.personName,
      });

      console.log('✅ Return created:', returnRecord);
      return NextResponse.json({ success: true, data: returnRecord }, { status: 201 });
    }

    // =============================================
    // SAVINGS
    // =============================================
    if (body.category === 'Savings') {
      const transaction = await Transaction.create({
        amount: parseFloat(body.amount),
        type: 'expense',
        category: 'Savings',
        date: new Date(body.date),
        description: body.description || '',
        accountName: body.accountName || null,
      });
      console.log('✅ Savings created:', transaction);
      return NextResponse.json({ success: true, data: transaction }, { status: 201 });
    }

    // =============================================
    // SAVINGS WITHDRAW
    // =============================================
    if (body.category === 'Savings Withdraw') {
      const savingsEntries = await Transaction.find({
        category: 'Savings',
        type: 'expense',
        accountName: body.accountName,
      }).sort({ date: 1 });

      console.log(`🔍 Found ${savingsEntries.length} savings entries for ${body.accountName}`);

      if (savingsEntries.length === 0) {
        return NextResponse.json(
          { success: false, error: `No savings found for ${body.accountName}` },
          { status: 400 }
        );
      }

      let withdrawAmount = parseFloat(body.amount);
      let remainingWithdraw = withdrawAmount;

      for (const savings of savingsEntries) {
        if (remainingWithdraw <= 0) break;

        if (remainingWithdraw >= savings.amount) {
          remainingWithdraw -= savings.amount;
          await Transaction.findByIdAndDelete(savings._id);
          console.log(`🗑️ Deleted savings: ${savings._id}`);
        } else {
          const newAmount = savings.amount - remainingWithdraw;
          await Transaction.findByIdAndUpdate(savings._id, {
            amount: newAmount,
            description: `${savings.description} ($${remainingWithdraw} withdrawn, $${newAmount} remaining)`
          });
          console.log(`✏️ Updated savings: ${savings._id} from ${savings.amount} to ${newAmount}`);
          remainingWithdraw = 0;
        }
      }

      const withdrawRecord = await Transaction.create({
        amount: withdrawAmount,
        type: 'expense',
        category: 'Savings Withdraw',
        date: new Date(body.date),
        description: body.description || '',
        accountName: body.accountName,
      });

      console.log('✅ Withdraw created:', withdrawRecord);
      return NextResponse.json({ success: true, data: withdrawRecord }, { status: 201 });
    }

    // =============================================
    // NORMAL INCOME/EXPENSE
    // =============================================
    if (!body.type || (body.type !== 'income' && body.type !== 'expense')) {
      return NextResponse.json(
        { success: false, error: 'Valid type (income/expense) is required for normal transactions' },
        { status: 400 }
      );
    }

    const transactionData: any = {
      amount: parseFloat(body.amount),
      type: body.type,
      category: body.category,
      date: new Date(body.date),
      description: body.description,
    };

    const transaction = await Transaction.create(transactionData);

    console.log('✅ Normal transaction created:', transaction);
    return NextResponse.json(
      { success: true, data: transaction },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ POST Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

// =============================================
// PUT METHOD (EDIT)
// =============================================
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const body = await request.json();
    
    console.log('✏️ EDIT Request - ID:', id);
    console.log('📦 EDIT Data:', body);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID required' },
        { status: 400 }
      );
    }

    // পুরানো ট্রানজেকশন খুঁজে বের করো
    const oldTransaction = await Transaction.findById(id);
    
    if (!oldTransaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    console.log('📜 Old Transaction:', oldTransaction);

    // সাধারণ আপডেট ডাটা প্রস্তুত
    const updateData: any = {
      amount: parseFloat(body.amount),
      type: body.type,
      category: body.category,
      date: new Date(body.date),
      description: body.description || '',
    };

    if (body.personName !== undefined) {
      updateData.personName = body.personName;
    }
    
    if (body.accountName !== undefined) {
      updateData.accountName = body.accountName;
    }
    
    if (body.loanPersonName !== undefined) {
      updateData.loanPersonName = body.loanPersonName;
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    if (!updatedTransaction) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    console.log('✅ EDIT Success:', updatedTransaction._id);
    
    return NextResponse.json({
      success: true,
      data: updatedTransaction
    });
    
  } catch (error: any) {
    console.error('❌ EDIT Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update transaction' },
      { status: 500 }
    );
  }
}

// =============================================
// DELETE METHOD
// =============================================
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('🗑️ DELETE Request - ID:', id);

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID required' },
        { status: 400 }
      );
    }

    await Transaction.findByIdAndDelete(id);

    console.log('✅ DELETE Success:', id);

    return NextResponse.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}