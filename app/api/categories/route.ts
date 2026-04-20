// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Category from '@/lib/models/Category'
import { CreateCategoryInput, ApiResponse } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    const categories = await Category.find({}).lean()
    
    return NextResponse.json<ApiResponse<typeof categories>>({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('GET Categories Error:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to fetch categories',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body: CreateCategoryInput = await request.json()

    if (!body.name || !body.icon || !body.type) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Missing required fields: name, icon, and type are required',
        },
        { status: 400 }
      )
    }

    const category = await Category.create({
      name: body.name,
      icon: body.icon,
      type: body.type,
      color: body.color || '#808080',
    })

    return NextResponse.json<ApiResponse<typeof category>>(
      {
        success: true,
        data: category,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST Category Error:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to create category',
      },
      { status: 500 }
    )
  }
}

// Optional: Add a route to pre-populate categories
export async function PUT(request: NextRequest) {
  try {
    await dbConnect()
    
    const defaultCategories = [
      { name: 'Salary', icon: '💰', type: 'income', color: '#4CAF50' },
      { name: 'Freelance', icon: '💻', type: 'income', color: '#2196F3' },
      { name: 'Business', icon: '📈', type: 'income', color: '#FF9800' },
      { name: 'Investment', icon: '📊', type: 'income', color: '#9C27B0' },
      { name: 'Gift', icon: '🎁', type: 'income', color: '#E91E63' },
      { name: 'Food', icon: '🍔', type: 'expense', color: '#F44336' },
      { name: 'Transport', icon: '🚗', type: 'expense', color: '#FF5722' },
      { name: 'Shopping', icon: '🛍️', type: 'expense', color: '#FFC107' },
      { name: 'Entertainment', icon: '🎬', type: 'expense', color: '#9C27B0' },
      { name: 'Bills', icon: '💡', type: 'expense', color: '#607D8B' },
      { name: 'Health', icon: '🏥', type: 'expense', color: '#E91E63' },
      { name: 'Education', icon: '📚', type: 'expense', color: '#3F51B5' },
      { name: 'Lend', icon: '📤', type: 'expense', color: '#FF9800' },
      { name: 'Return', icon: '📥', type: 'expense', color: '#4CAF50' },
      { name: 'Savings', icon: '🏦', type: 'transfer', color: '#2196F3' },
      { name: 'Loan', icon: '💰', type: 'expense', color: '#FF9800' },
      { name: 'Other', icon: '📝', type: 'expense', color: '#9E9E9E' }
    ];

    const addedCategories = [];
    
    for (const cat of defaultCategories) {
      const exists = await Category.findOne({ name: cat.name });
      
      if (!exists) {
        const newCategory = await Category.create(cat);
        addedCategories.push(newCategory);
      }
    }

    return NextResponse.json<ApiResponse<typeof addedCategories>>(
      {
        success: true,
        data: addedCategories,
        message: `${addedCategories.length} categories added successfully`
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('PUT Categories Error:', error)
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to add default categories',
      },
      { status: 500 }
    );
  }
}