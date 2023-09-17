import React, { useState } from "react";
import "./Members.css";
import { FormControlLabel, FormGroup, Checkbox } from "@mui/material";

import Navbar from "../../Components/Navbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";

const Members = () => {
  let members = [
    {
      memberId: "meb-1",
      memberName: "Abed Koshy Abraham",
      memberEmail: "abedabraham98@gmail.com",
      admin: true,
    },
    {
      memberId: "meb-2",
      memberName: "Manu Koshy Abraham",
      memberEmail: "manuabraham98@gmail.com",
      admin: true,
    },
    {
      memberId: "meb-3",
      memberName: "Koshy Abraham",
      memberEmail: "koshyabraham@gmail.com",
      admin: true,
    },
    {
      memberId: "meb-4",
      memberName: "Abraham",
      memberEmail: "abraham@gmail.com",
      admin: false,
    },
  ];

  const [memberData, setMemberData] = useState(members);
  const [file, setFile] = useState(null);

  let handleChange = (memberId) => {
    let newMember = {
      ...memberData[memberId],
      admin: !memberData[memberId].admin,
    };
    let newMembers = [...memberData];
    newMembers.splice(memberId, 1, newMember);
    setMemberData(newMembers);
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onUpload = async () => {
    const formData = new FormData();
    formData.append("resume", file);
  };

  return (
    <div>
      <Navbar />
      <div className="memberWrapper">
        <Sidebar />
        <div className="contentWrapper">
          <div className="memberHeading">Workspace Members</div>
          <div>
            Workspace members can view and join all Workspace and create new
            boards in the Workspace.
          </div>
          <div className="memberHeading">Invite Members to join Workspace</div>
          <div>Anyone with an invite link can join this Workspace.</div>
          <div>INVITE LINK</div>
          <div className="memberHeading">WORKSPACE MEMBERS</div>
          {memberData.map((member, i) => {
            return (
              <div className="detailsWrapper" key={member.memberId}>
                <div className="details">
                  <div className="detailItems">{member.memberName}</div>
                  <div className="detailItems">{member.memberEmail}</div>
                  <input
                    className="detailItems"
                    type="file"
                    onChange={onFileChange}
                  />
                  <button onClick={onUpload}>Upload</button>
                </div>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={member.admin}
                        onChange={() => handleChange(i)}
                      />
                    }
                    label="ADMIN"
                  />
                </FormGroup>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Members;
