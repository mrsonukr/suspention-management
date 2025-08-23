import React, { useState, useEffect, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { GraduationCap, Shield, Users, Search as SearchIcon, BarChart3, CheckCircle } from 'lucide-react'
import { Button } from './components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './components/ui/dialog'
import SearchFilters from './components/SearchFilters'
import StatsCards from './components/StatsCards'
import StudentTable from './components/StudentTable'
import SuspensionModal from './components/SuspensionModal'
import ReasonModal from './components/ReasonModal'
import SuspensionNotice from './components/SuspensionNotice'
import Pagination from './components/Pagination'
import AnalyticsPanel from './components/AnalyticsPanel'
import { apiService } from './services/api'

// Hook to debounce search input
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Main App Component
const StudentManagementApp = ({ isAdmin = false }) => {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sectionFilter, setSectionFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [suspensionModal, setSuspensionModal] = useState({ isOpen: false, student: null })
  const [reasonModal, setReasonModal] = useState({ isOpen: false, student: null, reason: '' })
  const [currentView, setCurrentView] = useState('main') // 'main' or 'analytics'
  const [printNotice, setPrintNotice] = useState({ isOpen: false, student: null })
  const [successDialog, setSuccessDialog] = useState({ isOpen: false, studentName: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, studentId: null, studentName: '', reason: '' })
  
  const { toast } = useToast()
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const studentsPerPage = 50

  // Load students data
  const loadStudents = async () => {
    setLoading(true)
    try {
      const response = await apiService.getAllStudents()
      if (response.success) {
        setStudents(response.students)
      } else {
        toast({
          title: "Error",
          description: "Failed to load students",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error connecting to server",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  // Filter students based on search and filters
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = !debouncedSearchTerm || 
        student.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      
      const matchesSection = !sectionFilter || sectionFilter === 'all' || student.section === sectionFilter
      
      let matchesStatus = true
      if (statusFilter === 'active') {
        matchesStatus = !student.isSuspended
      } else if (statusFilter === 'suspended') {
        matchesStatus = student.isSuspended
      }
      
      return matchesSearch && matchesSection && matchesStatus
    })
  }, [students, debouncedSearchTerm, sectionFilter, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage)
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * studentsPerPage
    return filteredStudents.slice(startIndex, startIndex + studentsPerPage)
  }, [filteredStudents, currentPage, studentsPerPage])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, sectionFilter, statusFilter])

  // Statistics
  const totalStudents = students.length
  const suspendedStudents = students.filter(s => s.isSuspended).length

  // Handle suspension
  const handleSuspendStudent = (studentId, studentName, studentRoll) => {
    setSuspensionModal({
      isOpen: true,
      student: { id: studentId, name: studentName, rollNumber: studentRoll }
    })
  }

  const confirmSuspension = async (reason) => {
    try {
      const response = await apiService.suspendStudent(suspensionModal.student.id, reason)
      if (response.success) {
        toast({
          title: "Success",
          description: "Student suspended successfully!",
          variant: "success",
        })
        await loadStudents()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to suspend student",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error suspending student",
        variant: "destructive",
      })
    }
  }

  // Handle unsuspension
  const handleUnsuspendStudent = async (studentId, studentName, reason) => {
    setConfirmDialog({ isOpen: true, studentId, studentName, reason })
  }

  // Confirm unsuspension
  const confirmUnsuspension = async () => {
    const { studentId, studentName } = confirmDialog
    
    try {
      const response = await apiService.unsuspendStudent(studentId)
      if (response.success) {
        setSuccessDialog({ isOpen: true, studentName: studentName })
        setConfirmDialog({ isOpen: false, studentId: null, studentName: '', reason: '' })
        await loadStudents()
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to unsuspend student",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error unsuspending student",
        variant: "destructive",
      })
    }
  }

  // Handle view reason
  const handleViewReason = (studentName, reason) => {
    setReasonModal({
      isOpen: true,
      student: studentName,
      reason: reason
    })
  }

  // Handle print notice
  const handlePrintNotice = (student) => {
    setPrintNotice({
      isOpen: true,
      student: student
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading students...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Suspension Management System
            </h1>
            {isAdmin && <Shield className="h-8 w-8 text-purple-600" />}
          </div>
          <p className="text-lg text-muted-foreground">
            {isAdmin ? 'Administrative Control Panel' : 'View and search student information'}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2">
            <Button asChild variant={!isAdmin ? "default" : "outline"}>
              <Link to="/">
                <Users className="h-4 w-4 mr-2" />
                Public View
              </Link>
            </Button>
            <Button asChild variant={isAdmin ? "default" : "outline"}>
              <Link to="/admin">
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Link>
            </Button>
          </div>
        </div>

        {/* Admin Analytics Navigation */}
        {isAdmin && (
          <div className="flex justify-center mb-6">
            <div className="flex gap-2">
              <Button
                variant={currentView === 'main' ? "default" : "outline"}
                onClick={() => setCurrentView('main')}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                Student Management
              </Button>
              <Button
                variant={currentView === 'analytics' ? "default" : "outline"}
                onClick={() => setCurrentView('analytics')}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics Dashboard
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {currentView === 'main' ? (
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SearchIcon className="h-5 w-5" />
                {isAdmin ? 'Student Management' : 'Student Directory'}
              </CardTitle>
              <CardDescription>
                {isAdmin 
                  ? 'Manage student records and suspension status' 
                  : 'View and search student information'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Statistics */}
              <StatsCards 
                totalStudents={totalStudents} 
                suspendedStudents={suspendedStudents} 
              />

              {/* Search and Filters */}
              <SearchFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                sectionFilter={sectionFilter}
                onSectionChange={setSectionFilter}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
              />

              {/* Results Info */}
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  Showing {paginatedStudents.length} of {filteredStudents.length} students
                  {filteredStudents.length !== totalStudents && ` (filtered from ${totalStudents} total)`}
                </p>
              </div>

              {/* Students Table */}
              {filteredStudents.length === 0 ? (
                <div className="text-center py-12">
                  <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">No students found</h3>
                  <p className="text-muted-foreground">Try adjusting your search criteria</p>
                </div>
              ) : (
                <>
                  <StudentTable
                    students={paginatedStudents}
                    onViewReason={handleViewReason}
                    onSuspendStudent={handleSuspendStudent}
                    onUnsuspendStudent={handleUnsuspendStudent}
                    onPrintNotice={handlePrintNotice}
                    isAdmin={isAdmin}
                  />

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </CardContent>
          </Card>
        ) : (
          <AnalyticsPanel students={students} />
        )}

        {/* Modals */}
        <SuspensionModal
          isOpen={suspensionModal.isOpen}
          onClose={() => setSuspensionModal({ isOpen: false, student: null })}
          onConfirm={confirmSuspension}
          studentName={suspensionModal.student?.name || ''}
          studentRoll={suspensionModal.student?.rollNumber || ''}
        />

        <ReasonModal
          isOpen={reasonModal.isOpen}
          onClose={() => setReasonModal({ isOpen: false, student: null, reason: '' })}
          studentName={reasonModal.student}
          reason={reasonModal.reason}
        />

        <SuspensionNotice
          student={printNotice.student}
          isOpen={printNotice.isOpen}
          onClose={() => setPrintNotice({ isOpen: false, student: null })}
        />

        {/* Success Dialog */}
        <Dialog open={successDialog.isOpen} onOpenChange={(open) => setSuccessDialog({ isOpen: open, studentName: '' })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Student Unsuspended Successfully
              </DialogTitle>
              <DialogDescription>
                {successDialog.studentName} has been successfully unsuspended and can now access all services.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={() => setSuccessDialog({ isOpen: false, studentName: '' })}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Confirmation Dialog */}
        <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => setConfirmDialog({ isOpen: open, studentId: null, studentName: '', reason: '' })}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Confirm Unsuspension
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to unsuspend {confirmDialog.studentName}?
                {confirmDialog.reason && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-md">
                    <p className="text-sm font-medium text-gray-700">Current suspension reason:</p>
                    <p className="text-sm text-gray-600 mt-1">{confirmDialog.reason}</p>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setConfirmDialog({ isOpen: false, studentId: null, studentName: '', reason: '' })}
              >
                Cancel
              </Button>
              <Button onClick={confirmUnsuspension}>
                Confirm Unsuspension
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// Router Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentManagementApp isAdmin={false} />} />
        <Route path="/admin" element={<StudentManagementApp isAdmin={true} />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App