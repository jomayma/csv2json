const fs = require('fs')
const path = require('path')
const readline = require('readline')

var path_input_file = path.join(__dirname, '/test/customer-data.csv')
var path_output_file = path.join(__dirname, '/test/customer-data.json')
var is_header_line = true
var is_second_line = true
var keys = []

//Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
fs.appendFileSync(path_output_file, '[\n', {flag: "w"})

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
  if (is_header_line) {
    keys = splitFieldsFromLine(line, ',')
    is_header_line = false
  } else {
    var values = []
    var currentObjStr = ""
    values = splitFieldsFromLine(line, ',')
    if (is_second_line) {
      currentObjStr += "  {\n"
      is_second_line = false
    } else {
      currentObjStr += "  ,{\n"
    }
    currentObjStr += `    "${keys[0]}": "${values[0]}"\n`
    for (let i = 1; i < keys.length; i++){
      currentObjStr += `    ,"${keys[i]}": "${values[i]}"\n`
    }
    currentObjStr += '  }\n'
    fs.appendFileSync(path_output_file, currentObjStr)
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
        console.error(`OOPS! the output file is not JSON! ${e}`)
      }
    }
  })
})