import { NextRequest, NextResponse } from 'next/server'
import { getAllCategories, addCategory } from '@/lib/mock-data'
import { CreateCategoryInput, ApiResponse } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const categories = getAllCategories()
    return NextResponse.json<ApiResponse<typeof categories>>({
      success: true,
      data: categories,
    })
  } catch (error) {
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
    const body: CreateCategoryInput = await request.json()

    if (!body.name || !body.icon || !body.color) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      )
    }

    const category = addCategory({
      name: body.name,
      icon: body.icon,
      color: body.color,
    })

    return NextResponse.json<ApiResponse<typeof category>>(
      {
        success: true,
        data: category,
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to create category',
      },
      { status: 500 }
    )
  }
}
