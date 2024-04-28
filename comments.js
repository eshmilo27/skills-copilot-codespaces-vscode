// Create web server
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Use middleware to parse requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Read data from file
app.get('/comments', (req, res) => {
  fs.readFile('./data/comments.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Internal Server Error');
    } else {
      res.status(200).send(data);
    }
  });
});

// Write data to file
app.post('/comments', (req, res) => {
  const { name, comment } = req.body;
  if (name && comment) {
    fs.readFile('./data/comments.json', 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Internal Server Error');
      } else {
        const comments = JSON.parse(data);
        comments.push({ name, comment });
        fs.writeFile('./data/comments.json', JSON.stringify(comments), (err) => {
          if (err) {
            res.status(500).send('Internal Server Error');
          } else {
            res.status(201).send('Comment added');
          }
        });
      }
    });
  } else {
    res.status(400).send('Bad Request');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Path: public/index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comments</title>
</head>
<body>
  <h1>Comments</h1>
  <form id="comment-form">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
    <label for="comment">Comment:</label>
    <textarea id="comment" name="comment" required></textarea>
    <button type="submit">Submit</button>
  </form>

