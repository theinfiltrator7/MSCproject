import React from "react";
import "./Card.css";
import dayjs from "dayjs";

import { Draggable } from "react-beautiful-dnd";
import { Button } from "antd";
import initialData from "../../initial-data";

function Card(props) {
  const checklistData = [
    {
      checklistId: "check-1",
      isDone: true,
      description: "do something",
      hours: 5,
      isEditing: false,
    },
    {
      checklistId: "check-2",
      isDone: true,
      description: "do something",
      hours: 2,
      isEditing: false,
    },
    {
      checklistId: "check-3",
      isDone: true,
      description: "do something",
      hours: 7,
      isEditing: false,
    },
    {
      checklistId: "check-4",
      isDone: false,
      description: "do something",
      hours: 1,
      isEditing: false,
    },
  ];

  const getPercent = (checkList) => {

  }

  const totalHours = props.card.checkList.reduce((sum, item) => sum + item.hoursRequired, 0);
  const hoursDone = props.card.checkList
    .filter((item) => item.isCompleted)
    .reduce((sum, item) => sum + item.hoursRequired, 0);

  let progressPercent = totalHours === 0 ? 0 : (hoursDone / totalHours) * 100;


  const getColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "red";
      case "MEDIUM":
        return "orange";
      case "LOW":
        return "green";
      default:
        return "grey";
    }
  };

  const dateObj = new Date(props.card.dueDate);
  let getSuffix = (num) => {
    const i = num % 10,
      j = num % 100;
    if (i === 1 && j !== 11) {
      return num + "st";
    }
    if (i === 2 && j !== 12) {
      return num + "nd";
    }
    if (i === 3 && j !== 13) {
      return num + "rd";
    }
    return num + "th";
  };

  const dateWithSuffix = getSuffix(dateObj.getDate());

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthValueName = monthNames[dateObj.getMonth()];
  return (
    <Draggable key={props.card._id} draggableId={props.card._id} index={props.index}>
      {(provided) => (
        <div
          className="card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {/* {props.card.image ? (
            <img className="displayImage" src={props.card.image} alt="img" />
          ) : null} */}
          <div className="headerWrapper" style={{ paddingLeft: "10px" }}>
            {props.card.title}
          </div>
          <div className="headerWrapper">
            <div
              className="priority"
              style={{ backgroundColor: getColor(props.card.priority) }}
            >
              {props.card.priority}
            </div>
            <div className="spaceContainer" />
            <div className="dueDate">{`Due on ${monthValueName} ${dateWithSuffix}`}</div>
          </div>
          <div className="description">{props.card.content}</div>
          <div className="utilityWrapper">
            {!!props.card.checkList?.length && (
              <div>
                <img
                  className="cardIcon"
                  src={require("../../assets/checklist.png")}
                  alt="checklist icon"
                />
              </div>
            )}
            <div onClick={() => props.cardClicked(props.card)}>
              <img
                className="cardIcon"
                src={require("../../assets/description.png")}
                alt="description icon"
              />
            </div>
          </div>
          <div className="progressWrapper">
            <div className="progressText"> Progress </div>
            <div className="spaceContainer" />
            <div className="dueDate">{totalHours}hrs+</div>
          </div>
          <div className="progessbar">
            {console.log("====", progressPercent)}
            <div
              className="progress"
              style={{ width:progressPercent == NaN? 0 : `${progressPercent}%` }}
            ></div>
          </div>
          <div className="footerWrapper">
 
            <div className="spaceContainer" />
            <Button
              style={{
                marginRight: 10,
                marginBottom: 10,
                backgroundColor: "#e0ffff",
                fontFamily: "Ubuntu",
                zIndex: 0,
              }}
              size="small"
              onClick={() => props.cardClicked(props.card)}
            >
              EDIT CARD
            </Button>
            <Button
              style={{
                marginRight: 10,
                marginBottom: 10,
                backgroundColor: "#e0ffff",
                fontFamily: "Ubuntu",
                zIndex: 0,
              }}
              size="small"
              onClick={() => props.deleteCard(props.card._id, props.card.list)}
            >
              DELETE
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Card;
