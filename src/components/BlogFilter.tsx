import { useState } from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface BlogFilterProps {
  onFilterChange: (filter: FilterType) => void
}

type FilterType = 'all' | 'en' | 'zh'

export default function BlogFilter({
  onFilterChange,
}: BlogFilterProps) {
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
        <TabsTrigger value="en">English</TabsTrigger>
        <TabsTrigger value="zh">中文</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}