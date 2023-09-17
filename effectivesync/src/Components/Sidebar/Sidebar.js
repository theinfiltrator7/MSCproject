import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import axios from "axios";
import Cookies from "js-cookie";

import { Link } from "react-router-dom";
import { Button } from "antd";

const myProjects = [
  { projectId: "project-1", name: "My Board" },
  { projectId: "project-2", name: "My Board 2" },
];

const Sidebar = (props) => {
  return (
    <div className="sidebarWrapper">
      <div className="listWrapper">
        <div className="list">
          <Link to="/">My Boards</Link>
        </div>
        {props.userBoards
          ? props.userBoards.map((board, i) => {
              return (
                <div
                  onClick={() => props.onBoardSelect(board._id)}
                  className="sidebarSubListWrapper"
                  key={i}
                >
                  <img
                    className="sidebarIcon"
                    alt="plus sign"
                    src={require("../../assets/plus.png")}
                  />
                  <div className="sidebarSubList">{board.title}</div>
                </div>
              );
            })
          : null}
        {props.addingBoard ? (
          <div>
            <div style={{ paddingBottom: 5 }}>Enter Board Name</div>
            <input
              type="text"
              style={{ height: 26, fontFamily: "Ubuntu" }}
              onChange={(e) => props.boardNameHandler(e)}
            />
            <Button
              style={{ fontFamily: "Ubuntu", marginTop: 5 }}
              onClick={props.onSubmit}
            >
              Submit
            </Button>
            <Button
              style={{ fontFamily: "Ubuntu", marginTop: 5, marginLeft: 5 }}
              onClick={() => props.setAddingBoard(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            style={{ fontFamily: "Ubuntu" }}
            className="sidebarSubList"
            onClick={props.addBoardHandler}
          >
            Add Board+
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
