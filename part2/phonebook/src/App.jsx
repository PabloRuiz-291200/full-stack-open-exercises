import { useEffect, useState } from 'react'
import personService from './services/persons'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  return (
    <div className={notification.type}>
      {notification.message}
    </div>
  )
}

const Filter = ({ value, onChange }) => {
  return (
    <div>
      filter shown with:{' '}
      <input value={value} onChange={onChange} />
    </div>
  )
}

const PersonForm = ({
  onSubmit,
  newName,
  newNumber,
  onNameChange,
  onNumberChange
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={onNameChange}
        />
      </div>

      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={onNumberChange}
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({ person, onDelete }) => {
  return (
    <p>
      {person.name} {person.number}{' '}
      <button onClick={() => onDelete(person.id, person.name)}>
        delete
      </button>
    </p>
  )
}

const Persons = ({ persons, onDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <Person
          key={person.id}
          person={person}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then((initialPersons) => {
        setPersons(initialPersons)
      })
      .catch(() => {
        showNotification(
          'The phonebook data could not be loaded',
          'error'
        )
      })
  }, [])

  const showNotification = (message, type) => {
    setNotification({
      message,
      type
    })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      (person) =>
        person.name.toLowerCase() === newName.toLowerCase()
    )

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${existingPerson.name} is already added to phonebook, replace the old number with a new one?`
      )

      if (!confirmUpdate) {
        return
      }

      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons((currentPersons) =>
            currentPersons.map((person) =>
              person.id === existingPerson.id
                ? returnedPerson
                : person
            )
          )

          showNotification(
            `Updated ${returnedPerson.name}`,
            'success'
          )

          setNewName('')
          setNewNumber('')
        })
        .catch(() => {
          showNotification(
            `Information of ${existingPerson.name} has already been removed from the server`,
            'error'
          )

          setPersons((currentPersons) =>
            currentPersons.filter(
              (person) => person.id !== existingPerson.id
            )
          )
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons((currentPersons) =>
          currentPersons.concat(returnedPerson)
        )

        showNotification(
          `Added ${returnedPerson.name}`,
          'success'
        )

        setNewName('')
        setNewNumber('')
      })
      .catch(() => {
        showNotification(
          `${newName} could not be added`,
          'error'
        )
      })
  }

  const deletePerson = (id, name) => {
    const confirmDelete = window.confirm(
      `Delete ${name}?`
    )

    if (!confirmDelete) {
      return
    }

    personService
      .remove(id)
      .then(() => {
        setPersons((currentPersons) =>
          currentPersons.filter((person) => person.id !== id)
        )

        showNotification(
          `Deleted ${name}`,
          'success'
        )
      })
      .catch(() => {
        showNotification(
          `${name} has already been removed from the server`,
          'error'
        )

        setPersons((currentPersons) =>
          currentPersons.filter((person) => person.id !== id)
        )
      })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter((person) =>
    person.name
      .toLowerCase()
      .includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notification={notification} />

      <Filter
        value={filter}
        onChange={handleFilterChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        newNumber={newNumber}
        onNameChange={handleNameChange}
        onNumberChange={handleNumberChange}
      />

      <h3>Numbers</h3>

      <Persons
        persons={personsToShow}
        onDelete={deletePerson}
      />
    </div>
  )
}

export default App