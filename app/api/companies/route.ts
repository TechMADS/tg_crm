import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { contacts: true, deals: true } } },
  })
  return NextResponse.json(companies)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  if (!body.name) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 })
  }

  const company = await prisma.company.create({
    data: {
      name: body.name,
      website: body.website || null,
      industry: body.industry || null,
    },
  })

  return NextResponse.json(company, { status: 201 })
}