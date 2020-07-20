import React, {useState, useCallback, memo} from 'react'
import ReactDOM from 'react-dom'
import uuidv4 from 'uuid/v4'

import {
  getInitialState,
  addGift,
  toggleReservation,
  getBookDetails,
  addBook,
} from './gifts'

import './misc/index.css'

const Gift = memo(function Gift({gift, users, currentUser, onReserve}) {
  return (
    <div className={`gift ${gift.reservedBy ? 'reserved' : ''}`}>
      <img src={gift.image} alt="gift" />
      <div className="description">
        <h2>{gift.description}</h2>
      </div>
      <div className="reservation">
        {!gift.reservedBy || gift.reservedBy === currentUser.id ? (
          <button onClick={() => onReserve(gift.id)}>
            {gift.reservedBy ? 'Unreserve' : 'Reserve'}
          </button>
        ) : (
          <span>{users[gift.reservedBy].name}</span>
        )}
      </div>
    </div>
  )
})

function GiftList() {
  const [state, setState] = useState(() => getInitialState())
  const {users, gifts, currentUser} = state

  const handleAdd = () => {
    const description = prompt('Gift to add')
    if (description) {
      setState(state =>
        addGift(
          state,
          uuidv4(),
          description,
          'https://picsum.photos/200?q=' + Math.random(),
        ),
      )
    }
  }

  const handleReserve = useCallback(id => {
    setState(state => toggleReservation(state, id))
  }, [])

  const handleReset = () => {
    setState(() => getInitialState())
  }

  const handleBook = async () => {
    const isbn = prompt('Enter ISBN number', '0201558025')
    if (isbn) {
      const details = await getBookDetails(isbn)
      setState(state => addBook(state, details))
    }
  }

  return (
    <div className="app">
      <div className="header">
        <h1>H1, {currentUser.name}</h1>
      </div>
      <div className="actions">
        <button onClick={handleAdd}>Add</button>
        <button onClick={handleReset}>Reset</button>
        <button onClick={handleBook}>Add a book</button>
      </div>
      <div className="gifts">
        {gifts.map(gift => (
          <Gift
            key={gift.id}
            gift={gift}
            users={users}
            currentUser={currentUser}
            onReserve={handleReserve}
          />
        ))}
      </div>
    </div>
  )
}

ReactDOM.render(<GiftList />, document.getElementById('root'))
