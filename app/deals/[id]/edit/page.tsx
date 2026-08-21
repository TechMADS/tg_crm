import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditDealForm from './EditDealForm'

export default async function EditDealPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [deal, contacts, companies] = await Promise.all([
    prisma.deal.findUnique({ where: { id } }),
    prisma.contact.findMany({ orderBy: { firstName: 'asc' } }),
    prisma.company.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!deal) notFound()

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">Edit Deal</h1>
      <EditDealForm deal={deal} contacts={contacts} companies={companies} />
    </div>
  )
}