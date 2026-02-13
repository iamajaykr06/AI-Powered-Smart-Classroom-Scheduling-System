from .. import db

class TimetableEntry(db.Model):
    __tablename__ = 'timetable_entries'
    
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(10), nullable=False) # Monday, Tuesday, etc.
    timeslot = db.Column(db.String(20), nullable=False) # e.g., "09:00-10:00"
    
    section_id = db.Column(db.Integer, db.ForeignKey('sections.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey('room.id'), nullable=False)
    
    # Track which department this entry belongs to for easier filtering
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'), nullable=False)

    def __repr__(self):
        return f'<TimetableEntry {self.day} {self.timeslot} S:{self.section_id} T:{self.teacher_id} R:{self.room_id}>'
