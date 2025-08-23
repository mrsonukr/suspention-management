import React, { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { UserX } from 'lucide-react'

const SuspensionModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  studentName, 
  studentRoll 
}) => {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError('Suspension reason is required')
      return
    }
    onConfirm(reason.trim())
    setReason('')
    setError('')
    onClose()
  }

  const handleClose = () => {
    setReason('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5 text-red-500" />
            Suspend Student
          </DialogTitle>
          <DialogDescription>
            Please provide a reason for suspending this student.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="studentName">Student Name</Label>
            <Input
              id="studentName"
              value={studentName}
              readOnly
              className="bg-muted"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="studentRoll">Roll Number</Label>
            <Input
              id="studentRoll"
              value={studentRoll}
              readOnly
              className="bg-muted"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="reason">
              Suspension Reason <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder="Please provide a detailed reason for suspending this student..."
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              rows={4}
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            <UserX className="h-4 w-4 mr-2" />
            Confirm Suspension
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SuspensionModal