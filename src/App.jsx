import React, { useState } from "react";
import { GoDash } from "react-icons/go";
import Swal from "sweetalert2";

import "./App.css";

const schemaOptions = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" },
];

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [currentSchema, setCurrentSchema] = useState("");

  const handleAddSchema = () => {
    if (currentSchema && !selectedSchemas.includes(currentSchema)) {
      setSelectedSchemas([...selectedSchemas, currentSchema]);
      setCurrentSchema("");
    }
  };

  const handleRemoveSchema = (value) => {
    setSelectedSchemas(selectedSchemas.filter((schema) => schema !== value));
  };


const handleSaveSegment = async () => {
  const payload = {
    segmentName,
    selectedSchemas,
  };

  try {
    const response = await fetch("http://localhost:5000/send-segment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      Swal.fire({
        icon: "success",
        title: "Segment Sent!",
        text: "Your segment data was successfully sent to the server.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to send data.",
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Something went wrong while sending data.",
    });
    console.error("Error sending data:", error);
  }
};

 
  return (
    <div className="App">
      <button className="save-btn" onClick={() => setShowPopup(true)}>
        Save Segment
      </button>

     {showPopup && (
  <div className="popup-overlay">
    <div className="popup">
      <h2>Saving Segment</h2>
      <label>Enter the Name of the Segment</label>
      <input
        type="text"
        placeholder="Name of the segment"
        value={segmentName}
        onChange={(e) => setSegmentName(e.target.value)}
      />

      <p>To save your segment, you need to add the schemas to build the query</p>

      <div className="legend">
        <span className="legend-item user"></span> User Traits
        <span className="legend-item group"></span> Group Traits
      </div>

      <div className="schema-box">
        {selectedSchemas.map((schema, index) => {
          const option = schemaOptions.find((opt) => opt.value === schema);
          const isGroupTrait = schema === "account_name"; 
          const circleColor = isGroupTrait ? "group" : "user";

          return (
            <div key={index} className="schema-item">
              <span className={`circle ${circleColor}`}></span>
              <select
                value={schema}
                onChange={(e) => {
                  const updated = [...selectedSchemas];
                  updated[index] = e.target.value;
                  setSelectedSchemas(updated);
                }}
              >
                {schemaOptions
                  .filter(
                    (opt) =>
                      !selectedSchemas.includes(opt.value) ||
                      opt.value === schema
                  )
                  .map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
              </select>
              <button
                className="remove-btn"
                onClick={() => handleRemoveSchema(schema)}
              >
                <GoDash />
              </button>
            </div>
          );
        })}
      </div>

      <div className="add-schema-row">
        <span className="circle neutral"></span>
        <select
          value={currentSchema}
          onChange={(e) => setCurrentSchema(e.target.value)}
        >
          <option value="">Add schema to segment</option>
          {schemaOptions
            .filter((opt) => !selectedSchemas.includes(opt.value))
            .map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
        </select>
        <button className="add-link" onClick={handleAddSchema}>
          + Add new schema
        </button>
      </div>

      <div className="actions">
        <button className="save" onClick={handleSaveSegment}>
          Save the Segment
        </button>
        <button className="cancel" onClick={() => setShowPopup(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default App;
