const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Cors = require("cors");
const isImageUrl = require("is-image-url");
const _ = require("lodash");

const app = express();

// The port at which the server listens (8081 by default)
const PORT = process.env.PORT || 8081;

// Conncting to the mongoDB
const url = "mongodb://localhost:27017/memeDB";
// const url =
// "mongodb+srv://tushar:accessmemes@cluster0.jpy1q.mongodb.net/memeDB?retryWrites=true&w=majority";
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

// Defining the meme schema
const memeSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Title cannot be empty"] },
  url: { type: String, required: [true, "URL cannot be empty"] },
  caption: { type: String, required: [true, "Content cannot be empty"] },
});

// Defining the collection in the database
const Meme = mongoose.model("Meme", memeSchema);

// Required in order to read the form input and parse the json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Required to allow the frontend to communicate with the backend
app.use(Cors());

// _id field is stored by default but we need to return id as per specifed requirements
function convertPost(post) {
  let newPost = {
    id: post._id,
    name: post.name,
    url: post.url,
    caption: post.caption,
  };
  return newPost;
}

// Home route
app.get("/", (req, res) => {
  res.send("Xmeme Backend!!");
});

// Defining API endpoints for the /memes route
app
  .route("/memes")
  // Defining post to add new memes to the collection
  .post((req, res) => {
    const imgUrl = req.body.url;

    // Checking whether the URL entered is a valid URL or not
    if (isImageUrl(imgUrl)) {
      let name = req.body.name;
      // Converting the name entered to title case to maintain consistency
      // This also makes duplicacy check more accurate
      name = _.startCase(_.toLower(name));
      let obj = {
        name: name,
        url: imgUrl,
        caption: req.body.caption,
      };
      let meme = new Meme(obj);

      // Checking if an object with the same name,caption and url already exists.
      Meme.findOne(obj, (err, foundMeme) => {
        // Error handling
        if (err) {
          res.send(err);
        } else {
          // Meme already exists => returned 409 status code
          if (foundMeme) {
            res.sendStatus(409);
          } else {
            // Meme does not exist => save it in the database
            meme.save((err) => {
              // Error handling
              if (err) res.send(err);
              else {
                // Return the id of the created meme as specified in the requirements
                res.status(201).send({ id: meme._id });
              }
            });
          }
        }
      });
    }

    // URL is an invalid img url
    else {
      // Response in case of an invalid img URL
      res.status(404).send("Img url is invalid!");
    }
  })

  // Defining get request to get the latest 100 memes in reverse chronological order
  .get((req, res) => {
    Meme.find(function (err, posts) {
      // Error handling
      if (err) res.send(err);
      else {
        let arr = [];
        posts.forEach((post) => {
          // function called to render _id field as id
          let reqdPost = convertPost(post);
          arr.push(reqdPost);
        });

        res.status(200).send(arr);
      }
    })
      .sort({ _id: -1 }) // Sorting in reverse chronological order
      .limit(100); // Defining the limit to fetch 100 recent memes
  });

// Defining API endpoints for the /memes/:id route
app
  .route("/memes/:id")
  // Defining get request to get the meme with specified id
  .get((req, res) => {
    // getting the id from the route
    const id = req.params.id;

    // Finding meme by id in the collection
    Meme.findById(id, (err, meme) => {
      // Error handling
      if (err) res.send(err);

      // If meme exists
      if (meme) {
        // Convert to required format
        let reqdMeme = convertPost(meme);

        // Respond with status code 200
        res.status(200).send(reqdMeme);
      }
      // If meme does not exist respond with status code 404
      else {
        res.sendStatus(404);
      }
    });
  })

  // Defining patch request to update the meme with the specified id
  .patch((req, res) => {
    const id = req.params.id;

    // Updating the meme if it exists in the collection
    Meme.findByIdAndUpdate(id, { $set: req.body }, (err, updatedMeme) => {
      // Error handling
      if (err) res.send(err);
      else {
        if (updatedMeme) {
          // Meme updated successfully
          res.sendStatus(200);
        } else {
          // Meme with the specified id does not exist => return 404 status code
          res.sendStatus(404);
        }
      }
    });
  });

// Spinning up the server at the specified port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
