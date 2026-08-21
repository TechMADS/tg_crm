import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: { contact: true, company: true },
  })

  if (!deal) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json(deal)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const deal = await prisma.deal.update({
    where: { id },
    data: {
      ...(body.title !== undefined && { title: body.title }),
      ...(body.value !== undefined && { value: parseFloat(body.value) }),
      ...(body.stage !== undefined && { stage: body.stage }),
      ...(body.contactId !== undefined && { contactId: body.contactId || null }),
      ...(body.companyId !== undefined && { companyId: body.companyId || null }),
    },
  })

  return NextResponse.json(deal)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  await prisma.deal.delete({ where: { id } })
  return NextResponse.json({ success: true })
}