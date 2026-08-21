import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import SearchBar from './SearchBar'

export default async function CompaniesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  const companies = await prisma.company.findMany({ 
    where: q
      ? { name: { contains: q, mode: 'insensitive' } }
      : undefined,
    include: { _count: { select: { contacts: true, deals: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-black dark:text-zinc-50">Companies</h1>
        <div className="flex items-center gap-3">
          <SearchBar />
          <Link
            href="/companies/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            + Add Company
          </Link>
        </div>
      </div>

      <table className="w-full text-left border-collapse bg-white dark:bg-zinc-900 rounded-lg shadow">
        <thead>
          <tr className="border-b dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Industry</th>
            <th className="py-3 px-4">Website</th>
            <th className="py-3 px-4">Contacts</th>
            <th className="py-3 px-4">Deals</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id} className="border-b last:border-0 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <td className="py-3 px-4">
                <Link href={`/companies/${c.id}`} className="text-blue-600 hover:underline">
                  {c.name}
                </Link>
              </td>
              <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{c.industry ?? '-'}</td>
              <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{c.website ?? '-'}</td>
              <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{c._count.contacts}</td>
              <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{c._count.deals}</td>
            </tr>
          ))}
          {companies.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 px-4 text-center text-zinc-400">
                {q ? `No companies matching "${q}"` : 'No companies yet.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}