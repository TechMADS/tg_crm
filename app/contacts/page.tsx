import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import SearchBar from './SearchBar'

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams

  const contacts = await prisma.contact.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
          ],
        }
      : undefined,
    include: { company: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-black dark:text-zinc-50">Contacts</h1>
        <div className="flex items-center gap-3">
          <SearchBar />
          <Link
            href="/contacts/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap"
          >
            + Add Contact
          </Link>
        </div>
      </div>

      <table className="w-full text-left border-collapse bg-white dark:bg-zinc-900 rounded-lg shadow">
        <thead>
          <tr className="border-b dark:border-zinc-800 text-sm text-zinc-500 dark:text-zinc-400">
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Phone</th>
            <th className="py-3 px-4">Company</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id} className="border-b last:border-0 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800">
              <td className="py-3 px-4">
                <Link href={`/contacts/${c.id}`} className="text-blue-600 hover:underline">
                  {c.firstName} {c.lastName}
                </Link>
              </td>
              <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{c.email ?? '-'}</td>
              <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{c.phone ?? '-'}</td>
              <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{c.company?.name ?? '-'}</td>
            </tr>
          ))}
          {contacts.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 px-4 text-center text-zinc-400">
                {q ? `No contacts matching "${q}"` : 'No contacts yet.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}