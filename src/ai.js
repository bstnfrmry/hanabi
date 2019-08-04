const { flatMap, last, uniqBy, sortBy, without } = require('lodash')

function lastActableHints(player) {
  return player.receivedHints.filter(hint => {
    hint.cardsPlayed = hint.cardsPlayed || 0

    // Exclude hints when their most recent card has already been played/discarded
    const [card] = hint.cards.slice(-hint.cardsPlayed - 1)
    const [positionDuringHint] = hint.positions.slice(-hint.cardsPlayed - 1)
    const positionInHand = player.hand.indexOf(card)

    if (positionInHand === -1) { return false }

    // Exclude hints when the only hinted card is in the discard position
    if (hint.cards.length === 1 && positionDuringHint === 0) { return false }

    // Exclude if I know fully know the card and can't play it
    if (card.knowledge.full && !player.game.canPlay(card)) { return false }

    return true
  })
}

async function ai({ game, player }) {
  // 0 - Figure out which hints I can give
  const hints = flatMap(['color', 'value'], hintType => flatMap(player.teammates, teammate => {
    return teammate.hand.filter((card, position) => {
      // Hint hasn't already been given
      if (card.knowledge[hintType]) {
        return false
      }

      // For unknown cards
      if (card.knowledge.none) {
        // Don't give discard hints for non-playable cards in a non discarding position
        if (position > 0 && !game.canPlay(card)) {
          return false
        }

        // Don't give play hint to discardable card
        if (position === 0 && game.canPlay(card)) {
          return false
        }
      }

      // Don't give hints that would break convention, except if a full reveal takes place
      const affectedCards = teammate.hand.filter(item => item[hintType] === card[hintType])
      const willReveal = affectedCards.filter(card => card.knowledge.partial && !card[hintType])
      if (card !== last(affectedCards) && !willReveal.length) {
        return false
      }

      // If team between me and them already have this card and know it
      if (player.teammates.find(teammate => teammate.hand.find(item => {
        return item.value === card.value
            && item.color === card.color
            && item.knowledge.full
      }))) {
        return false
      }

      return true
    }).map(card => {
      const actableCards = teammate.hand
        .filter(card => card.knowledge.full)
        .length
      const sideEffects = without(teammate.hand, card)
        .filter(sideCard => !sideCard.knowledge[hintType] && sideCard[hintType] === card[hintType])
      const playableSideEffects = uniqBy(sideEffects, card => `${card.color}.${card.value}`)
        .filter(sideCard => game.canPlay(sideCard))
      const actableHints = lastActableHints(teammate)
      const nextHintedCard = actableHints.length && actableHints[0].cardsPlayed === 0 && last(actableHints.cards)
      const inNextHintedCards = actableHints.find(item => item === card)
      const cardPosition = teammate.hand.indexOf(card)
      
      const score = 
        + (cardPosition === 0 && !game.canDiscard(card) && card.ageInDiscardPile >= 8 && !card.knowledge.value
          ? (card.value === 5 ? 2 : (card.value === 1) ? 1 : 1.5)
          : 0) // Avoid discarding important card when low on resources      
        + (game.canPlay(card) ? 0.9 : 0)               // Buff if card is playable immediately
        - (inNextHintedCards ? 2 : 0)
        - (card === nextHintedCard ? 2 : 0)          // Avoid hinting on next actable hint
        + (card.knowledge.partial && !card[hintType]  // Buff is card would then be fully reveals
          ? (game.canDiscard(card) ? 0.8 : 0.3)        // Buff furthermore if card can be discarded
          : 0)
        + (player.nextTeammate === teammate ? 0.7 : 0) // Buff next player
        - (lastActableHints(teammate).length ? 0.6 : 0) // Nerf if playable as an actable hint for next turn
        - (actableCards * 0.3)                         // Nerf for each already playable actions
        + (sideEffects.length * 0.2)                   // Buff for each side effects granted by this hint
        + (playableSideEffects.length * 0.3)           // Even more if some are playable

      return {
        hintType,
        score,
        card,
        player: teammate,
      }
    })
  }))

  const [topHint] = sortBy(hints, hint => -hint.score)

  // 1 - Play top hint if possible & valuable
  if (game.remainingNoteTokens && topHint && topHint.score >= 1.7) {
    return {
      player: topHint.player,
      reason: 'high value hint',
      ...topHint.hintType === 'color' && { type: 'hint-color', color: topHint.card.color },
      ...topHint.hintType === 'value' && { type: 'hint-value', value: topHint.card.value },
    }
  }
 
  // 2 - I have all hints on one of my cards and I can play it
  const hintedCards = sortBy(
    player.hand.filter(card => card.knowledge.color && card.knowledge.value),
    card => -card.value // Play highest cards first
  )
  
  if (hintedCards.length && game.canPlay(hintedCards[0])) {
    return { type: 'play', card: hintedCards[0], reason: 'knowledge by hint' }
  }

  // 3 - Know from deductions that one my cards is playable, 
  //     even thought I don't have all hints and my teammates don't
  //     necessary know I know. Played in second position because
  //     that kind of action might disrupt the "masterplan" since it
  //     can't be deduced by all teammates at the same time.
  const deducedCards = player.hand.filter(card => (
    uniqBy(card.guesses, item => item.color === card.color && item.value === card.value).length === 1
  ))
  const deducedCard = deducedCards.find(card => game.canPlay(card))
  if (deducedCard) {
    return { type: 'play', card: deducedCard, reason: 'knowledge by deduction' }
  }

  // 4 - I have a hint I can act upon
  const actableHints = lastActableHints(player).reverse().map(hint => {
    const [card] = hint.cards.slice(-hint.cardsPlayed - 1)

    const score = 
      + (hint.cardsPlayed === 0 ? 10 : 0) // Safe if no card from this hint have been played
      + (game.remainingStormTokens * 1)   // Safer if no storm tokens have been used
      - (hint.cardsPlayed * 0.5)          // Less safe if cards have been played on this hint
    
    return { hint, card, score }
  })

  const [{ hint, card, score: hintScore } = {}] = sortBy(actableHints, hint => -hint.score)

  if (hint && hintScore > 1) {
    if (hintScore < 10) {
      // console.log(`Playing with ${hintScore}`)
      // console.log(game.canPlay(card) ? 'OK' : 'KO ')
    }
    
    hint.cardsPlayed += 1

    return { type: 'play', card, reason: 'supposition from hint convention' }
  }

  // 5 - Discard known card
  const dicardableCard = [...hintedCards, ...deducedCards].find(card => game.canDiscard(card))
  if (dicardableCard) {
    return { type: 'discard', card: dicardableCard, reason: 'discard by knowledge' }
  }

  // 6 - Discard old card
  const [firstCard] = player.hand
  if (firstCard.ageInDiscardPile >= 9 && firstCard.knowledge.none) {
    return { type: 'discard', card: firstCard, reason: 'discard by age' }
  }

  // 6 - Play less valuable hint if possible
  if (game.remainingNoteTokens && topHint) {
    return {
      player: topHint.player,
      reason: 'low value hint',
      ...topHint.hintType === 'color' && { type: 'hint-color', color: topHint.card.color },
      ...topHint.hintType === 'value' && { type: 'hint-value', value: topHint.card.value },
    }
  }

  // 7 - Discard first card
  return { type: 'discard', card: firstCard, reason: 'discard by default' }
}

module.exports = {
  ai,
}
