'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DeleteContactButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Delete this contact? This cannot be undone.')) return

    setLoading(true)
    const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    setLoading(false)

    if (res.ok) {
      router.push('/contacts')
      router.refresh()
    } else {
      alert('Failed to delete contact')
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