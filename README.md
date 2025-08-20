# Student Management API

A Flask API to manage student data with MySQL database.

## Setup Instructions

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Database Setup
- Make sure XAMPP is running with MySQL on port 3306
- Create database named `pystudent`
- Import the `students.sql` file into your database

### 3. Run the API
```bash
python app.py
```

The API will start on `http://localhost:5000`

## API Endpoints

### 1. Get All Students
```
GET /api/students
```
Returns all students from the database.

### 2. Get Active Students Only
```
GET /api/students/active
```
Returns only non-suspended students.

### 3. Health Check
```
GET /api/health
```
Checks if the API and database are working properly.

## Example Response
```json
{
  "success": true,
  "count": 6,
  "students": [
    {
      "id": 1,
      "rollNumber": "11232763",
      "name": "Sonu Kumar",
      "section": "C1",
      "batch": "2023",
      "isSuspended": false,
      "created_at": "2024-01-01T10:00:00",
      "updated_at": "2024-01-01T10:00:00"
    }
  ]
}
```

## Database Configuration
- Host: localhost
- Port: 3306
- Database: pystudent
- User: root
- Password: (empty for default XAMPP setup)

If your XAMPP MySQL has a different password, update the `DB_CONFIG` in `app.py`.
