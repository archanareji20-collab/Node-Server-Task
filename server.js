const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// GET endpoint to read student data
app.get('/read-file', (req, res) => {
  const studentName = req.query.name;

  //  Check if name query is provided
  if (!studentName) {
    return res.status(400).json({
      error: 'Bad Request: Please provide a student name in the query parameter (e.g. ?name=John).'
    });
  }

  // Read students.json file
  const filePath = path.join(__dirname, 'students.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({
        error: 'Internal Server Error: Could not read students.json file.'
      });
    }

    try {
      const students = JSON.parse(data);

      //  Find student by name (case-insensitive)
      const student = students.find(
        (s) => s.name.toLowerCase() === studentName.toLowerCase()
      );

      // If not found, send error
      if (!student) {
        return res.status(404).json({
          error: `Student with name '${studentName}' not found.`
        });
      }

      // If found, return student details
      res.json({
        message: 'Student found successfully',
        data: student
      });
    } catch (parseError) {
      res.status(500).json({
        error: 'Internal Server Error: Failed to parse students.json.'
      });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
