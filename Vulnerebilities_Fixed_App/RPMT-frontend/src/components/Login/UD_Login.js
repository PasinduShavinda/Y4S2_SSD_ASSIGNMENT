import React, { useState, useEffect } from "react";
import "./UD_Login.css";
import LoginImg from "../../assets/login_left.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import swal from "sweetalert";

const UD_Login = () => {

  let navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const Login = () => {
    const user = {
      email: email,
      password: password,
    };

    axios
      .post("http://localhost:8090/auth/login", user)
      .then((res) => {
        if (res.data.message === "success") {
          var currentUser = res.data.data;
          if (currentUser.type === "admin") {
            localStorage.setItem("user-info-admin", currentUser);
            navigate("/dashboard");
          } else {
            localStorage.setItem("user-info-customer", currentUser);
            navigate("/stdHome", { currentUser });
          }
        } else {
          swal("Sorry", "Login Failed", "error");
        }
      })
      .catch((error) => {
        swal("Sorry", error.response.data.error, "error");
      });
  };

  // Handle the google login button

  const handleGoogleLoginClick = () => {
    // Redirect to the Google OAuth login page
    window.location.href = 'http://localhost:8090/auth/google'; 
  };

  return (
    <>
      <div className="UDSDmain">
        <div className="UDSDlogin">
          <div className="UDSDleft">
            <img src={LoginImg} alt="" className="UDSDloginTitle" />
            <div className="UDSDform">
              <h3 className="email">Email</h3>
              <input
                type="text"
                className="emailInput"
                onChange={(e) => setEmail(e.target.value)}
              />
              <h3 className="password">Password</h3>
              <input
                type="password"
                className="passwordInput"
                onChange={(e) => setPassword(e.target.value)}
              />
              <br></br>
              <button className="UDSDbtn" onClick={handleGoogleLoginClick}>
                Login
              </button>
            </div>
            
            <div className="UDSDbtngroup">
              <button className="UDSDbtn" onClick={Login}>
                Login
              </button>
              <h3 className="UDSDloginlink">
                Don't have an account?
                <Link to="/signup" className="link">
                  <span>SIGNUP</span>
                </Link>
              </h3>
            </div>
          </div>
          <div className="UDSDright"></div>
        </div>
      </div>
    </>
  );
};

export default UD_Login;
