import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteCompanyButton from './DeleteCompanyButton'

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      contacts: true,
      deals: { orderBy: { createdAt: 'desc' } },
    },
  })

  if (!company) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/companies" className="text-sm text-blue-600 hover:underline">
        ← Back to Companies
      </Link>

      <div className="flex justify-between items-start mt-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
            {company.name}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {company.industry ?? 'No industry set'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/companies/${company.id}/edit`}
            className="border dark:border-zinc-700 px-4 py-2 rounded-md text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 text-black dark:text-zinc-50"
          >
            Edit
          </Link>
          <DeleteCompanyButton id={company.id} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 mb-6 space-y-2">
        <Field label="Website" value={company.website} />
        <Field label="Industry" value={company.industry} />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold mb-3 text-black dark:text-zinc-50">
          Contacts ({company.contacts.length})
        </h2>
        {company.contacts.length === 0 ? (
          <p className="text-zinc-400 text-sm">No contacts linked yet.</p>
        ) : (
          <ul className="space-y-2">
            {company.contacts.map((c) => (
              <li key={c.id} className="text-sm">
                <Link href={`/contacts/${c.id}`} className="text-blue-600 hover:underline">
                  {c.firstName} {c.lastName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
        <h2 className="font-semibold mb-3 text-black dark:text-zinc-50">
          Deals ({company.deals.length})
        </h2>
        {company.deals.length === 0 ? (
          <p className="text-zinc-400 text-sm">No deals yet.</p>
        ) : (
          <ul className="space-y-2">
            {company.deals.map((d) => (
              <li key={d.id} className="flex justify-between text-sm">
                <span className="text-black dark:text-zinc-50">{d.title}</span>
                <span className="text-zinc-500 dark:text-zinc-400 capitalize">{d.stage}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      <span className="text-black dark:text-zinc-50">{value ?? '-'}</span>
    </div>
  )
}