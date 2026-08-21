import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const deals = await prisma.deal.findMany({
    include: { contact: true, company: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(deals)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!body.title) {
    return NextResponse.json({ error: 'Deal title is required' }, { status: 400 })
  }

  const deal = await prisma.deal.create({
    data: {
      title: body.title,
      value: body.value ? parseFloat(body.value) : 0,
      stage: body.stage || 'new',
      contactId: body.contactId || null,
      companyId: body.companyId || null,
    },
  })

  return NextResponse.json(deal, { status: 201 })
}