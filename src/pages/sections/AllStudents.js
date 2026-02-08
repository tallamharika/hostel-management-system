import React, { useEffect, useState } from "react";
import "../Dashboard.css";
import "./AllStudents.css";
import axiosInstance from "../../utils/axiosInstance";

export default function AllStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const res = await axiosInstance.get("/students");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="all-students-page-background">
      <div className="all-students-content">
        <div className="all-students-row header">
          <div className="all-students-cell">Name</div>
          <div className="all-students-cell">Mobile</div>
          <div className="all-students-cell">Father Name</div>
          <div className="all-students-cell">Mother Name</div>
          <div className="all-students-cell">Email</div>
          <div className="all-students-cell">Address</div>
          <div className="all-students-cell">College</div>
          <div className="all-students-cell">Room Number</div>
          <div className="all-students-cell">Room Type</div>
          <div className="all-students-cell">Room Status</div>
        </div>

        {students.map((student, index) => (
          <div className="all-students-row" key={index}>
            <div className="all-students-cell">{student.name}</div>
            <div className="all-students-cell">{student.mobile}</div>
            <div className="all-students-cell">{student.fatherName}</div>
            <div className="all-students-cell">{student.motherName}</div>
            <div className="all-students-cell">{student.email}</div>
            <div className="all-students-cell">{student.address}</div>
            <div className="all-students-cell">{student.college}</div>
            <div className="all-students-cell">{student.roomNumber}</div>
            <div className="all-students-cell">
              {student.roomType || "—"}
            </div>
            <div className="all-students-cell">{student.roomStatus}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 
