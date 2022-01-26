import React from 'react'

const Persons = ({ filtered, handleClick }) => {
    return(
      filtered.map(person =>
        <div key={`${person.id}`}> 
          {person.name} {person.number}
          <button onClick={() => handleClick(person.id)}>
            delete
          </button>
        </div>
      )
    )
  }

export default Persons