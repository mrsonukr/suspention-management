import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  BarChart3, LineChart as LineChartIcon, PieChart as PieChartIcon, 
  TrendingUp, Users, UserX, AlertTriangle 
} from 'lucide-react'

const AnalyticsPanel = ({ students }) => {
  const [chartType, setChartType] = useState('bar')
  const [viewMode, setViewMode] = useState('suspensions')

  // Calculate analytics data
  const analyticsData = useMemo(() => {
    const sectionStats = {}
    
    students.forEach(student => {
      if (!sectionStats[student.section]) {
        sectionStats[student.section] = {
          total: 0,
          suspended: 0,
          active: 0
        }
      }
      
      sectionStats[student.section].total++
      if (student.isSuspended) {
        sectionStats[student.section].suspended++
      } else {
        sectionStats[student.section].active++
      }
    })

    return Object.entries(sectionStats).map(([section, stats]) => ({
      section,
      total: stats.total,
      suspended: stats.suspended,
      active: stats.active,
      suspensionRate: ((stats.suspended / stats.total) * 100).toFixed(1)
    }))
  }, [students])

  // Calculate overall statistics
  const overallStats = useMemo(() => {
    const total = students.length
    const suspended = students.filter(s => s.isSuspended).length
    const active = total - suspended
    
    return {
      total,
      suspended,
      active,
      suspensionRate: total > 0 ? ((suspended / total) * 100).toFixed(1) : 0
    }
  }, [students])

  // Chart color schemes
  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

  // Render different chart types
  const renderChart = () => {
    const data = viewMode === 'suspensions' 
      ? analyticsData.map(item => ({ ...item, value: item.suspended, name: item.section }))
      : analyticsData.map(item => ({ ...item, value: item.total, name: item.section }))

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="section" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="suspended" fill="#ef4444" name="Suspended" />
              <Bar dataKey="active" fill="#22c55e" name="Active" />
            </BarChart>
          </ResponsiveContainer>
        )
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="section" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="suspended" stroke="#ef4444" strokeWidth={3} name="Suspended" />
              <Line type="monotone" dataKey="active" stroke="#22c55e" strokeWidth={3} name="Active" />
            </LineChart>
          </ResponsiveContainer>
        )
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="section" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="suspended" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} name="Suspended" />
              <Area type="monotone" dataKey="active" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} name="Active" />
            </AreaChart>
          </ResponsiveContainer>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">View:</span>
          <Button
            variant={viewMode === 'suspensions' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('suspensions')}
          >
            Suspensions
          </Button>
          <Button
            variant={viewMode === 'overview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('overview')}
          >
            Overview
          </Button>
        </div>
      </div>

      {/* Overall Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overallStats.active}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspended Students</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overallStats.suspended}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspension Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{overallStats.suspensionRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              onClick={() => setChartType('bar')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Bar Chart
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              onClick={() => setChartType('line')}
              className="flex items-center gap-2"
            >
              <LineChartIcon className="h-4 w-4" />
              Line Chart
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              onClick={() => setChartType('pie')}
              className="flex items-center gap-2"
            >
              <PieChartIcon className="h-4 w-4" />
              Pie Chart
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              onClick={() => setChartType('area')}
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Area Chart
            </Button>
          </div>
          
          {renderChart()}
        </CardContent>
      </Card>

      {/* Detailed Section Table */}
      <Card>
        <CardHeader>
          <CardTitle>Section-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Section</th>
                  <th className="text-left p-2">Total Students</th>
                  <th className="text-left p-2">Active</th>
                  <th className="text-left p-2">Suspended</th>
                  <th className="text-left p-2">Suspension Rate</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.map((section) => (
                  <tr key={section.section} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{section.section}</td>
                    <td className="p-2">{section.total}</td>
                    <td className="p-2 text-green-600">{section.active}</td>
                    <td className="p-2 text-red-600">{section.suspended}</td>
                    <td className="p-2 text-orange-600">{section.suspensionRate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalyticsPanel
