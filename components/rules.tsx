import React, { ReactNode } from "react";

import Button, { ButtonSize } from "~/components/ui/button";
import Txt, { TxtSize } from "~/components/ui/txt";

interface TxtProps {
  children: ReactNode;
}

const Title = (props: TxtProps) => (
  <Txt className="txt-yellow mt3" size={TxtSize.MEDIUM}>
    {props.children}
  </Txt>
);

const Subtitle = (props: TxtProps) => (
  <Txt size={TxtSize.MEDIUM}>{props.children}</Txt>
);

const Paragraph = (props: TxtProps) => (
  <Txt className="mv2">{props.children}</Txt>
);

const GrayTxt = (props: TxtProps) => (
  <span className="gray">{props.children}</span>
);

interface Props {
  setShowRules: (showRules: boolean) => void;
}

export default function Rules(props: Props) {
  const { setShowRules } = props;

  return (
    <div className="absolute bg-main-dark z-9999 aspect-ratio--object overflow-y-scroll flex justify-center pa4 relative tj lh-copy">
      <div className="w-75-l">
        <Button
          className="absolute left-2 top-1"
          size={ButtonSize.MEDIUM}
          text="<"
          onClick={() => setShowRules(false)}
        />
        <img
          alt="Hanabi cards game online"
          className="absolute top-0 right-0 mw4 ma4 o-50"
          src="/static/hanabi.png"
        />
        <div className="flex flex-column mb5">
          <Txt
            className="w-100 tc mt2 dib"
            size={TxtSize.LARGE}
            value="Hanabi"
          />

          <Title>Objective</Title>

          <Paragraph>
            Hanabi is a card game created by Antoine Bauza. It's cooperative,
            which means that players are not against each other but assemble to
            reach a common goal. They incarn here distracted pyrotechnists who -
            by inattention - mixed their powder, wicks and rockets for a large
            fireworks display. The show will begin soon and the situation is a
            bit chaotic. They will need to help each other to prevent the show
            turning to disaster.
          </Paragraph>

          <Paragraph>
            The goal of the pyrotechnics team is to build 5 fireworks, one of
            each color (white, red, blue, yellow, green) by combining increasing
            value cards (1,2,3,4,5) of the same color.
            <br />
            With the multicolor option, you need to build a 6th firework.
          </Paragraph>

          <Title>Setup</Title>

          <Paragraph>
            The app sets up everything for you, which is handy 😉. At the
            beginning of a game, you will have 8 blue tokens - your hints - and
            3 red tokens - your strike tokens.
            <br />
            The deck is composed of 50 cards, 10 of each color{" "}
            <GrayTxt>with numbers 1, 1, 1, 2, 2, 3, 3, 4, 4, 5</GrayTxt>. The
            multicolor option adds 5 multicolor cards{" "}
            <GrayTxt>with numbers 1, 2, 3, 4, 5</GrayTxt>.
            <br />· In a 2 or 3 player game, each player will be dealt 5 cards
            <br />· In a 4 or 5 player game, each player will be dealt 4 cards
          </Paragraph>

          <Paragraph>
            As you will see, players are not allowed to look at their own cards!
          </Paragraph>

          <Title>Playing the game</Title>

          <Paragraph>
            On each player's turn, they take one (and only one) of the three
            following actions. You are not allowed to pass.
            <br />
            1. Give information to another player.
            <br />
            2. Discard a card.
            <br />
            3. Play a card
            <br />
            Players are not allowed to give hints or suggestions on other
            player's turns!
          </Paragraph>

          <Subtitle>1. Give information</Subtitle>

          <Paragraph>
            When you give information, it will remove a blue token. Note: If you
            have no more blue tokens, you cannot choose to give information and
            must pick a different action.
            <br />
            You then give information to a fellow player about the cards in that
            player's hand by clicking on it. You can tell the player either
            about one (and only one) color, or one (and only one) value of card.
          </Paragraph>

          <Subtitle>2. Discard a card</Subtitle>

          <Paragraph>
            Discarding a card returns a blue token. You discard a card from your
            hand by tapping it. You then draw a new card from the deck and it
            will be added to your hand.
            <br />
            Note: If you have all 8 blue tokens, you cannot discard cards and
            must pick a different action.
            <br />
            You can consult discarded cards by clicking on the grey deck
          </Paragraph>

          <Subtitle>3. Play a card</Subtitle>

          <Paragraph>
            At your turn, to play a card, take a card from your hand and play
            it.
            <br />
            One of two things happens:
            <br />
            · If the card begins or adds to a firework, it will be added to that
            firework pile
            <br />
            · If the card does not add to a firework, it will be discarded the
            card and add a red strike token
            <br />
            Then you will draw a replacement card from the deck.
          </Paragraph>

          <Paragraph>
            When a player finishes a firework by playing a value 5 card on it,
            it will return one blue token to the lid of the box as a bonus. If
            all the blue tokens are in the box lid, you do not get the bonus.
          </Paragraph>

          <Title>End of the Game</Title>

          <Paragraph>
            Hanabi can end in three ways:
            <br />
            · If you get the third red token, you lose the game as the display
            goes up in flames!
            <br />
            · If the team completes all five colors of firework with a value of
            5, the team makes a spectacular victory display and obtains the
            maximum score of 25 points - 30 with multicolor option!
            <br />
            · If a player draws the last card from deck, the game is almost
            over. Each player gets one more turn, including the player who drew
            the last card. Players cannot draw more cards during these final
            turns.
            <br />
            <br />
            The players then score their performance based on the fireworks they
            assembled.
          </Paragraph>
        </div>
      </div>
    </div>
  );
}
