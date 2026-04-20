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
    if (type && (type === 'income' || type === 'expense' || type === 'transfer')) {
      query.type = type;
    }
    
    // ডেট রেঞ্জ ফিল্টার
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

<<<<<<< HEAD
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(500)
      .lean();
=======
    // ✅ Optimized Query with Pagination
    const skip = (page - 1) * limit;
    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Transaction.countDocuments(query);
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f

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

<<<<<<< HEAD
=======
// ✅ আপডেটেড POST - Transfer সাপোর্ট সহ
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    console.log('📥 Received payload:', body);

<<<<<<< HEAD
    const { amount, type, category, date, description, personName, accountName } = body;

    if (!amount || !date) {
      console.log('❌ Missing fields:', { amount, date });
=======
    // বেসিক ভ্যালিডেশন
    if (!body.amount || !body.type || !body.category || !body.date || !body.description) {
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount and date are required' },
        { status: 400 }
      );
    }

<<<<<<< HEAD
    // LEND
    if (category === 'Lend') {
      const transaction = await Transaction.create({
        amount: parseFloat(amount),
        type: 'expense',
        category: 'Lend',
        date: new Date(date),
        description: description || '',
        personName: personName || null,
      });
      console.log('✅ Lend created:', transaction);
      return NextResponse.json({ success: true, data: transaction }, { status: 201 });
    }

    // RETURN
    if (category === 'Return') {
      const pendingLends = await Transaction.find({
        category: 'Lend',
        type: 'expense',
        personName: personName,
      }).sort({ date: 1 });

      console.log(`🔍 Found ${pendingLends.length} pending lends for ${personName}`);

      if (pendingLends.length === 0) {
        return NextResponse.json(
          { success: false, error: `No pending lend found for ${personName}` },
          { status: 400 }
        );
      }

      let returnAmount = parseFloat(amount);
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
        date: new Date(date),
        description: description || '',
        personName: personName,
      });

      console.log('✅ Return created:', returnRecord);
      return NextResponse.json({ success: true, data: returnRecord }, { status: 201 });
    }

    // SAVINGS
    if (category === 'Savings') {
      const transaction = await Transaction.create({
        amount: parseFloat(amount),
        type: 'expense',
        category: 'Savings',
        date: new Date(date),
        description: description || '',
        accountName: accountName || null,
      });
      console.log('✅ Savings created:', transaction);
      return NextResponse.json({ success: true, data: transaction }, { status: 201 });
    }

    // SAVINGS WITHDRAW
    if (category === 'Savings Withdraw') {
      const savingsEntries = await Transaction.find({
        category: 'Savings',
        type: 'expense',
        accountName: accountName,
      }).sort({ date: 1 });

      console.log(`🔍 Found ${savingsEntries.length} savings entries for ${accountName}`);

      if (savingsEntries.length === 0) {
        return NextResponse.json(
          { success: false, error: `No savings found for ${accountName}` },
          { status: 400 }
        );
      }

      let withdrawAmount = parseFloat(amount);
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
        date: new Date(date),
        description: description || '',
        accountName: accountName,
      });

      console.log('✅ Withdraw created:', withdrawRecord);
      return NextResponse.json({ success: true, data: withdrawRecord }, { status: 201 });
    }

    // NORMAL INCOME/EXPENSE
    const transaction = await Transaction.create({
      amount: parseFloat(amount),
      type: type,
      category: category,
      date: new Date(date),
      description: description || '',
    });
=======
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
>>>>>>> 331615a85d70ecb1c598a746fde1d0391e5a333f

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
// PUT METHOD (EDIT) - Adjustment সহ
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

    // =============================================
    // যদি RETURN ট্রানজেকশন এডিট করা হয়
    // =============================================
    if (oldTransaction.category === 'Return') {
      console.log('🔄 Editing a RETURN transaction - Recalculating adjustment...');
      
      // পুরানো adjustment সরাও (আগের lend ফিরিয়ে আনো)
      if (oldTransaction.personName) {
        const oldLend = await Transaction.findOne({
          category: 'Lend',
          type: 'expense',
          personName: oldTransaction.personName,
        });
        
        if (oldLend) {
          const newAmount = oldLend.amount + oldTransaction.amount;
          await Transaction.findByIdAndUpdate(oldLend._id, {
            amount: newAmount,
            description: `${oldLend.description} (Restored from edit)`
          });
          console.log(`↩️ Restored lend: ${oldLend._id} to amount ${newAmount}`);
        } else {
          await Transaction.create({
            amount: oldTransaction.amount,
            type: 'expense',
            category: 'Lend',
            date: oldTransaction.date,
            description: `Restored from edit: ${oldTransaction.description}`,
            personName: oldTransaction.personName,
          });
          console.log(`🆕 Created new lend for ${oldTransaction.personName}`);
        }
      }
      
      // নতুন adjustment প্রয়োগ করো
      if (body.category === 'Return' && body.personName) {
        const pendingLends = await Transaction.find({
          category: 'Lend',
          type: 'expense',
          personName: body.personName,
        }).sort({ date: 1 });
        
        let returnAmount = parseFloat(body.amount);
        let remainingReturn = returnAmount;
        
        console.log(`🔍 Found ${pendingLends.length} pending lends for ${body.personName}`);
        
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
      }
    }

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