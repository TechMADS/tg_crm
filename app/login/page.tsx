'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email: '', password: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Invalid email or password')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-zinc-900 rounded-lg shadow p-8 w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-black dark:text-zinc-50 mb-2">
          Sign in to CRM
        </h1>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          required
          className="w-full border dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          required
          className="w-full border dark:border-zinc-700 rounded-md px-3 py-2 bg-white dark:bg-zinc-900 text-black dark:text-zinc-50"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}