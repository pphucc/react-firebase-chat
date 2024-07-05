import "./AddUser.css";
import React from "react";

const AddUser = () => {
  return (
    <div className="addUser">
      <form action="">
        <input type="text" placeholder="Username" name="username" />
        <button onClick={(e) => e.preventDefault()}>Search</button>
      </form>
      <div className="user">
        <div className="detail">
          <img src="./avatar.png" alt="" />
          <span>Jane Doe</span>
        </div>
        <button >Add User</button>
      </div>
    </div>
  );
};

export default AddUser;
