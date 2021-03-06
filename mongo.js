const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]

const number = process.argv[4]

const url =
  `mongodb+srv://tanuki:${password}@cluster0.uarrg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(url)

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const person = new Person({
        name: name,
        number: number
      })
      person.save().then(result => {
          console.log('person saved!')
          mongoose.connection.close()
          })
}

if (process.argv.length === 3) {
    console.log("phonebook:")
    Person.find({}).then(result => {
            result.forEach(person => {
            console.log(person.name + " " + person.number)
            })
            mongoose.connection.close()
        })
}