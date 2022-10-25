const express = require("express");
const dotenv = require("dotenv");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const locationRoutes = require("./routes/location");

const connectDB = require("./config/connectDB");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

//serve static files
app.use(express.static("uploads"));

app.use(express.static(path.join(__dirname, "travel-logs", "build")));

app.use("/api/location", locationRoutes);

// app.post("/upload", function (req, res) {
//   let sampleFile;
//   let uploadPath;

//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).send("No files were uploaded.");
//   }

//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   sampleFile = req.files.image;
//   uploadPath = __dirname + "/uploads/" + sampleFile.name;

//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv(uploadPath, function (err) {
//     if (err) return res.status(500).send(err);

//     res.json({
//       message: "File uploaded!",
//       path: "/uploads/" + sampleFile.name,
//     });
//   });
// });

const PORT = 5000;

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "travel-logs", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
