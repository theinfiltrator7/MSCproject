import React, { useState, useEffect } from "react";
import "./Home.css";
import axios from "axios";
import ReactModal from "react-modal";

import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";
import CardHolder from "../../Components/CardHolder/CardHolder";
import { DragDropContext } from "react-beautiful-dnd";
import CardModal from "../../Components/CardModal/CardModal";
import { Button } from "antd";
import dayjs from "dayjs";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardInitialData, setCardInitialData] = useState({});

  const [userBoards, setUserBoards] = useState(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [addingBoard, setAddingBoard] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [selectedCardListId, setSelectedCardListId] = useState(null);
  const [newListTitle, setNewListTitle] = useState("");

  const [boardLists, setBoardLists] = useState();

  const [listUpdated, setListUpdated] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const [memberEmail, setMemberEmail] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  const [boardAdmin, setBoardAdmin] = useState([]);
  const [boardMember, setBoardMember] = useState([]);

  const [resumeFile, setResumeFile] = useState(null);

  const [selectedMemberIndex, setSelectedMemberIndex] = useState(null);
  const [selectedAdminIndex, setSelectedAdminIndex] = useState(null);

  useEffect(() => {
    if (!selectedBoard) return;
    getBoardData();
  }, [selectedBoard, listUpdated]);

  useEffect(() => {
    getAllBoards();
  }, [addingBoard]);

  let createList = () => {
    axios
      .post("/list/", {
        title: newListTitle,
        board: selectedBoard,
      })
      .then(function (res) {
        setListUpdated(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  let getBoardData = () => {
    axios
      .get(`/board/${selectedBoard}`)
      .then(function (res) {
        setBoardAdmin(res.data.board.admins);
        setBoardMember(res.data.board.users);
        let obj = {};
        const { cards, lists } = res.data;
        if (lists) {
          cards.forEach((card) => {
            if (obj[card.list]) {
              obj[card.list].push(card);
            } else {
              obj[card.list] = [card];
            }
          });

          lists.forEach((list) => {
            list.cards = obj[list._id]
              ? obj[list._id].sort((a, b) => a.rank - b.rank)
              : [];
          });

          setBoardLists(lists);
          setListUpdated(false);
          setNewListTitle("");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  let getAllBoards = () => {
    axios
      .get("/board")
      .then(function (res) {
        let boardData = [];
        boardData = boardData.concat(res.data.user.adminBoard);
        boardData = boardData.concat(res.data.user.userBoard);
        setUserBoards(boardData);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  let onSubmit = () => {
    axios
      .post("/board", {
        title: newBoardName,
      })
      .then(function (response) {
        setAddingBoard(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  let boardNameHandler = (e) => {
    let boardName = e.target.value;
    setNewBoardName(boardName);
  };

  let addBoardHandler = () => {
    setAddingBoard(true);
  };

  let onAddingNewCardHandler = (id, index) => {
    setIsModalOpen(true);
    setSelectedCardListId(id);
    setCardInitialData({
      rank: index * 100,
    });
  };

  let onListNameChangeHandler = (e) => {
    setNewListTitle(e.target.value);
  };

  let showMemberToggleHandler = () => {
    setShowMembers(!showMembers);
  };

  let onDragEnd = (result) => {
    if (
      result.source.index === result.destination.index &&
      result.source.droppableId === result.destination.droppableId
    )
      return;

    let boardListsCopy = [...boardLists];

    let sourceList = boardListsCopy.find(
      (list) => list._id === result.source.droppableId,
    );
    let destinationList = boardListsCopy.find(
      (list) => list._id === result.destination.droppableId,
    );
    let sourceCard = sourceList.cards[result.source.index];

    sourceList.cards.splice(result.source.index, 1);
    if (destinationList.cards) {
      destinationList.cards.splice(result.destination.index, 0, sourceCard);
    } else {
      destinationList.cards = [sourceCard];
    }

    let previousCard = destinationList.cards[result.destination.index - 1];
    let nextCard = destinationList.cards[result.destination.index + 1];

    let newRank = 100;
    if (previousCard && nextCard) {
      newRank = (previousCard.rank + nextCard.rank) / 2;
    } else if (!previousCard && nextCard) {
      newRank = nextCard.rank / 2;
    } else if (previousCard && !nextCard) {
      newRank = previousCard.rank + 100;
    }

    setBoardLists(boardListsCopy);

    axios
      .patch("/card", {
        _id: sourceCard._id,
        rank: newRank,
        list: destinationList._id,
      })
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    return;
  };

  let closeModalHandler = () => {
    setIsModalOpen(false);
  };

  let cardClickHandler = (card) => {
    setCardInitialData({
      ...card,
      dueDate: dayjs(card.dueDate),
    });
    setIsModalOpen(true);
  };

  let onCardModalSubmit = (data) => {
    if (data._id) {
      axios
        .patch(`/card`, { ...data })
        .then((resp) => {
          setIsModalOpen(false);
          getBoardData();
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      axios
        .post("/card", {
          ...data,
          dueDate: data.dueDate.toDate(),
          list: selectedCardListId,
          board: selectedBoard,
        })
        .then(function (response) {
          setIsModalOpen(false);
          getBoardData();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  let onBoardSelect = (id) => {
    if (id === selectedBoard) return;
    setBoardAdmin([]);
    setBoardMember([]);
    setBoardLists([]);
    setSelectedBoard(id);
  };

  function getTitleById(id) {
    const item = userBoards.find((obj) => obj._id === id);
    return item ? item.title : null;
  }

  let deleteCard = (id, listId) => {
    axios
      .delete(`/card/${id}`, {
        data: {
          list: listId,
        },
      })
      .then((res) => {
        getBoardData();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let addAdminHandler = (email) => {
    axios
      .post("user/add-board-admin/", {
        board: selectedBoard,
        email: email,
      })
      .then((res) => {
        getBoardData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let addMemberHandler = (email) => {
    axios
      .post("/user/add-board-user/", {
        board: selectedBoard,
        email: email,
      })
      .then((res) => {
        getBoardData();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let removeAdminHandler = (email) => {
    axios
      .post("/user/remove-board-admin/", {
        board: selectedBoard,
        email: email,
      })
      .then((res) => {
        getBoardData();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let removeMemberHandler = (email) => {
    axios
      .post("/user/remove-board-user/", {
        board: selectedBoard,
        email: email,
      })
      .then((res) => {
        getBoardData();
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  let resumeParseHandler = (email) => {
    const formData = new FormData();
    formData.append("resume", resumeFile);

    axios
      .post("http://127.0.0.1:4000", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        axios
          .post("/user/add-skills-user/", {
            email: email,
            totalExperience: res.data.total_exp,
            skills: res.data.skills,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="wrapper">
      {isModalOpen && (
        <CardModal
          modalClose={closeModalHandler}
          cardOpen={isModalOpen}
          cardInitialData={cardInitialData}
          onCardModalSubmit={onCardModalSubmit}
          boardAdmin={boardAdmin}
          boardMember={boardMember}
          getBoardData={getBoardData}
        />
      )}
      <Navbar />
      <div className="content">
        <Sidebar
          userBoards={userBoards}
          addingBoard={addingBoard}
          setAddingBoard={setAddingBoard}
          boardNameHandler={boardNameHandler}
          onSubmit={onSubmit}
          addBoardHandler={addBoardHandler}
          onBoardSelect={onBoardSelect}
        />
        <div className="homeContent">
          {selectedBoard ? (
            <div>
              <div className="homeBoardTitle">
                <div>{getTitleById(selectedBoard)}</div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    onClick={showMemberToggleHandler}
                    style={{
                      margin: 10,
                      backgroundColor: "#e0ffff",
                      fontFamily: "Ubuntu",
                    }}
                  >
                    {showMembers ? "SHOW BOARD" : "EDIT MEMBERS"}
                  </Button>
                </div>
              </div>
              <div className="homeSubContent">
                {showMembers ? (
                  <div className="memberContentWrapper">
                    <div className="memberHeading">Workspace Members</div>
                    <div>
                      Workspace members can view and join all Workspace and
                      create new boards in the Workspace.
                    </div>
                    <div className="memberHeading">
                      Add Admin or Member to Board
                    </div>
                    <div>
                      Anyone with a valid account in EffectiveSync can join this
                      board.
                    </div>
                    <div>Add ADMIN to board</div>
                    <div>Enter email address of user to be added as admin</div>
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                    <Button onClick={() => addAdminHandler(adminEmail)}>
                      ADD ADMIN
                    </Button>
                    <div>Add MEMBER to board</div>
                    <div>
                      Enter email address of user to be added as a member
                    </div>
                    <input
                      type="email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                    />
                    <Button onClick={() => addMemberHandler(memberEmail)}>
                      ADD MEMBER
                    </Button>

                    <div className="memberHeading">WORKSPACE MEMBERS</div>
                    <div style={{ paddingBottom: 10 }}>BOARD ADMINS</div>
                    {boardAdmin.map((member, i) => {
                      return (
                        <div className="memberDetailsWrapper" key={member._id}>
                          <div className="memberDetails">
                            <div className="memberDetailItems">
                              {member.email}
                            </div>
                            <Button
                              disabled={i === 0 ? true : false}
                              style={{ fontFamily: "Ubuntu", color: "red" }}
                              onClick={() => removeAdminHandler(member.email)}
                            >
                              Remove Admin
                            </Button>
                            {member.skills ? (
                              <Button
                                style={{ fontFamily: "Ubuntu", marginLeft: 20 }}
                                onClick={() => setSelectedAdminIndex(i)}
                              >
                                Show Skills
                              </Button>
                            ) : null}
                            {selectedAdminIndex === i ? (
                              <div>
                                <div style={{ padding: 10 }}>Skills</div>
                                {member.skills.map((skill) => {
                                  return (
                                    <div style={{ display: "flex" }}>
                                      <div
                                        style={{
                                          paddingLeft: 15,
                                          paddingBottom: 9,
                                        }}
                                      >
                                        +
                                      </div>
                                      <div style={{ paddingLeft: 10 }}>
                                        {skill}
                                      </div>
                                    </div>
                                  );
                                })}
                                <Button
                                  style={{ fontFamily: "Ubuntu", margin: 10 }}
                                  onClick={() => setSelectedAdminIndex(null)}
                                >
                                  Hide Skills
                                </Button>
                              </div>
                            ) : null}
                            <div className="memberDetailItems">
                              Upload Resume to Parse and update skills and
                              experience
                            </div>
                            <input
                              style={{ fontFamily: "Ubuntu" }}
                              className="memberDetailItems"
                              type="file"
                              onChange={(e) => {
                                setResumeFile(e.target.files[0]);
                              }}
                            />
                            <Button
                              style={{ fontFamily: "Ubuntu" }}
                              onClick={() => resumeParseHandler(member.email)}
                            >
                              Upload Resume
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                    <div style={{ paddingBottom: 10 }}>BOARD MEMBERS</div>
                    {boardMember.map((member, i) => {
                      return (
                        <div className="memberDetailsWrapper" key={member._id}>
                          <div className="memberDetails">
                            <div className="memberDetailItems">
                              {member.email}
                            </div>
                            <Button
                              style={{ fontFamily: "Ubuntu", color: "red" }}
                              onClick={() => removeMemberHandler(member.email)}
                            >
                              Remove Member
                            </Button>
                            {member.skills ? (
                              <Button
                                style={{ fontFamily: "Ubuntu", marginLeft: 20 }}
                                onClick={() => setSelectedMemberIndex(i)}
                              >
                                Show Skills
                              </Button>
                            ) : null}
                            {selectedMemberIndex === i ? (
                              <div>
                                <div style={{ padding: 10 }}>Skills</div>
                                {member.skills.map((skill) => {
                                  return (
                                    <div style={{ display: "flex" }}>
                                      <div
                                        style={{
                                          paddingLeft: 15,
                                          paddingBottom: 9,
                                        }}
                                      >
                                        +
                                      </div>
                                      <div style={{ paddingLeft: 10 }}>
                                        {skill}
                                      </div>
                                    </div>
                                  );
                                })}
                                <Button
                                  style={{ fontFamily: "Ubuntu", margin: 10 }}
                                  onClick={() => setSelectedMemberIndex(null)}
                                >
                                  Hide Skills
                                </Button>
                              </div>
                            ) : null}
                            <div className="memberDetailItems">
                              Upload Resume to Parse and update skills and
                              experience
                            </div>
                            <input
                              style={{ fontFamily: "Ubuntu" }}
                              className="memberDetailItems"
                              type="file"
                              onChange={(e) => {
                                setResumeFile(e.target.files[0]);
                              }}
                            />
                            <Button
                              style={{ fontFamily: "Ubuntu" }}
                              onClick={() => resumeParseHandler(member.email)}
                            >
                              Upload Resume
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: "flex" }}>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <div className="column">
                        {boardLists
                          ? boardLists.map((list) => {
                              return (
                                <CardHolder
                                  key={list._id}
                                  id={list._id}
                                  title={list.title}
                                  cards={list.cards}
                                  deleteCard={deleteCard}
                                  cardClicked={cardClickHandler}
                                  onNewCardHandler={onAddingNewCardHandler}
                                />
                              );
                            })
                          : null}
                      </div>
                    </DragDropContext>
                    <div className="newListWrapperHome">
                      <div>Add new List</div>
                      <input
                        onChange={(e) => onListNameChangeHandler(e)}
                        value={newListTitle}
                        type="text"
                        style={{
                          width: 220,
                          fontFamily: "Ubuntu",
                          marginTop: 10,
                        }}
                      />
                      <Button
                        style={{ fontFamily: "Ubuntu", marginTop: 10 }}
                        onClick={createList}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="addListHomeWrapper">
              <div className="addListHome">Select a board</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
