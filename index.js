import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 2000;

//using middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//reading the classlist from the file directory
const classList = JSON.parse(
  fs.readFileSync(`${__dirname}/sample-data/classlist.json`)
);

//collecting and storing new student details
app.post('/addstudent', (req, res) => {
  //creating body object
  const id = classList.length + 1;
  req.body.newStudent = {
    id: id,
    name: req.body.name,
    age: req.body.age,
    favsubject: req.body.favsubject,
  };
  classList.push(req.body.newStudent);

  const newStudentList = JSON.stringify(classList);
  fs.writeFile(
    `${__dirname}/sample-data/classlist.json`,
    newStudentList,
    (err) => {
      if (err) {
        console.log('error in writing file');
      }
      console.log('new student added');
    }
  );
  res.end('done');
});

//getting all students
app.get('/students', (_, res) => {
  res.status(200).send({
    status: 200,
    result: classList.length,
    data: {
      students: classList,
    },
  });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
