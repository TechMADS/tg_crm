import { prisma } from '@/lib/prisma'
import NewDealForm from './NewDealForm'

export default async function NewDealPage() {
  const [contacts, companies] = await Promise.all([
    prisma.contact.findMany({ orderBy: { firstName: 'asc' } }),
    prisma.company.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">Add Deal</h1>
      <NewDealForm contacts={contacts} companies={companies} />
    </div>
  )
}