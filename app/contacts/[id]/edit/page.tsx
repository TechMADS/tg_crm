import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'

function EditContactForm({ contact }: { contact: any }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600 dark:text-zinc-300">Editing contact: {contact?.name ?? contact?.email ?? contact?.id}</p>
    </div>
  )
}

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const contact = await prisma.contact.findUnique({ where: { id } })

  if (!contact) notFound()

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">Edit Contact</h1>
      <EditContactForm contact={contact} />
    </div>
  )
}