from flask import Blueprint, request, jsonify
from ..models import Workload, Teacher, Course, Section, Room, TimetableEntry, Department
from .. import db
import random

scheduling_bp = Blueprint('scheduling', __name__)

# --- Workload Management ---

@scheduling_bp.route('/workloads', methods=['POST'])
def create_workload():
    """
    Assigns a teacher to a course for a specific section.
    Logic: Validates that the teacher is qualified for the course.
    """
    data = request.json
    teacher_id = data.get('teacher_id')
    course_id = data.get('course_id')
    section_id = data.get('section_id')
    hours = data.get('hours_per_week', 4)

    teacher = Teacher.query.get_or_404(teacher_id)
    course = Course.query.get_or_404(course_id)

    # Qualification Check (Domain Protection)
    if course not in teacher.qualified_courses:
        return jsonify({
            "error": f"Teacher {teacher.name} is not qualified to teach {course.name}."
        }), 400

    new_workload = Workload(
        teacher_id=teacher_id,
        course_id=course_id,
        section_id=section_id,
        hours_per_week=hours
    )
    
    db.session.add(new_workload)
    db.session.commit()
    
    return jsonify({"message": "Workload assigned successfully"}), 201

# --- Conflict Detection Logic ---

def check_conflict(day, timeslot, teacher_id=None, room_id=None, section_id=None):
    """
    Core engine logic to detect overlaps.
    Returns error message if conflict exists, else None.
    """
    query = TimetableEntry.query.filter_by(day=day, timeslot=timeslot)
    
    if teacher_id:
        if query.filter_by(teacher_id=teacher_id).first():
            return "Teacher occupied"
    
    if room_id:
        if query.filter_by(room_id=room_id).first():
            return "Room occupied"
            
    if section_id:
        if query.filter_by(section_id=section_id).first():
            return "Section occupied"
            
    return None

# --- Timetable Generation ---

@scheduling_bp.route('/generate', methods=['POST'])
def generate_timetable():
    """
    Advanced automated algorithm to generate timetable.
    Handles hierarchy, availability, capacity, and room types.
    """
    data = request.json
    dept_id = data.get('department_id')
    if not dept_id:
        return jsonify({"error": "Department ID is required"}), 400

    dept = Department.query.get_or_404(dept_id)
    TimetableEntry.query.filter_by(department_id=dept_id).delete()
    
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    timeslots = ['09:00-10:00', '10:00-11:00', '11:00-12:00', '01:00-02:00', '02:00-03:00']

    successful_entries = 0
    errors = []

    def is_teacher_available(teacher, day, slot):
        if not teacher.availability: return True
        return slot in teacher.availability.get(day, [])

    # Hierarchy Traversal: Programs -> Batches -> Sections
    for program in dept.programs:
        for batch in program.batches:
            for section in batch.sections:
                workloads = Workload.query.filter_by(section_id=section.id).all()
                
                for workload in workloads:
                    teacher = Teacher.query.get(workload.teacher_id)
                    course = Course.query.get(workload.course_id)
                    allocated_hours = 0
                    
                    # Optimization: Fill slots day-by-day to keep schedule compact
                    for day in days:
                        if allocated_hours >= workload.hours_per_week: break
                        for slot in timeslots:
                            if allocated_hours >= workload.hours_per_week: break
                            
                            # 1. Availability Check
                            if not is_teacher_available(teacher, day, slot): continue

                            # 2. Resource Matching (Type & Capacity)
                            potential_rooms = Room.query.filter(Room.capacity >= section.student_count).all()
                            if course.course_type == 'Lab':
                                potential_rooms = [r for r in potential_rooms if 'lab' in r.room_type.lower()]
                            else:
                                potential_rooms = [r for r in potential_rooms if 'lab' not in r.room_type.lower()]

                            # 3. Final Conflict Verification
                            valid_room = None
                            for room in potential_rooms:
                                if not check_conflict(day, slot, teacher_id=teacher.id, room_id=room.id, section_id=section.id):
                                    valid_room = room
                                    break
                            
                            if valid_room:
                                new_entry = TimetableEntry(
                                    day=day, timeslot=slot, section_id=section.id,
                                    course_id=workload.course_id, teacher_id=workload.teacher_id,
                                    room_id=valid_room.id, department_id=dept_id
                                )
                                db.session.add(new_entry)
                                allocated_hours += 1
                                successful_entries += 1
                    
                    if allocated_hours < workload.hours_per_week:
                        errors.append(f"Incomplete allocation for {course.name} in {section.name}")

    db.session.commit()
    return jsonify({
        "status": "success" if not errors else "partial_success",
        "entries": successful_entries,
        "errors": errors
    }), 200

@scheduling_bp.route('/view/<int:dept_id>', methods=['GET'])
def view_timetable(dept_id):
    entries = TimetableEntry.query.filter_by(department_id=dept_id).all()
    result = []
    for e in entries:
        result.append({
            "day": e.day, "timeslot": e.timeslot,
            "section": Section.query.get(e.section_id).name,
            "course": Course.query.get(e.course_id).name,
            "teacher": Teacher.query.get(e.teacher_id).name,
            "room": Room.query.get(e.room_id).name
        })
    return jsonify(result)
