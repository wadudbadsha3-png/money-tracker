import { NextRequest, NextResponse } from 'next/server'
import { getBudgetById, updateBudget, deleteBudget } from '@/lib/mock-data'
import { UpdateBudgetInput, ApiResponse } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const budget = getBudgetById(id)

    if (!budget) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Budget not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<typeof budget>>({
      success: true,
      data: budget,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to fetch budget',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body: UpdateBudgetInput = await request.json()

    const budget = updateBudget(id, body)

    if (!budget) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Budget not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<typeof budget>>({
      success: true,
      data: budget,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to update budget',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const success = deleteBudget(id)

    if (!success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Budget not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Budget deleted successfully',
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to delete budget',
      },
      { status: 500 }
    )
  }
}
