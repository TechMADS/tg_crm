'use client'

import { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import Link from 'next/link'

type Deal = {
  id: string
  title: string
  value: number
  stage: string
  contact: { firstName: string; lastName: string } | null
  company: { name: string } | null
}

const STAGES = [
  { key: 'new', label: 'New' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'proposal', label: 'Proposal' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
]

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 0,
})

function formatCurrency(value: number) {
  return `$${numberFormatter.format(value)}`
}

export default function KanbanBoard({
  initialDeals,
}: {
  initialDeals: Deal[]
  contacts: unknown[]
  companies: unknown[]
}) {
  const [deals, setDeals] = useState(initialDeals)

  async function handleDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId) return

    const newStage = destination.droppableId

    // Optimistic update — update UI immediately
    setDeals((prev) =>
      prev.map((d) => (d.id === draggableId ? { ...d, stage: newStage } : d))
    )

    // Persist to DB
    const res = await fetch(`/api/deals/${draggableId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
    })

    if (!res.ok) {
      // Roll back on failure
      setDeals(initialDeals)
      alert('Failed to update deal stage')
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const stageDeals = deals.filter((d) => d.stage === stage.key)
          const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0)

          return (
            <Droppable droppableId={stage.key} key={stage.key}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-shrink-0 w-72 rounded-lg p-3 ${
                    snapshot.isDraggingOver
                      ? 'bg-blue-50 dark:bg-zinc-800'
                      : 'bg-zinc-100 dark:bg-zinc-900'
                  }`}
                >
                  <div className="flex justify-between items-center mb-3 px-1">
                    <h2 className="font-semibold text-sm text-black dark:text-zinc-50">
                      {stage.label} ({stageDeals.length})
                    </h2>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatCurrency(stageTotal)}
                    </span>
                  </div>

                  <div className="space-y-2 min-h-[40px]">
                    {stageDeals.map((deal, index) => (
                      <Draggable draggableId={deal.id} index={index} key={deal.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white dark:bg-zinc-800 rounded-md p-3 shadow-sm border dark:border-zinc-700 ${
                              snapshot.isDragging ? 'shadow-lg' : ''
                            }`}
                          >
                            <Link
                              href={`/deals/${deal.id}`}
                              className="font-medium text-sm text-black dark:text-zinc-50 hover:underline block mb-1"
                            >
                              {deal.title}
                            </Link>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {deal.contact
                                ? `${deal.contact.firstName} ${deal.contact.lastName}`
                                : deal.company?.name ?? 'No contact'}
                            </p>
                            <p className="text-sm font-semibold text-black dark:text-zinc-50 mt-2">
                              {formatCurrency(deal.value)}
                            </p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          )
        })}
      </div>
    </DragDropContext>
  )
}