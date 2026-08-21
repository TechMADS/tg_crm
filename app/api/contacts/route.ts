import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/contacts - list all contacts
export async function GET() {
    const contacts = await prisma.contact.findMany({
        include: { company: true },
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(contacts)
}

// POST /api/contacts - create a new contact
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        if (!body.firstName || !body.lastName) {
            return NextResponse.json(
                { error: 'First name and last name are required' },
                { status: 400 }
            )
        }

        const companyId = body.companyId?.trim() || null

        if (companyId) {
            const company = await prisma.company.findUnique({
                where: { id: companyId },
                select: { id: true },
            })

            if (!company) {
                return NextResponse.json(
                    { error: 'Company not found. Leave Company ID blank or enter an existing company ID.' },
                    { status: 400 }
                )
            }
        }

        const contact = await prisma.contact.create({
            data: {
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email || null,
                phone: body.phone || null,
                companyId,
            },
        })

        return NextResponse.json(contact, { status: 201 })
    } catch (error) {
        console.error('Failed to create contact:', error)
        return NextResponse.json(
            { error: 'Failed to create contact' },
            { status: 500 }
        )
    }
}