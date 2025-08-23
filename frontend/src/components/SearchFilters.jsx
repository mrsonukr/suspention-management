import React from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Search } from 'lucide-react'

const SearchFilters = ({ 
  searchTerm, 
  onSearchChange, 
  sectionFilter, 
  onSectionChange, 
  statusFilter, 
  onStatusChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search by name or roll number..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={sectionFilter} onValueChange={onSectionChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Sections" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sections</SelectItem>
          <SelectItem value="A1">Section A1</SelectItem>
          <SelectItem value="A2">Section A2</SelectItem>
          <SelectItem value="A3">Section A3</SelectItem>
          <SelectItem value="B1">Section B1</SelectItem>
          <SelectItem value="B2">Section B2</SelectItem>
          <SelectItem value="B3">Section B3</SelectItem>
          <SelectItem value="C1">Section C1</SelectItem>
          <SelectItem value="C2">Section C2</SelectItem>
          <SelectItem value="C3">Section C3</SelectItem>
        </SelectContent>
      </Select>
      
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Students" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Students</SelectItem>
          <SelectItem value="active">Active Only</SelectItem>
          <SelectItem value="suspended">Suspended Only</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export default SearchFilters