import React from "react";


// TODO: 4 sizes and not 2
// 2W = 2 of Whites
// * tiny for sentences, for ex `Aya played 2W`
// * small for others cards
// * medium for self cards
// * big when zooming on cards

export default (props) => (<div className={"br1 ba " + (props.large ? 'h3 w3' : 'h2 w2') }>card</div>);
