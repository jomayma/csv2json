const fs = require('fs')
const path = require('path')
const readline = require('readline')
const uuidv1 = require('uuid/v1')
const folderName = uuidv1()
const path_input_file = path.join(__dirname, '/test/customer-data.csv')

var is_first_line = true
var is_second_line = true
var keys = []
var input_fs = path.join(__dirname, folderName, 'input.csv')
var output_fs = path.join(__dirname, folderName, 'output.json')

fs.mkdirSync(folderName)
fs.writeFileSync(input_fs, path_input_file)
fs.appendFileSync(output_fs, '[')

const splitFieldsFromLine = (line, separator) => {
  let arrF = []
  let i = 0
  line.toString().split(separator).forEach((word) => {
    arrF[i] = word
    i++
  })

  return arrF
}

const rl = readline.createInterface({
  input: fs.createReadStream(path_input_file),
  crlfDelay: Infinity
})

rl.on('line', (line) => {
  if (is_first_line) {
    keys = splitFieldsFromLine(line, ',')
    is_first_line = false
  } else {
    values = splitFieldsFromLine(line, ',')
    if (is_second_line) {
      fs.appendFileSync(output_fs, '{')
      is_second_line = false
    } else {
      fs.appendFileSync(output_fs, ', {')
    }
    fs.appendFileSync(output_fs, `"${keys[0]}": "${values[0]}"`)
    for (let i = 1; i < keys.length; i++){
      fs.appendFileSync(output_fs, `,"${keys[i]}": "${values[i]}"`)
    }
    fs.appendFileSync(output_fs, '}\n')
    values = []
  }
});

rl.on("close", () => {
  fs.appendFileSync(output_fs, ']')
})