'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteCompanyButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this company? This cannot be undone.')) return

    setLoading(true)
    const res = await fetch(`/api/companies/${id}`, { method: 'DELETE' })
    setLoading(false)

    if (res.ok) {
      router.push('/companies')
      router.refresh()
    } else {
      alert('Failed to delete company')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="border border-red-300 text-red-600 px-4 py-2 rounded-md text-sm hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete'}
    </button>
  )
}