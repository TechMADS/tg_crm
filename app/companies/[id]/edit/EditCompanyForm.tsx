'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Company = {
  id: string
  name: string
  website: string | null
  industry: string | null
}

export default function EditCompanyForm({ company }: { company: Company }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: company.name,
    website: company.website ?? '',
    industry: company.industry ?? '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/companies/${company.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      router.push(`/companies/${company.id}`)
      router.refresh()
    } else {
      alert('Failed to update company')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Company name"
        required
        className="w-full border dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Website"
        className="w-full border dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />
      <input
        type="text"
        placeholder="Industry"
        className="w-full border dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
        value={form.industry}
        onChange={(e) => setForm({ ...form, industry: e.target.value })}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}