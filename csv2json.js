const fs = require('fs')
const path = require('path')
const readline = require('readline')
const uuidv1 = require('uuid/v1')

const input_file = path.join(__dirname, '/test/customer-data.csv')
const rl = readline.createInterface({
  input: fs.createReadStream(input_file),
  crlfDelay: Infinity
});

const splitFieldsFromLine = (line, separator, callback) => {
  let arrF = []
  let i = 0
  line.toString().split(separator).forEach((word) => {
    arrF[i] = word
    i++
  })
  //TO-DO handle errors during split
  callback(null,arrF)

  return arrF
}

let is_first_line = true
var keys = []

const folderName = uuidv1()
fs.mkdirSync(folderName)
input_fs = path.join(__dirname, folderName, 'input.csv')
output_fs = path.join(__dirname, folderName, 'output.json')
fs.writeFileSync(input_fs, input_file)

fs.appendFile(output_fs, '[', (err) => {
  if (err) throw err;
});

rl.on('line', (line) => {
  if (is_first_line) {
    console.log(`First line from file: ${line}`);
    keys = splitFieldsFromLine(line, ',', (err,keys) => {
      if (err) console.error(`error fetching Keys from Header: ${err}`);
      else console.log(`keys from first line: ${keys}`);
      console.log("keys.length?",keys.length)
    })
    console.log("keys.length?",keys.length)
    is_first_line = false
  } else {
    //console.log(`Next line from file: ${line}`);
    values = splitFieldsFromLine(line, ',', (err,values) => {
      if (err) console.error(`error fetching Values from Line: ${err}`);
      //else console.log(`values from line: ${values}`);
    })
    fs.appendFile(output_fs, '{', (err) => {
      if (err) throw err;
    });
    //console.log("keys.length?",keys.length)
    for (var i = 0; i < keys.length; i++){
      //console.log(values[i])
      fs.appendFile(output_fs, `"${keys[i]}": "${values[i]}",`, (err) => {
        if (err) throw err;
      });
    }
    fs.appendFile(output_fs, '}\n', (err) => {
      if (err) throw err;
    });
    values = []
  }
});
