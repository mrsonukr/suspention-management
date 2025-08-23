import React from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Eye, UserCheck, UserX, Printer } from 'lucide-react'

const StudentTable = ({ 
  students, 
  onViewReason, 
  onSuspendStudent, 
  onUnsuspendStudent,
  onPrintNotice,
  isAdmin = false 
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Roll Number</TableHead>
            <TableHead>Section</TableHead>
            <TableHead>Batch</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            {isAdmin && <TableHead>Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow 
              key={student.id} 
              className={student.isSuspended ? 'bg-red-50 dark:bg-red-950/20' : ''}
            >
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.rollNumber}</TableCell>
              <TableCell>{student.section}</TableCell>
              <TableCell>{student.batch}</TableCell>
              <TableCell>
                <Badge 
                  variant={student.isSuspended ? 'destructive' : 'success'}
                >
                  {student.isSuspended ? 'Suspended' : 'Active'}
                </Badge>
              </TableCell>
              <TableCell>
                {student.isSuspended && student.reason ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewReason(student.name, student.reason)}
                    className="h-8"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View Reason
                  </Button>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              {isAdmin && (
                <TableCell>
                  <div className="flex gap-2">
                    {student.isSuspended ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUnsuspendStudent(student.id, student.name, student.reason)}
                          className="h-8 text-green-600 hover:text-green-700"
                        >
                          <UserCheck className="h-3 w-3 mr-1" />
                          Unsuspend
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPrintNotice(student)}
                          className="h-8 text-blue-600 hover:text-blue-700"
                        >
                          <Printer className="h-3 w-3 mr-1" />
                          Print Notice
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSuspendStudent(student.id, student.name, student.rollNumber)}
                        className="h-8 text-red-600 hover:text-red-700"
                      >
                        <UserX className="h-3 w-3 mr-1" />
                        Suspend
                      </Button>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default StudentTable