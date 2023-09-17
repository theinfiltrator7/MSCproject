import React, { lazy, useState } from "react";
import ReactModal from "react-modal";
import "./CardModal.css";
import axios from "axios";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Checkbox, FormControl, Select, MenuItem } from "@mui/material";
import { Button } from "antd";
import dayjs from "dayjs";

const CardModal = (props) => {
  let initialData = {
    title: "",
    priority: "MEDIUM",
    description: "",
    dueDate: dayjs(new Date()),
    completed: false,
    list: [],
    rank: 0,
    assignedTo: [],
    isDeleted: false,
    checkList: [],
  };


  const [cardData, setCardData] = useState({
    ...initialData,
    ...props.cardInitialData,
  });


  const [email, setEmail] = useState("");

  let onPriorityChangeHandler = (e) => {
    setCardData({ ...cardData, priority: e.target.value });
  };

  let onChangeHandler = (e) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  let onDueDateChangeHandler = (value) => {
    setCardData({
      ...cardData,
      dueDate: value,
    });
  };

  let checklistChangeHours = (value, index) => {
    let temp = [...cardData.checkList];
    temp[index].hoursRequired = value;
    setCardData({
      ...cardData,
      checkList: temp,
    });
  };

  let checklistChangeTitle = (value, index) => {
    let temp = [...cardData.checkList];
    temp[index].title = value;
    setCardData({
      ...cardData,
      checkList: temp,
    });
  };

  let onAddNewItemHandler = () => {
    setCardData({
      ...cardData,
      checkList: [
        ...cardData.checkList,
        {
          isCompleted: false,
          title: "",
          hoursRequired: 0,
          isEditing: true,
        },
      ],
    });
  };

  let toggleChecklist = (index) => {
    let temp = [...cardData.checkList];
    temp[index].isCompleted = !temp[index].isCompleted;
    setCardData({
      ...cardData,
      checkList: temp,
    });
  };

  let getRecommendationHandler = () => {
    let memberData = props.boardAdmin
      .concat(props.boardMember)
      .map((member) => ({
        email: member.email,
        totalExperience: member.totalExperience,
        skills: member.skills,
      }));
    axios
      .post("http://127.0.0.1:8000/", {
        title: cardData.title,
        memberData: memberData,
      })
      .then(async (res) => {
        for (let i = 0; i < res.data.length; i++) {
          await addMemberToCard(res.data[i]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let removeAssigned = (i) => {
    let temp = [...cardData.assignedTo];
    temp.splice(i, 1);
    setCardData({
      ...cardData,
      assignedTo: temp,
    });

    axios
      .patch("/card/removeUser", {
        cardId: cardData._id,
        email: cardData.assignedTo[i].email,
        list: cardData.list,
      })
      .then((res) => {
        props.getBoardData();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function addMemberToCard(email) {
    return axios
      .patch("/card/addUser", {
        cardId: cardData._id,
        email: email,
        list: cardData.list,
      })
      .then((res) => {
        props.getBoardData();
        setEmail("");
        setCardData({ ...cardData, assignedTo: res.data.newCard.assignedTo });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // function deleteMember() {

  // }

  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={props.cardOpen}
      onRequestClose={props.modalClose}
      style={{
        overlay: { zIndex: 2 },
        content: {
          top: "15vh",
          bottom: "15vh",
          left: "20vw",
          right: "20vw",
          minWidth: 600,
          borderRadius: 15,
          backgroundColor: "#fff9df",
        },
      }}
    >
      <div className="cardModalWrapper">
        <div className="modalHeaderWrapper">
          <div>
            <input
              name="title"
              value={cardData.title}
              onChange={(e) => onChangeHandler(e)}
              className="modalHeading"
              placeholder="Enter card title"
              style={{
                marginBottom: 0,
                fontFamily: "Ubuntu",
                fontSize: 15,
                padding: 10,
                width: 320,
              }}
            />
          </div>
          <div className="modalHeaderFiller" />
          <div className="modalPriorityWrapper">
            <div className="modalSubHeading">Priority</div>
            <FormControl fullWidth>
              <Select
                style={{ fontFamily: "Ubuntu" }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={cardData.priority}
                label="Priority"
                onChange={(e) => onPriorityChangeHandler(e)}
              >
                <MenuItem style={{ fontFamily: "Ubuntu" }} value={"HIGH"}>
                  HIGH
                </MenuItem>
                <MenuItem style={{ fontFamily: "Ubuntu" }} value={"MEDIUM"}>
                  MEDIUM
                </MenuItem>
                <MenuItem style={{ fontFamily: "Ubuntu" }} value={"LOW"}>
                  LOW
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <Button
          onClick={getRecommendationHandler}
          style={{ fontFamily: "Ubuntu", marginBottom: 20, color: "green" }}
        >
          Run Recommender
        </Button>
        <div className="modalHeading">Description</div>
        <textarea
          name="description"
          placeholder="Enter card description"
          onChange={(e) => onChangeHandler(e)}
          className="descriptionInputText"
          value={cardData.description}
        />
        <div className="dueDateWrapper">
          <div className="modalHeading">Due Date</div>
          <div style={{ width: 210, paddingBottom: 20 }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  value={cardData.dueDate}
                  onChange={(newValue) => {
                    onDueDateChangeHandler(newValue);
                  }}
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        <div className="modalHeading">Members</div>
        <div style={{ display: "flex", paddingBottom: 20, width: 400 }}>
          <input onChange={(e) => setEmail(e.target.value)} value={email} />
          <div style={{ flexGrow: 2 }} />
          <Button
            onClick={() => addMemberToCard(email)}
            style={{ fontFamily: "Ubuntu" }}
          >
            Add
          </Button>
        </div>
        {cardData.assignedTo.map((assignee, i) => {
          return (
            <div
              key={i}
              style={{ display: "flex", paddingBottom: 20, width: 400 }}
            >
              <div>{assignee.email}</div>
              <div style={{ flexGrow: 2 }} />
              <Button
                onClick={() => removeAssigned(i)}
                style={{ fontFamily: "Ubuntu" }}
              >
                Remove
              </Button>
            </div>
          );
        })}
        <div className="modalHeading">Checklist</div>
        <div className="itemHeadingWrapper">
          <div className="itemHeadings">DONE</div>
          <div className="itemHeadings">HOURS</div>
          <div className="itemHeadings">ITEM DESCRIPTION</div>
        </div>
        {cardData.checkList.map((list, i) => {
          if (!list.isEditing) {
            return (
              <div
                className="checklistWrapper"
                key={i}
                // onClick={() => onEditListItem(i)}
              >
                <Checkbox
                  checked={list.isCompleted}
                  onChange={() => toggleChecklist(i)}
                />
                <div className="checklistHours">{`${list.hoursRequired} hrs`}</div>
                <div className="checklistDescription">{list.title}</div>
              </div>
            );
          } else {
            return (
              <div className="newCheckListWrapper" key={i}>
                <div className="checklistWrapper">
                  <div className="checkListItemWrapper">
                    <div style={{ paddingLeft: 12 }}>Hours</div>
                    <input
                      className="listInputHours"
                      type="number"
                      value={list.hoursRequired}
                      onChange={(e) => checklistChangeHours(e.target.value, i)}
                    />
                  </div>
                  <div className="checkListItemWrapper">
                    <div style={{ paddingLeft: 12 }}>Item Description</div>
                    <input
                      className="listInputDescription"
                      value={list.title}
                      onChange={(e) => checklistChangeTitle(e.target.value, i)}
                    />
                  </div>
                </div>
              </div>
            );
          }
        })}
        <Button
          onClick={onAddNewItemHandler}
          style={{ marginTop: 10, marginBottom: 25, fontFamily: "Ubuntu" }}
        >
          Add New Item to Checklist
        </Button>
        <div></div>
        <Button
          onClick={() => props.onCardModalSubmit(cardData)}
          style={{ marginTop: 30, backgroundColor: "green" }}
          size="large"
        >
          Submit
        </Button>
      </div>
    </ReactModal>
  );
};

export default CardModal;
