import { useState } from "react";
import { TileAnimation, TileState, WordleEvaluation } from "./wordle/wordle";
import "./WordleRow.css";

function WordleTile(props: {
  state: TileState | WordleEvaluation,
  letter: string
}) {
  const [animation, setAnimation] = useState("idle");
  const [i, u] = useState(false);
  return <div
    className="wordle-tile"
    data-state={props.state}
    data-animation={animation}
    onAnimationEnd={e => {
      if (e.animationName === TileAnimation.PopIn && animation === "pop") {
        setAnimation("idle");
      }
      if (e.animationName === TileAnimation.FlipIn) {
        setAnimation("flip-out");
        u(true);
      }
      if (e.animationName === TileAnimation.FlipOut) {
        setAnimation('idle');
        // n && s.current && void 0 !== t && r(Co(t)))
      }
    }}>
    {props.letter}
  </div>;
}

/*function WordleTileCopied(props) {
  var t = props.rowIndex,
  n = props.last,
  a = props.letter,
  o = props.evaluation,
  r = T(),
  s = x.useRef(null),
  i = To(x.useState('idle'), 2),
  l = i[0],
  c = i[1],
  e = To(x.useState(!1), 2),
  i = e[0],
  u = e[1];
  x.useEffect(function () {
    c(a ? 'pop' : 'idle')
  }, [
    a
  ]),
  x.useEffect(function () {
    o && c('flip-in')
  }, [
    o
  ]);
  e = 'empty';
  return i && o ? e = o : a && (e = 'tbd'),
  x.createElement('div', {
    className: Lo.tile,
    ref: s,
    onAnimationEnd: function (e) {
      e.animationName === Lo.PopIn && 'pop' === l && c('idle'),
      e.animationName === Lo.FlipIn && (c('flip-out'), u(!0)),
      e.animationName === Lo.FlipOut && (c('idle'), n && s.current && void 0 !== t && r(Co(t)))
    },
    'data-state': e,
    'data-animation': l || 'idle',
    'data-testid': 'tile'
  }, a)
}*/

export default function WordleRow(props: {
  states?: Array<TileState | WordleEvaluation>
  letters: string
}) {
  if (props.states && props.states.length !== props.letters.length) {
    throw new Error("props letters and states should have the same length");
  }
  const tiles = [];
  for (let i = 0; i < props.letters.length; i++) {
    tiles.push(<WordleTile letter={props.letters[i]} state={props.states ? props.states[i] : TileState.empty} key={i} />);
  }
  return <div className="wordle-row">
    {tiles}
  </div>;
}
