const fs = require('fs')
const path = require('path')
const readline = require('readline')

var path_input_file = path.join(__dirname, '/test/customer-data.csv')
var path_output_file = path.join(__dirname, '/test/customer-data.json')
var is_first_line = true
var is_second_line = true
var keys = []

//Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
fs.appendFileSync(path_output_file, '[', {flag: "w"})

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
      fs.appendFileSync(path_output_file, '{')
      is_second_line = false
    } else {
      fs.appendFileSync(path_output_file, ', {')
    }
    fs.appendFileSync(path_output_file, `"${keys[0]}": "${values[0]}"`)
    for (let i = 1; i < keys.length; i++){
      fs.appendFileSync(path_output_file, `,"${keys[i]}": "${values[i]}"`)
    }
    fs.appendFileSync(path_output_file, '}\n')
    values = []
  }
});

rl.on("close", () => {
  fs.appendFileSync(path_output_file, ']')
  //CHECKING THE JSON VALIDITY OF THE OUTPUT FILE
  fs.readFile(path_output_file, {encoding: 'utf-8'}, function (error, data) {
    if (error) return console.error(error)
    else {
      try {    
        jsonObj = JSON.parse(data)
        console.log(`CONGRATULATIONS! the output file is JSON object :: ${JSON.stringify(jsonObj)}`)
      } catch (e) {
        console.error(`OPS! the output file is not JSON! ${e}`)
      }
    }
  })
})