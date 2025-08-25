const API_BASE = 'http://127.0.0.1:5000/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Get all students
  async getAllStudents() {
    return this.request('/students')
  }

  // Get active students only
  async getActiveStudents() {
    return this.request('/students/active')
  }

  // Suspend a student
  async suspendStudent(studentId, reason) {
    return this.request(`/students/${studentId}/suspend`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    })
  }

  // Unsuspend a student
  async unsuspendStudent(studentId) {
    return this.request(`/students/${studentId}/unsuspend`, {
      method: 'PUT',
    })
  }

  // Health check
  async healthCheck() {
    return this.request('/health')
  }
}

export const apiService = new ApiService()