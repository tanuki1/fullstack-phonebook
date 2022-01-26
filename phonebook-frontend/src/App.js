import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './service/personService'
import Notification from './components/Notification'
import Error from './components/Error'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [filteredPersons, setFilteredPersons] = useState([persons])
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const updateFilteredPersons = () => {
    const filtered = persons.filter(p => p.name
      .toLowerCase()
      .includes(newFilter.toLowerCase()))

    setFilteredPersons(filtered)
  }

  useEffect(() => updateFilteredPersons(), [newFilter])
  useEffect(() => updateFilteredPersons(), [persons])

  useEffect(() => {
    personService
        .getAll()
        .then(returnedPersons => {
            setPersons(returnedPersons)
        })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber,
    }

    const names = persons.map(person => person.name.toLowerCase())
    const included = names.includes(newName.toLowerCase())

    if (included) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find((p => p.name.toLowerCase() === newName.toLowerCase()))
        const changedPerson = { ...person, number: newNumber }

        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setNotification(`Deleted ${nameObject.name}`)
              setTimeout(() => {
                setNotification(null)
              }, 5000)   
            })
      .catch(error => {
        setErrorMessage(`Information of ${nameObject.name} has already been removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }    
    } else {
      personService
        .create(nameObject)
        .then(returnedPersons => {
          setPersons(persons.concat(returnedPersons))
          setNewName('')
        })
      setNotification(`Added ${nameObject.name}`)
        setTimeout(() => {
          setNotification(null)
        }, 5000)
    }
    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) =>
    setNewName(event.target.value)
  
  const handleNumberChange = (event) =>
    setNewNumber(event.target.value)
  
  const handleFilterChange = (event) => 
    setNewFilter(event.target.value)

  const handleClick = (id) => {
    if (window.confirm(`delete ${persons.find(p => p.id === id).name} ?`)) {
      removePerson(id)
    }
  }

  const removePerson = (id) => {
    const person = (persons.find(p => p.id === id))
    if (persons.find(p => p.id === id)) {
      personService
      .remove(id)
      .then(() => {
        personService
          .getAll()
          .then(returnedPersons => {
            setPersons(returnedPersons)
            setNotification(`Deleted ${person.name}`)
            setTimeout(() => {
              setNotification(null)
            }, 5000)   
          })
      })
      .catch(error => {
        setErrorMessage(`Information of ${person.name} has already been removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })    
    }
  }

  return (
    <div>
      <h2>
        Phonebook
      </h2>
      <Notification message={notification} />
      <Error message={errorMessage} />
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>
        Add a new
      </h2>
      <PersonForm 
        addName={addName} 
        newName={newName} 
        handleNameChange={handleNameChange} 
        newNumber={newNumber} 
        handleNumberChange={handleNumberChange} 
      />
      <h2>
        Numbers
      </h2>
      <Persons filtered={filteredPersons} handleClick={handleClick} />
      </div>
  )
}
export default App