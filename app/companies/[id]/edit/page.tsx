import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditCompanyForm from './EditCompanyForm'

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const company = await prisma.company.findUnique({ where: { id } })

  if (!company) notFound()

  return (
    <div className="p-8 max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-black dark:text-zinc-50">Edit Company</h1>
      <EditCompanyForm company={company} />
    </div>
  )
}