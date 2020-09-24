const request = require('request');
const fs = require('fs');

const copyFrom = process.argv[2];
const copyTo = process.argv[3];

const writeToFile = function(contents, path, size) {
  fs.writeFile(copyTo, contents, (writeErr) => {
    if (writeErr) {
      console.log('Something went wrong and we could not write the file.', writeErr);
      
    } else {
      //success messages
      if(size === undefined){
        //get the written file's size
        let fileStat = fs.statSync(path);
        console.log(`Successfully written ${fileStat.size} bytes of data into ${path}`)
      } else {
        console.log(`Successfully written ${size} bytes of data into ${path}`);
      }
    }
    process.exit();
  });
};

const saveData = function(contents, size) {
  fs.access(copyTo, fs.constants.W_OK, (err) => {
    if (err) {
      writeToFile(contents, copyTo, size);
    } else {
      process.stdout.write("This file already exists. Would you like to overwite it? (y): ");
      process.stdin.on('data', (key) => {
        if(key.toString() === 'y\n'){
          writeToFile(contents, copyTo, size);
        } else {
          process.exit();
        }
      })
    }
  });
};




request(copyFrom, (error, response, body) => {
  if(error){
    console.log(error);
    process.exit();
  } else {
    // console.log(response.headers , );
    // //console.log(body);

    saveData(body, response.headers['content-length']);

  }
})