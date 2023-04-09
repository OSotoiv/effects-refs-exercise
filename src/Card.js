import React from "react";
//build the actual card

const Card = ({ cardImg, rotation }) => {
    return <>
        <img src={cardImg} style={{ transform: `rotate(-${rotation}deg)` }} />
    </>
}
export default Card;