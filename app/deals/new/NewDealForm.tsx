'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Contact = { id: string; firstName: string; lastName: string }
type Company = { id: string; name: string }

export default function NewDealForm({
  contacts,
  companies,
}: {
  contacts: Contact[]
  companies: Company[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    value: '',
    stage: 'new',
    contactId: '',
    companyId: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/deals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/deals')
      router.refresh()
    } else {
      const data = await res.json()
      alert(data.error ?? 'Failed to create deal')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Deal title"
        required
        className="w-full border dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        type="number"
        placeholder="Value ($)"
        className="w-full border dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
        value={form.value}
        onChange={(e) => setForm({ ...form, value: e.target.value })}
      />
      <select
        className="w-full border dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
        value={form.stage}
        onChange={(e) => setForm({ ...form, stage: e.target.value })}
      >
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="proposal">Proposal</option>
        <option value="won">Won</option>
        <option value="lost">Lost</option>
      </select>
      <select
        className="w-full border dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
        value={form.contactId}
        onChange={(e) => setForm({ ...form, contactId: e.target.value })}
      >
        <option value="">No contact</option>
        {contacts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.firstName} {c.lastName}
          </option>
        ))}
      </select>
      <select
        className="w-full border dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
        value={form.companyId}
        onChange={(e) => setForm({ ...form, companyId: e.target.value })}
      >
        <option value="">No company</option>
        {companies.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Deal'}
      </button>
    </form>
  )
}