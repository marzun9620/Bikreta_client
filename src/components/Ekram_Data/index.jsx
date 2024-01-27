// src/Form.js
import axios from "axios";
import React, { useState,useEffect  } from "react";
import BASE_URL from "../services/helper";
import "./index.css"; // Import the CSS file for styling

const zones = ["Mymensingh", "Chattogram"];
const sAndDOptions = {
  Mymensingh: ["Bhairab", "Bajitpur", "Kishoreganj"],
  Chattogram: ["Patia", "Fouzderhat"],
};
const substationOptions = {
  Bhairab: ["Bhairab", "Kuliarchar"],
  Bajitpur: ["Sararchar"],
  Kishoreganj: ["Josodal", "Mollapara"],
  Patia: ["Mollapara", "Fishharbor"],
  Fouzderhat: ["Sikalbhaha", "Fouzdarhat"],
};
const surveyorOptions = {
  Bhairab: [
    "Md Obeydur Rahman",
    "Sanowar Hossain",
    "Abdur Rahman",
    "Md Sourov Hossain",
    "Sadikur Rahman",
    "Juael Hasan",
  ],
  // Add other surveyors based on substation
};
const substationSurveyors = {
  Bhairab: [
    "Md Obeydur Rahman",
    "Sanowar Hossain",
    "Abdur Rahman",
    "Md Sourov Hossain",
    "Sadikur Rahman",
    "Juael Hasan",
  ],
  Kuliarchar: ["Surveyor 1", "Surveyor 2"], // Add other surveyors based on substation
  // Add other surveyors based on substation
};

const Form = () => {
  const [formData, setFormData] = useState({
    zone: "",
    sdName: "",
    substation: "",
    date: "",
    status: "",
    surveyorsName: "",
    startingTime: "",
    endingTime: "",
    numOfIndividualData: "",
    dailyCompletion: "",
 
    // Add other form fields here
  });
  const [formSubmissions, setFormSubmissions] = useState([]);

  // Function to fetch form submissions from the server
  const fetchFormSubmissions = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/get-form-submissions`);
      setFormSubmissions(response.data);
    } catch (error) {
      console.error("Error fetching form submissions:", error);
    }
  };

  useEffect(() => {
    // Fetch form submissions when the component mounts
    fetchFormSubmissions();
  }, []);


  const handleChange = (e, field) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`${BASE_URL}/submit-form`, formData);
      alert("Form submitted successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };
  const downloadCSV = () => {
    const csvData = [
      ["Zone", "S & D Name", "Substation Name", "Date", "Status", "Surveyors Name", "Starting Time", "Ending Time", "Number of Individual Data", "% of Daily Completion"],
      ...formSubmissions.map((submission) => [
        submission.zone,
        submission.sdName,
        submission.substation,
        submission.date,
        submission.status,
        submission.surveyorsName,
        submission.startingTime,
        submission.endingTime,
        submission.numOfIndividualData,
        submission.dailyCompletion,
      ]),
    ];

    // Convert 2D array to CSV string
    const csvString = csvData.map(row => row.join(',')).join('\n');

    // Create a Blob object and trigger download
    const blob = new Blob([csvString], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'form_submissions.csv';
    link.click();
  };

  return (
    <div className="form-container">
      <form className="custom-form">
        <div className="form-group">
          <label htmlFor="zone">Zone:</label>
          <select id="zone" onChange={(e) => handleChange(e, "zone")} required>
            <option value="">Select Zone</option>
            {zones.map((zone, index) => (
              <option key={index} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sdName">S & D Name:</label>
          <select
            id="sdName"
            onChange={(e) => handleChange(e, "sdName")}
            required
          >
            <option value="">Select S & D Name</option>
            {sAndDOptions[formData.zone]?.map((sd, index) => (
              <option key={index} value={sd}>
                {sd}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="substation">Substation Name:</label>
          <select
            id="substation"
            onChange={(e) => handleChange(e, "substation")}
            required
          >
            <option value="">Select Substation</option>
            {substationOptions[formData.sdName]?.map((sub, index) => (
              <option key={index} value={sub}>
                {sub}
              </option>
            ))}
          </select>
        </div>

   

        <div className="form-group">
  <label htmlFor="date">Date:</label>
  <input
    type="date"
    id="date"
    onChange={(e) => handleChange(e, "date")}
    required
  />
</div>


        <div className="form-group">
          <label htmlFor="status">Status:</label>
          <input
            type="text"
            id="status"
            onChange={(e) => handleChange(e, "status")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="surveyorsName">Surveyors Name:</label>
          <input
            type="text"
            id="surveyorsName"
            onChange={(e) => handleChange(e, "surveyorsName")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startingTime">Starting Time:</label>
          <input
            type="time"
            id="startingTime"
            onChange={(e) => handleChange(e, "startingTime")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endingTime">Ending Time:</label>
          <input
            type="time"
            id="endingTime"
            onChange={(e) => handleChange(e, "endingTime")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="numOfIndividualData">
            Number of Individual Data:
          </label>
          <input
            type="number"
            id="numOfIndividualData"
            onChange={(e) => handleChange(e, "numOfIndividualData")}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="dailyCompletion">% of Daily Completion:</label>
          <input
            type="number"
            id="dailyCompletion"
            onChange={(e) => handleChange(e, "dailyCompletion")}
            required
          />
        </div>

        <button type="button" onClick={handleSubmit} className="submit-btn">
          Submit
        </button>
      </form>
      <button type="button" onClick={downloadCSV} className="download-btn">
        Download CSV
      </button>
      <div className="table-container">
        <h2>Form Submissions</h2>
        <table>
          <thead>
            <tr>
              <th>Zone</th>
              <th>S & D Name</th>
              <th>Substation Name</th>
              <th>Date</th>
              <th>Status</th>
              <th>Surveyors Name</th>
              <th>Starting Time</th>
              <th>Ending Time</th>
              <th>Number of Individual Data</th>
              <th>% of Daily Completion</th>
            </tr>
          </thead>
          <tbody>
            {formSubmissions.map((submission, index) => (
              <tr key={index}>
                <td>{submission.zone}</td>
                <td>{submission.sdName}</td>
                <td>{submission.substation}</td>
                <td>{submission.date}</td>
                <td>{submission.status}</td>
                <td>{submission.surveyorsName}</td>
                <td>{submission.startingTime}</td>
                <td>{submission.endingTime}</td>
                <td>{submission.numOfIndividualData}</td>
                <td>{submission.dailyCompletion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Form;














