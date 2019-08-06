import React, { useState } from "react";
import Modal from "react-modal";
import { sumBy, sortBy } from 'lodash'

import Card from './card'

function orderByValue(cards) {
  return sortBy(cards, card => card.value)
}

export default function DiscardPile({ cards }) {
  const [isOpen, toggleModal] = useState(false)
  const piles = Object.keys(cards)
  const count = sumBy(piles, color => cards[color].length)

  return <>
    <button
      className="br1 ba"
      onClick={() => toggleModal(true)}
    >
        Discard ({count})
    </button>

    <Modal
      isOpen={isOpen}
      onRequestClose={() => toggleModal(false)}
      className="modal w-40"
      overlayClassName="modal-overlay"
    >
      <div className="flex flex-column items-center">
        <h1>Discarded cards</h1>
        <div className="flex">
          {piles.map((color, i) => (
            <div
              key={i}
              className="flex flex-column"
            >
              {!cards[color].length && (
                <Card
                  color={color}
                  size="large"
                  className='ma1'
                />
              )}
              {orderByValue(cards[color]).map((card, j) => (
                <Card 
                  card={card}
                  size="large"
                  className="ma1"
                  style={j ? {marginTop: '-20px'} : {}}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  </>
}
