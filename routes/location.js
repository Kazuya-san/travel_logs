const router = require("express").Router();
const Location = require("../models/locationSchema");
const { cwd } = require("process");
const fs = require("fs");
const uuid = require("uuid").v4;

const allowedExtensions = ["jpg", "jpeg", "png"];

router.get("/", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.json({ message: err });
  }
});

router.post("/", async (req, res) => {
  const { name, description, rating, lat, lng, image, firebaseImg } = req.body;

  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    //return res.status(400).send("No files were uploaded.");

    const location = new Location({
      name,
      description,
      rating,
      image: firebaseImg,
      lat,
      lng,
    });

    try {
      const savedLocation = await location.save();
      return res.json(savedLocation);
    } catch (err) {
      return res.json({ message: err });
    }
  }

  sampleFile = req.files.image;
  let extention = sampleFile.name.split(".").pop();

  if (!allowedExtensions.includes(extention)) {
    return res.status(400).json({ uploadError: "File type not allowed" });
  }

  let imgPath = uuid() + "." + extention;
  uploadPath = cwd() + "/uploads/" + imgPath;
  // Using the mv() method to place the file somewhere on the server
  sampleFile.mv(uploadPath, async function (err) {
    if (err) return res.status(500).send(err);
    else {
      const location = new Location({
        name,
        description,
        rating,
        image: imgPath,
        lat,
        lng,
      });

      try {
        const savedLocation = await location.save();
        res.json(savedLocation);
      } catch (err) {
        res.json({ message: err });
      }
    }
  });
});

router.put("/:locationId", async (req, res) => {
  const { name, description, rating, image } = req.body;
  const { locationId } = req.params;

  try {
    const updatedLocation = await Location.findByIdAndUpdate(
      locationId,
      {
        name,
        description,
        rating,
        image,
      },
      { new: true }
    );

    res.json(updatedLocation);
  } catch (err) {
    res.json({ message: err });
  }
});

router.delete("/:locationId", async (req, res) => {
  const { locationId } = req.params;

  try {
    const deletedLocation = await Location.findByIdAndDelete(locationId);
    await fs.unlinkSync(cwd() + "/uploads/" + deletedLocation.image);
    res.json(deletedLocation);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
