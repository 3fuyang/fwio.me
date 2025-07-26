import { useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface NotesFilterProps {
  onFilterChange: (filter: FilterType) => void
}

type FilterType = 'all' | 'readings' | 'regular'

// TODO: extract to a generic shared component
export default function NotesFilter({
  onFilterChange,
}: NotesFilterProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')

  return (
    <Tabs
      value={selectedFilter}
      onValueChange={(value) => {
        setSelectedFilter(value as FilterType)
        onFilterChange(value as FilterType)
      }}
    >
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="regular">Regular Notes</TabsTrigger>
        <TabsTrigger value="readings">Reading Notes</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
