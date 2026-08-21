import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function Home() {
  const [contactCount, companyCount, dealCount, deals] = await Promise.all([
    prisma.contact.count(),
    prisma.company.count(),
    prisma.deal.count(),
    prisma.deal.findMany({
      where: { stage: { not: 'won' } },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { contact: true, company: true },
    }),
  ])

  const dealValue = await prisma.deal.aggregate({
    _sum: { value: true },
    where: { stage: { notIn: ['won', 'lost'] } },
  })

  return (
    <div className="flex flex-col flex-1 bg-zinc-50 dark:bg-black min-h-screen">
      <main className="w-full max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-2xl font-bold text-black dark:text-zinc-50 mb-8">
          Dashboard
        </h1>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard label="Contacts" value={contactCount} href="/contacts" />
          <StatCard label="Companies" value={companyCount} href="/companies" />
          <StatCard label="Open Deals" value={dealCount} href="/deals" />
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 mb-10">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Open pipeline value
          </p>
          <p className="text-3xl font-semibold text-black dark:text-zinc-50">
            ${(dealValue._sum.value ?? 0).toLocaleString()}
          </p>
        </div>

        {/* Recent deals */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow">
          <div className="flex justify-between items-center p-4 border-b dark:border-zinc-800">
            <h2 className="font-semibold text-black dark:text-zinc-50">
              Recent Deals
            </h2>
            <Link href="/deals" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <table className="w-full text-left">
            <tbody>
              {deals.map((d: {
                id: string
                title: string
                stage: string
                value: number
                contact: { firstName: string; lastName: string } | null
                company: { name: string } | null
              }) => (
                <tr key={d.id} className="border-b last:border-0 dark:border-zinc-800">
                  <td className="py-3 px-4 text-black dark:text-zinc-50">
                    {d.title}
                  </td>
                  <td className="py-3 px-4 text-zinc-500 dark:text-zinc-400">
                    {d.contact ? `${d.contact.firstName} ${d.contact.lastName}` : d.company?.name ?? '-'}
                  </td>
                  <td className="py-3 px-4 capitalize text-zinc-500 dark:text-zinc-400">
                    {d.stage}
                  </td>
                  <td className="py-3 px-4 text-right text-black dark:text-zinc-50">
                    ${d.value.toLocaleString()}
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 px-4 text-center text-zinc-400">
                    No deals yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 hover:shadow-md transition-shadow"
    >
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="text-3xl font-semibold text-black dark:text-zinc-50">{value}</p>
    </Link>
  )
}