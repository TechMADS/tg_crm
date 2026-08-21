import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const company = await prisma.company.findUnique({
    where: { id },
    include: { contacts: true, deals: true },
  })

  if (!company) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(company)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const company = await prisma.company.update({
    where: { id },
    data: {
      name: body.name,
      website: body.website,
      industry: body.industry,
    },
  })

  return NextResponse.json(company)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.company.delete({ where: { id } })
  return NextResponse.json({ success: true })
}