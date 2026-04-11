import { NextRequest, NextResponse } from 'next/server'
import { getTransactionById, updateTransaction, deleteTransaction } from '@/lib/mock-data'
import { UpdateTransactionInput, ApiResponse } from '@/lib/types'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const transaction = getTransactionById(id)

    if (!transaction) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Transaction not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<typeof transaction>>({
      success: true,
      data: transaction,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to fetch transaction',
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
    const body: UpdateTransactionInput = await request.json()

    const transaction = updateTransaction(id, body)

    if (!transaction) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Transaction not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<typeof transaction>>({
      success: true,
      data: transaction,
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to update transaction',
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
    const success = deleteTransaction(id)

    if (!success) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: 'Transaction not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: 'Transaction deleted successfully',
    })
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        error: 'Failed to delete transaction',
      },
      { status: 500 }
    )
  }
}
