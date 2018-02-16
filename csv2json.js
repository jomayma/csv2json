const fs = require('fs')
const path = require('path')
const readline = require('readline')
var path2inputCSVfile = process.argv[2]

if (path2inputCSVfile != null) {
  var fnameWithoutExt = path.basename(path2inputCSVfile, path.extname(path2inputCSVfile))
  var workingPath = path.dirname(path2inputCSVfile)
  var path_input_file = path.join(__dirname, `${path2inputCSVfile}`)
  var path_output_file = path.join(__dirname,workingPath,`${fnameWithoutExt}.json`)
} else {
  console.log("No input CSV file name was passed like 1st argument, for example: 'node csv2json.js test/customer-data.csv'")
  process.exit(1)
}

var is_header_line = true
var is_second_line = true
var keys = []
var currentObjStr = "["

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
    values = splitFieldsFromLine(line, ',')
    if (is_second_line) {
      currentObjStr += "{"
      is_second_line = false
    } else {
      currentObjStr += ",{"
    }
    currentObjStr += `"${keys[0]}": "${values[0]}"`
    for (let i = 1; i < keys.length; i++){
      currentObjStr += `,"${keys[i]}": "${values[i]}"`
    }
    currentObjStr += '}'
  }
});

rl.on("close", () => {
  currentObjStr += ']'
  try {
    //CHECKING THE JSON VALIDITY OF THE OBJECT STRING
    jsonObj = JSON.parse(currentObjStr)
    //Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
    fs.writeFile(path_output_file, JSON.stringify(jsonObj, null, 2), {encoding : "utf8", flag: "w"}, (err) => {
      if (err) return process.exit(1)
      console.log(`Input file = ${path_input_file}`)
      console.log(`Output file = ${path_output_file}`)
      console.log("CONGRATULATIONS! You got an output file in JSON from CSV input file!")
    })
  } catch (e) {
    console.error(`OOPS! It was verified some problem creating the output JSON file! ${e}`)
}})
