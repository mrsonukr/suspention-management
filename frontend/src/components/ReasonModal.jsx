import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'
import { Info } from 'lucide-react'

const ReasonModal = ({ 
  isOpen, 
  onClose, 
  studentName, 
  reason 
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Suspension Reason Details
          </DialogTitle>
          <DialogDescription>
            Details about why this student was suspended.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Student Name:</label>
            <p className="text-sm text-muted-foreground">{studentName}</p>
          </div>
          
          <div className="grid gap-2">
            <label className="text-sm font-medium">Suspension Reason:</label>
            <div className="border rounded-md p-3 bg-muted/50">
              <p className="text-sm">{reason}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ReasonModal