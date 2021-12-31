require("dotenv").config();
const express = require("express");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
//const db = require('./database/db')
const path = require("path");
const upload = require("./utils/imageUploader");

const postRouter = require("./routes/postRouter");
const authorRouter = require("./routes/authorRouter");
const messageRouter = require("./routes/messageRouter");

const port = process.env.PORT || 3004;
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use("/posts", postRouter);
app.use("/authors", authorRouter);
app.use("/contact_messages", messageRouter);

//app.use(express.static(path.join(__dirname, "/images")));
//app.use(express.urlencoded({ extended: false}))

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post(
  "/upload-blog_images",
  upload.single("blog_images"),
  (req, res, next) => {
    //console.log(req.file);
    //res.send('single file upload successfull')
    if (!req.file) {
      next(err); // Pass errors to Express.
    } else {
      console.log(req.file);
      // path.toNamespacedPath(path)
      const template = `<img src="/images/postImages/${req.file.originalname}" alt="${req.file.originalname}" width="500" />`;
      res.send(template);
    }
  }
);

app.get("/", (req, res, next) => {
  res.send("<h1>Welcome to B2K blog...</h1>");
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res
    .status(500)
    .send(
      "Seems you got your self in some deep shit!!! BLAME Kingsley!! He did it while messing around."
    );
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
// app.get('/blogPosts', (req, res) => {
//     fs.readFile('data.json', 'utf8', (err, data) => {
//         if(err) {
//             console.log(err)
//         } else {
//             const parsedData = JSON.parse(data)
//             res.send(parsedData);
//         }
//     })

// })
