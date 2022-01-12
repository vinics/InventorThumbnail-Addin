const path = require('path');
const fs = require('fs');

const express = require('express');
const multer = require('multer');
const api = require('./services/api');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname);
  }
});
const upload = multer({ storage: storage });

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.set(express.json());

app.use(express.static(path.resolve(__dirname, '..', 'images')))

app.get('/', (req, res) => {
  const imagesFolderPath = path.resolve(__dirname, '..', 'images');

  const imagesFolder = fs.readdirSync(imagesFolderPath);

  const results = [];

  imagesFolder.forEach(img => {
    const title = img;
    const url = `/${title}`;
    // const data = fs.readFileSync(path.resolve(imagesFolderPath, img), 'base64');

    results.push({title, url});
  });

  console.log(results);

  res.render('pages/index', {data : results})
});

app.post('/upload', upload.single('avatar'), (req, res) => {
  const file = req.file;

  const filePath = path.resolve(__dirname, '..', file.path);

  api.getImagefromModel(filePath, file.originalname)
    .then((data) => {
      console.log('Success');

      const filePath = path.resolve(__dirname, '..', 'images', `${file.originalname}.bmp`);

      fs.writeFileSync(filePath, data, 'binary');
    })
    .catch(error => console.log(error))

  return res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Server up on port ${PORT}`);
});
