import { useRouter } from "next/router";
import React, { useContext, useState } from "react";

import { TutorialContext } from "~/components/tutorial";
import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";
import { IGameStatus } from "~/game/state";
import { useGame } from "~/hooks/game";

interface Props {
  onCloseArea: Function;
}

export default function MenuArea(props: Props) {
  const { onCloseArea } = props;

  const [showRules, setShowRules] = useState(false);
  const { reset } = useContext(TutorialContext);
  const router = useRouter();
  const game = useGame();

  function onMenuClick() {
    router.push("/");
  }

  function onTutorialClick() {
    reset();
    onCloseArea();
  }

  return (
    <div className="flex justify-center items-center w-100 h-100">
      {!showRules && (
        <div className="flex justify-center">
          {game.status === IGameStatus.ONGOING && (
            <Button
              className="mr2"
              size={ButtonSize.MEDIUM}
              text="Tutorial"
              onClick={onTutorialClick}
            />
          )}
          <Button
            className="mr2"
            size={ButtonSize.MEDIUM}
            text="Rules"
            onClick={() => setShowRules(true)}
          />
          <Button size={ButtonSize.MEDIUM} text="Menu" onClick={onMenuClick} />
        </div>
      )}

      {showRules && (
        <div className="w-100 h-100 w-75-l ph4 relative tj lh-copy">
          <Button
            className="absolute left-2 top-1"
            size={ButtonSize.MEDIUM}
            text="<"
            onClick={() => setShowRules(false)}
          />
          <img
            className="absolute top-0 right-0 mw4 o-50"
            src="/static/hanabi.png"
          />
          <div className="flex flex-column">
            <Txt
              className="w-100 tc mt2 dib"
              size={TxtSize.LARGE}
              value="Hanabi"
            />
            <Txt
              className="txt-yellow"
              size={TxtSize.MEDIUM}
              value="Objective"
            />
            <Txt
              className="mv2"
              value="Hanabi is a cooperative game, which means a game in which players
            are not against each other but assemble to reach a common goal. They
            incarn here distracted pyrotechnists who - by inattention - mixed their
            powder, wicks and rockets for a large fireworks display. The show
            will begin soon and the situation is a bit chaotic. They will need
            to help each other to prevent the show turning to disaster."
            />
            <Txt className="mv2">
              The goal of the pyrotechnics team is to build 5 fireworks, one of
              each color (white, red, blue, yellow, green) by combining
              increasing value cards (1,2,3,4,5) of the same color.
              <br />
              With the multicolor option, you need to build a 6th firework.
            </Txt>
            <Txt className="txt-yellow" size={TxtSize.MEDIUM} value="Setup" />
            <Txt className="mv2">
              The app sets up everything for you, which is handy 😉. At the
              beginning of a game, you will have 8 blue tokens - your hints -
              and 3 red tokens - your strike tokens.
              <br />
              The deck is composed of 50 cards, 10 of each color{" "}
              <span className="gray">
                with numbers 1, 1, 1, 2, 2, 3, 3, 4, 4, 5
              </span>
              . The multicolor option adds 5 multicolor cards{" "}
              <span className="gray">wth numbers 1, 2, 3, 4, 5</span>.
              <br />• In a 2 or 3 player game, each player will be dealt 5 cards
              <br />• In a 4 or 5 player game, each player will be dealt 4 cards
            </Txt>
            <Txt
              className="mv2"
              value="As you will see, players are not allowed to look at their own
              cards!"
            />
            <Txt
              className="txt-yellow"
              size={TxtSize.MEDIUM}
              value="Playing the game"
            />
            <Txt className="mv2">
              On each player&lsquo;s turn, they take one (and only one) of the
              three following actions. You are not allowed to pass.
              <br />
              1. Give information to another player.
              <br />
              2. Discard a card.
              <br />
              3. Play a card
              <br />
              Players are not allowed to give hints or suggestions on other
              player&lsquo;s turns!
            </Txt>
            <Txt size={TxtSize.MEDIUM} value="1. Give information" />
            <Txt className="mv2">
              When you give information, it will remove a blue token. Note: If
              you have no more blue tokens, you cannot choose to give
              information and must pick a different action. <br />
              You then give information to a fellow player about the cards in
              that player&lsquo;s hand by clicking on it. You can tell the
              player either about one (and only one) color, or one (and only
              one) value of card.
            </Txt>
            <Txt size={TxtSize.MEDIUM} value="2. Discard a card" />
            <Txt className="mv2">
              Discarding a card returns a blue token. You discard a card from
              your hand by tapping it. You then draw a new card from the deck
              and it will be added to your hand.
              <br />
              Note: If you have all 8 blue tokens, you cannot discard cards and
              must pick a different action.
              <br /> You can consult discarded cards by clicking on the grey
              deck
            </Txt>
            <Txt size={TxtSize.MEDIUM} value="3. Play a card" />
            <Txt className="mv2">
              At your turn, to play a card, take a card from your hand and play
              it.
              <br />
              One of two things happens:
              <br />● If the card begins or adds to a firework, it will be added
              to that firework pile <br />● If the card does not add to a
              firework, it will be discarded the card and add a red strike token
              <br />
              Then you will draw a replacement card from the deck.
            </Txt>
            <Txt
              className="mv2"
              value="When a player finishes a firework by playing a value 5 card
              on it, it will return one blue token to the lid of the box as a bonus. If
              all the blue tokens are in the box lid, you do not get the
              bonus."
            />
          </div>
          <Txt
            className="txt-yellow"
            size={TxtSize.MEDIUM}
            value="End of the Game"
          />
          <br />
          <Txt className="mv2">
            Hanabi can end in three ways:
            <br />● If you get the third red token, you lose the game as the
            display goes up in flames!
            <br />● If the team completes all five colors of firework with a
            value of 5, the team makes a spectacular victory display and obtains
            the maximum score of 25 points - 30 with multicolor option!
            <br /> ● If a player draws the last card from deck, the game is
            almost over. Each player gets one more turn, including the player
            who drew the last card. Players cannot draw more cards during these
            final turns.
            <br />
            <br />
            The players then score their performance based on the fireworks they
            assembled.
          </Txt>
        </div>
      )}
    </div>
  );
}
