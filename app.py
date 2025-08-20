from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# Database configuration
DB_CONFIG = {
    'host': 'localhost',
    'port': 3306,
    'database': 'pystudent',
    'user': 'root',
    'password': ''  # Default XAMPP MySQL password is empty
}

def get_db_connection():
    """Create and return database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/')
def index():
    """Serve the main HTML page"""
    return render_template('index.html')

@app.route('/api/students', methods=['GET'])
def get_all_students():
    """Get all students from database"""
    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Query to get all students
        query = "SELECT * FROM students ORDER BY id"
        cursor.execute(query)
        
        students = cursor.fetchall()
        
        # Convert datetime objects to string for JSON serialization
        for student in students:
            if 'created_at' in student:
                student['created_at'] = student['created_at'].isoformat() if student['created_at'] else None
            if 'updated_at' in student:
                student['updated_at'] = student['updated_at'].isoformat() if student['updated_at'] else None
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'count': len(students),
            'students': students
        }), 200
        
    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/students/active', methods=['GET'])
def get_active_students():
    """Get only non-suspended students"""
    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Query to get only active (non-suspended) students
        query = "SELECT * FROM students WHERE isSuspended = FALSE ORDER BY name"
        cursor.execute(query)
        
        students = cursor.fetchall()
        
        # Convert datetime objects to string for JSON serialization
        for student in students:
            if 'created_at' in student:
                student['created_at'] = student['created_at'].isoformat() if student['created_at'] else None
            if 'updated_at' in student:
                student['updated_at'] = student['updated_at'].isoformat() if student['updated_at'] else None
        
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'count': len(students),
            'students': students
        }), 200
        
    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        connection = get_db_connection()
        if connection:
            connection.close()
            return jsonify({'status': 'healthy', 'database': 'connected'}), 200
        else:
            return jsonify({'status': 'unhealthy', 'database': 'disconnected'}), 500
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

@app.route('/admin')
def admin_panel():
    """Serve the admin panel HTML page"""
    return render_template('admin.html')

@app.route('/api/students/<int:student_id>/suspend', methods=['PUT'])
def suspend_student(student_id):
    """Suspend a student"""
    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Update student suspension status
        query = "UPDATE students SET isSuspended = TRUE WHERE id = %s"
        cursor.execute(query, (student_id,))
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'error': 'Student not found'}), 404
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'message': 'Student suspended successfully'
        }), 200
        
    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/students/<int:student_id>/unsuspend', methods=['PUT'])
def unsuspend_student(student_id):
    """Unsuspend a student"""
    try:
        connection = get_db_connection()
        if connection is None:
            return jsonify({'error': 'Database connection failed'}), 500
        
        cursor = connection.cursor(dictionary=True)
        
        # Update student suspension status
        query = "UPDATE students SET isSuspended = FALSE WHERE id = %s"
        cursor.execute(query, (student_id,))
        
        if cursor.rowcount == 0:
            cursor.close()
            connection.close()
            return jsonify({'error': 'Student not found'}), 404
        
        connection.commit()
        cursor.close()
        connection.close()
        
        return jsonify({
            'success': True,
            'message': 'Student unsuspended successfully'
        }), 200
        
    except Error as e:
        return jsonify({'error': f'Database error: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
