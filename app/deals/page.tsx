import { prisma } from '@/lib/prisma'
import KanbanBoard from './KanbanBoard'
import Link from 'next/link'

export default async function DealsPage() {
  const [deals, contacts, companies] = await Promise.all([
    prisma.deal.findMany({
      include: { contact: true, company: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contact.findMany({ orderBy: { firstName: 'asc' } }),
    prisma.company.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black dark:text-zinc-50">Deals Pipeline</h1>
        <Link
          href="/deals/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Deal
        </Link>
      </div>

      <KanbanBoard
        initialDeals={deals}
        contacts={contacts}
        companies={companies}
      />
    </div>
  )
}