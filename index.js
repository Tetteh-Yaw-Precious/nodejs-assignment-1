import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = 2000;

/**
 * Using middleware so I'd be able to take json a object body
 */
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
eading the classlist from the file directory and parsing
it down to javascript array*/

const classList = JSON.parse(
  fs.readFileSync(`${__dirname}/sample-data/classlist.json`)
);

//creating add student request
app.post('/addstudent', (req, res) => {
  //calculating the id of the new student
  const id = classList.length + 1;
  //setting up the new student body object
  req.body.newStudent = {
    id: id,
    name: req.body.name,
    age: req.body.age,
    favsubject: req.body.favsubject,
  };

  //pushing the new student details collected into the classlist array
  classList.push(req.body.newStudent);

  /*
  converting the mutated array into an json format so we can write it into the classlist file
   */
  const newStudentList = JSON.stringify(classList);

  /**after converting the new array into json format, It's time
   to write it back to the filesystem
   * */

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
