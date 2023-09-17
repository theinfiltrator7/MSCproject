import React from "react";
import "./CardHolder.css";
import { Droppable } from "react-beautiful-dnd";
import Card from "../Card/Card";

const CardHolder = (props) => {
  return (
    <div className="cardContainer">
      <div className="headerContainer">
        <div className="cardHolderTitle">{props.title}</div>
        <img
          className="cardHolderIcon"
          src={require("../../assets/options.png")}
        />
      </div>
        <Droppable droppableId={props.id}>
          {(provided) => (
            <div
              className="holder"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {props.cards?.map((card, index) => {
                return (
                  <Card
                    key={card._id}
                    index={index}
                    deleteCard={props.deleteCard}
                    card={card}
                    cardClicked={props.cardClicked}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

      <div
        className="addCardWrapper"
        onClick={() =>
          props.onNewCardHandler(props.id, props.cards?.length + 1 || 1)
        }
      >
        <img className="addCardIcon" src={require("../../assets/plus.png")} />
        <div className="addCard">Add New Card</div>
      </div>
    </div>
  );
};

export default CardHolder;
