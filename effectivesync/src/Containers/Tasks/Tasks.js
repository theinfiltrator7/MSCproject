import React from "react";
import "./Tasks.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";

const Tasks = () => {
  let tasks = [
    {
      id: "task-1",
      taskTitle:
        "create a navbar Task for today is to do something productive unlike other days",
      priority: "HIGH",
      dueDate: "01-02-2023",
    },
    {
      id: "task-2",
      taskTitle:
        "create a navbar Task for today is to do something productive unlike other days  ",
      priority: "LOW",
      dueDate: "01-07-2023",
    },
    {
      id: "task-3",
      taskTitle:
        "create a navbar Task for today is to do something productive unlike other days  ",
      priority: "MEDIUM",
      dueDate: "30-02-2023",
    },
  ];
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
  return (
    <div>
      <Navbar />
      <div className="content">
        <Sidebar />
        <div className="taskContentWrapper">
          <TableContainer component={Paper}>
            <Table sx={{ width: "80vw" }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>TASK</TableCell>
                  <TableCell align="center">PRIORITY</TableCell>
                  <TableCell align="center">DUE DATE</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow
                    key={task.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {task.taskTitle}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{
                        backgroundColor: getColor(task.priority),
                        height: 20,
                        borderRadius: 20,
                      }}
                    >
                      {task.priority}
                    </TableCell>
                    <TableCell align="center" sx={{ width: 150 }}>
                      {task.dueDate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* <div className="taskHeadingWrapper">
                    <div className="taskHeading" style={{textAlign: 'center'}}>Task</div>
                    <div className="taskHeadingSmall">List</div>
                    <div className="taskHeadingSmall">Priority</div>
                    <div className="taskHeadingSmall">Due Date</div>
                </div>
                <div className="taskContentWrapper">
                    <div className="taskContent">Task for today is to do something productive unlike other days </div>
                    <div className="taskContentSmall">List</div>
                    <div className="taskContentSmall">Priority</div>
                    <div className="taskContentSmall">Due Date</div>               
                </div> */}
        </div>
      </div>
    </div>
  );
};

export default Tasks;
