import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import "./LeavedStudents.css";

export default function LeavedStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchLeavedStudents();
  }, []);

  const fetchLeavedStudents = async () => {
    try {
      const res = await axiosInstance.get("/students/leaved");
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Error fetching leaved students:", err);
    }
  };

  return (
    <div className="leaved-students-page-background">
      <div className="leaved-students-content">

        {/* HEADER */}
        <div className="leaved-students-row header">
          <div className="leaved-students-cell">Name</div>
          <div className="leaved-students-cell">Mobile</div>
          <div className="leaved-students-cell">Father Name</div>
          <div className="leaved-students-cell">Mother Name</div>
          <div className="leaved-students-cell">Email</div>
          <div className="leaved-students-cell">Address</div>
          <div className="leaved-students-cell">College</div>
          <div className="leaved-students-cell">Room Number</div>
          <div className="leaved-students-cell">Room Type</div>
          <div className="leaved-students-cell">Room Status</div>
        </div>

        {/* ROWS */}
        {students.map((s, i) => (
          <div key={i} className="leaved-students-row">
            <div className="leaved-students-cell">{s.name}</div>
            <div className="leaved-students-cell">{s.mobile}</div>
            <div className="leaved-students-cell">{s.fatherName}</div>
            <div className="leaved-students-cell">{s.motherName}</div>
            <div className="leaved-students-cell">{s.email}</div>
            <div className="leaved-students-cell">{s.address}</div>
            <div className="leaved-students-cell">{s.college}</div>
            <div className="leaved-students-cell">{s.roomNumber}</div>
            <div className="leaved-students-cell">
              {s.roomType || "—"}
            </div>
            <div className="leaved-students-cell">{s.roomStatus}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 
