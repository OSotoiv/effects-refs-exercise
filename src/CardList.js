import React, { useState, useEffect, useRef } from "react";
import Card from './Card.js'
import axios from 'axios'
import './Card.css'


//holds the state for a list of cards and the state for a card form
//renders both after making api call
const CardList = () => {
    const [cardList, setCardList] = useState([]);
    const [autoPlay, setAutoPlay] = useState(false);
    //you need to set the remaining here for the initial render so that the 'get card' button will render first and not break from undefined
    const deck = useRef({ remaining: true });
    const timerID = useRef();
    //onload call for a new deck set the ref of deck to new deck {} 
    useEffect(() => {
        async function initDeck() {
            const { data } = await axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
            deck.current = data;
        }
        initDeck();
    }, []);
    //when autoplay state is true set intervall to get a card every 1 sec
    useEffect(() => {
        if (autoPlay) {
            timerID.current = setInterval(() => {
                getCard()
            }, 1000)
        }//clear the interval when autoplay changes back to false
        return () => clearInterval(timerID.current)
    }, [autoPlay])
    async function getCard() {
        const { data } = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.current.deck_id}/draw/?count=1`);
        data.cards[0].rotation = Math.floor(Math.random() * 360) + 1;
        setCardList(cardList => [...cardList, data.cards[0]]);
        deck.current.remaining = data.remaining;
        if (data.remaining === 0) setAutoPlay(false);
    }
    async function shuffle() {
        const { data } = await axios.get(`https://deckofcardsapi.com/api/deck/${deck.current.deck_id}/shuffle/`)
        deck.current = data;
        setCardList([]);
    }

    return <>
        <div className="card-row">
            {deck.current.remaining ? <button onClick={() => setAutoPlay(!autoPlay)}>{autoPlay ? 'Stop Auto Play' : 'Start Auto Play'}</button> : null}
            <div className="card-pile">
                {deck.current.remaining ? <button onClick={getCard}>get card</button> : <button onClick={shuffle}>shuffle cards</button>}
            </div>
            <div className="card-pile">
                {cardList.map(card => <Card key={card.code} cardImg={card.image} rotation={card.rotation} />)}
            </div>
        </div>
    </>
}
export default CardList;
