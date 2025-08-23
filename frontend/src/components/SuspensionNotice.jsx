import React from 'react'
import { Button } from './ui/button'
import { Printer } from 'lucide-react'

const SuspensionNotice = ({ student, isOpen, onClose }) => {
  if (!isOpen) return null

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const noticeHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Suspension Notice - ${student.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @media print {
            #printBtn, #closeBtn {
              display: none;
            }
            body {
              margin: 0;
              padding: 20px;
            }
          }
        </style>
      </head>
      <body class="bg-gray-100 p-6">
        <!-- Print Button Visible on Screen Only -->
        <div class="flex justify-center gap-4 mb-6">
          <button id="printBtn" onclick="window.print()" 
            class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700">
            Print Notice
          </button>
          <button id="closeBtn" onclick="window.close()" 
            class="bg-gray-600 text-white px-4 py-2 rounded-lg shadow hover:bg-gray-700">
            Close
          </button>
        </div>

        <!-- Notice (Hidden on Screen, Visible on Print) -->
        <div class="max-w-3xl mx-auto bg-white mt-6">
          
          <!-- Header -->
          <div class="text-center font-bold text-lg uppercase">
            <p>MAHARISHI MARKANDESHWAR ENGINEERING COLLEGE,</p>
            <p>MULLANA (AMBALA)</p>
            <p class="border-b-2 border-black mt-2"></p>
          </div>

          <!-- Notice No and Date -->
          <div class="flex justify-between text-sm mt-6 font-bold">
            <p>No. MMEC/2025/173</p>
            <p>${currentDate}</p>
          </div>

          <!-- Title -->
          <h2 class="text-center font-bold underline mt-6">NOTICE</h2>

          <!-- Body -->
          <p class="mt-6 leading-relaxed text-justify">
            The following student of B.Tech Degree Course, is hereby,
            <span class="font-bold">suspended from the College & Hostel</span> with immediate effect. 
            He is not allowed to attend the classes till further orders:
          </p>

          <!-- Student Table -->
          <div class="flex justify-center mt-6">
            <table class="border border-black text-center">
              <tr>
                <th class="border border-black px-4 py-2">Roll No.</th>
                <th class="border border-black px-4 py-2">Name</th>
                <th class="border border-black px-4 py-2">Section</th>
              </tr>
              <tr>
                <td class="border border-black px-4 py-2">${student.rollNumber}</td>
                <td class="border border-black px-4 py-2">${student.name}</td>
                <td class="border border-black px-4 py-2">${student.section}</td>
              </tr>
            </table>
          </div>

          <p class="mt-6">
            The parents of the above student are required to meet the Dean Students Welfare immediately.
          </p>

          <div class="mt-16 text-right font-bold">
            <p>PRINCIPAL</p>
          </div>

          <!-- Footer -->
          <div class="mt-10 text-sm">
            <p><span class="font-bold underline">HODs (Concerned)</span></p>
            <p><span class="font-bold underline">Notice Boards</span></p>
            <p class="mt-2">CC :</p>
            <ol class="list-decimal list-inside">
              <li>Dean (Academic Affairs)</li>
              <li>Dean (Students Welfare)</li>
              <li>Academic Branch</li>
              <li>Parents of concerned student</li>
              <li>Personal file</li>
              <li>Director (Security)</li>
              <li>PA to Principal</li>
            </ol>
          </div>
        </div>
      </body>
      </html>
    `

    printWindow.document.write(noticeHTML)
    printWindow.document.close()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Generate Suspension Notice</h3>
          
          <div className="mb-6 text-left">
            <p className="mb-2"><strong>Student Name:</strong> {student.name}</p>
            <p className="mb-2"><strong>Roll Number:</strong> {student.rollNumber}</p>
            <p className="mb-2"><strong>Section:</strong> {student.section}</p>
          </div>

          <div className="flex gap-3 justify-center">
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2"
            >
              <Printer className="h-4 w-4" />
              Generate & Print Notice
            </Button>
            
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuspensionNotice
