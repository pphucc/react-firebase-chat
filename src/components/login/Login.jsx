import React from "react";
import "./Login.css";
import { toast } from "react-toastify";

const Login = () => {
  const [avatar, setAvatar] = React.useState({
    file: null,
    url: "",
  });

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (file)
      setAvatar({
        file,
        url: URL.createObjectURL(file),
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
  };
  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="email" name="email" id="" placeholder="Email" />
          <input type="password" name="password" id="" placeholder="Password" />
          <button>Sign In</button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an image
          </label>
          <input
            type="file"
            name=""
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" name="username" id="" placeholder="Username" />
          <input type="email" name="email" id="" placeholder="Email" />
          <input type="password" name="password" id="" placeholder="Password" />
          <button>Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
