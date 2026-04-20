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

    let query: any = {};

    if (category) query.category = category;
    if (type && (type === 'income' || type === 'expense')) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .sort({ date: -1 })
      .limit(500)
      .lean();

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error: any) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    console.log('📥 Received payload:', body);

    const { amount, type, category, date, description, personName, accountName } = body;

    if (!amount || !date) {
      console.log('❌ Missing fields:', { amount, date });
      return NextResponse.json(
        { success: false, error: 'Missing required fields: amount and date are required' },
        { status: 400 }
      );
    }

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