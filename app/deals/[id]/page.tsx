import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteDealButton from './DeleteDealButton'

export default async function DealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const deal = await prisma.deal.findUnique({
    where: { id },
    include: { contact: true, company: true, owner: true },
  })

  if (!deal) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/deals" className="text-sm text-blue-600 hover:underline">
        ← Back to Deals
      </Link>

      <div className="flex justify-between items-start mt-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
            {deal.title}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 capitalize">
            Stage: {deal.stage}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/deals/${deal.id}/edit`}
            className="border dark:border-zinc-700 px-4 py-2 rounded-md text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 text-black dark:text-zinc-50"
          >
            Edit
          </Link>
          <DeleteDealButton id={deal.id} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 mb-6 space-y-2">
        <Field label="Value" value={`$${deal.value.toLocaleString()}`} />
        <Field label="Stage" value={deal.stage} />
        <Field
          label="Contact"
          value={deal.contact ? `${deal.contact.firstName} ${deal.contact.lastName}` : null}
          href={deal.contact ? `/contacts/${deal.contact.id}` : undefined}
        />
        <Field
          label="Company"
          value={deal.company?.name ?? null}
          href={deal.company ? `/companies/${deal.company.id}` : undefined}
        />
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  href,
}: {
  label: string
  value: string | null
  href?: string
}) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-zinc-500 dark:text-zinc-400">{label}</span>
      {value && href ? (
        <Link href={href} className="text-blue-600 hover:underline">
          {value}
        </Link>
      ) : (
        <span className="text-black dark:text-zinc-50">{value ?? '-'}</span>
      )}
    </div>
  )
}