import React, { useState } from "react";
import Modal from "react-modal";
import { sumBy, sortBy } from 'lodash'

import Card, { CardWrapper } from './card'

function CardPile({ cards, color }) {
  if (!cards.length) {
    return <CardWrapper
      color={color}
      size="large"
      className='ma1'
    />
  }

  const sortedCards = sortBy(cards, card => card.value)

  return <div className="flex flex-column">
    {sortedCards.map((card, i) => (
      <Card
        key={i}
        card={card}
        size="large"
        className="ma1"
        style={i ? {marginTop: '-20px'} : {}}
      />
    ))}
  </div>
}

export default function DiscardPile({ cards }) {
  const [isOpen, toggleModal] = useState(false)
  const piles = Object.keys(cards)
  const count = sumBy(piles, color => cards[color].length)

  return <>
    <button
      className="pa3 br1 ba f4 fw2 tracked ttu ml2 gray pointer"
      onClick={() => toggleModal(true)}
    >
        Discard ({count})
    </button>

    <Modal
      isOpen={isOpen}
      onRequestClose={() => toggleModal(false)}
      className="absolute bg-white br3 pa3 outline-0 w-60"
      overlayClassName="fixed absolute--fill bg-black-40 z-999 flex items-center justify-center"
    >
      <div className="flex flex-column items-center">
        <h1 className="fw2 tracked ttu ml1 gray">Discarded cards</h1>
        <div className="flex">
          {piles.map((color, i) => (
            <CardPile
              key={i}
              cards={cards[color]}
              color={color}
            />
          ))}
        </div>
      </div>
    </Modal>
  </>
}
