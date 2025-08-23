import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Users, UserX } from 'lucide-react'

const StatsCards = ({ totalStudents, suspendedStudents }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Students</CardTitle>
          <Users className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalStudents}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Suspended Students</CardTitle>
          <UserX className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{suspendedStudents}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsCards