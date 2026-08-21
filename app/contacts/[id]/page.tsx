import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'

async function deleteContact(formData: FormData) {
  'use server'

  const id = formData.get('id')
  if (typeof id !== 'string') return

  await prisma.contact.delete({ where: { id } })
  redirect('/contacts')
}

function DeleteContactButton({ id }: { id: string }) {
  return (
    <form action={deleteContact}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="border border-red-300 text-red-600 dark:border-red-800 px-4 py-2 rounded-md text-sm hover:bg-red-50 dark:hover:bg-red-950"
      >
        Delete
      </button>
    </form>
  )
}

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const contact = await prisma.contact.findUnique({
    where: { id },
    include: { company: true, deals: true, notes: { orderBy: { createdAt: 'desc' } } },
  })

  if (!contact) notFound()

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/contacts" className="text-sm text-blue-600 hover:underline">
        ← Back to Contacts
      </Link>

      <div className="flex justify-between items-start mt-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
            {contact.firstName} {contact.lastName}
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            {contact.company?.name ?? 'No company'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/contacts/${contact.id}/edit`}
            className="border dark:border-zinc-700 px-4 py-2 rounded-md text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 text-black dark:text-zinc-50"
          >
            Edit
          </Link>
          <DeleteContactButton id={contact.id} />
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 mb-6 space-y-2">
        <Field label="Email" value={contact.email} />
        <Field label="Phone" value={contact.phone} />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 mb-6">
        <h2 className="font-semibold mb-3 text-black dark:text-zinc-50">
          Deals ({contact.deals.length})
        </h2>
        {contact.deals.length === 0 ? (
          <p className="text-zinc-400 text-sm">No deals yet.</p>
        ) : (
          <ul className="space-y-2">
            {contact.deals.map((d) => (
              <li key={d.id} className="flex justify-between text-sm">
                <span className="text-black dark:text-zinc-50">{d.title}</span>
                <span className="text-zinc-500 dark:text-zinc-400 capitalize">{d.stage}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4">
        <h2 className="font-semibold mb-3 text-black dark:text-zinc-50">
          Notes ({contact.notes.length})
        </h2>
        {contact.notes.length === 0 ? (
          <p className="text-zinc-400 text-sm">No notes yet.</p>
        ) : (
          <ul className="space-y-2">
            {contact.notes.map((n) => (
              <li key={n.id} className="text-sm text-zinc-700 dark:text-zinc-300 border-b last:border-0 dark:border-zinc-800 pb-2">
                {n.content}
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