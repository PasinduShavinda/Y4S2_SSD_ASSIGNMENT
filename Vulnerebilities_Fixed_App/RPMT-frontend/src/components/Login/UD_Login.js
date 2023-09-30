import React, { useState ,useEffect} from "react";
import "./UD_Login.css";
import LoginImg from "../../assets/login_left.png";
import { Link, useNavigate } from "react-router-dom";
import ReCAPCHA  from 'react-google-recaptcha'
import axios from "axios";
import swal from "sweetalert";


const SITE_KEY = '6Ledi2QoAAAAAMoccGF-kNdG9jnPz36fnRJ6jz5O'



const UD_Login = () => {
  let navigate = useNavigate();
  
  const [recaptchavalue, setrecaptchavalue] = useState('')
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(10); // Initial countdown time in seconds
  const [remainingAttempts, setRemainingAttempts] = useState(5); // Initialize with the maximum allowed attempts
  
  const handlesubmit = value =>{
    setrecaptchavalue(value)
    console.log(value)
  }
  useEffect(() => {
    let timer;
    if (showCountdown && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      },  1000,); // Update countdown every second
    } else if (showCountdown && countdown === 0) {
      setShowCountdown(false);
      clearTimeout(timer);
    }
    return () => clearTimeout(timer); // Cleanup timer on unmount or when countdown stops
  }, [showCountdown, countdown]);

  const handleFailedLogin = () => {
    setRemainingAttempts(remainingAttempts - 1); // Decrease remaining attempts
    if (remainingAttempts <= 0) {
      setShowCountdown(true);
      setCountdown(900); // Set the countdown time to 15 minutes (15 * 60 seconds)
    }
  };

  const Login = () => {
    const user = {
      email: email,
      password: password,
      recaptchavalue: recaptchavalue
      
    };

    axios
      .post("http://localhost:5001/auth/login", user)
      .then((res) => {
        if (res.data.message === "success") {
          var currentUser = res.data.data;
          if (currentUser.type === "admin") {
            localStorage.setItem("user-info-admin", currentUser);
            //history.push("/dashboard");
            navigate("/dashboard");
          } else {
            localStorage.setItem("user-info-customer", currentUser);
            // history.push("/stdHome", { currentUser });
            navigate("/stdHome", { currentUser });
          }
        } else {
          if (res.data.error === "Too many login attempts from this IP, please try again later.") {
            handleFailedLogin();
          }
          swal("Sorry", "Login Failed", "error");
        }
      })
      .catch((error) => {
        handleFailedLogin();
        swal("Sorry", error.response.data.error, "error");
      });
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
                  
           </div>
           
           
            <div className="UDSDbtngroup">
              <div className="UDReCAPCHA" >
              <ReCAPCHA
            sitekey = {SITE_KEY}
            onChange= {handlesubmit}/>
              </div>
           
        
              <button className="UDSDbtn" onClick={Login}>
                Login
              </button>
              <h3 className="UDSDloginlink">
                Don't have an account?
                <Link to="/signup" className="link">
                  <span>SIGNUP</span>
                </Link>
              </h3>
              
            

              {showCountdown && (
            <div className="countdown-timer">
              <p>
                Too many login attempts. Retry in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")} minutes.
              </p>
             
            </div>
          )}
            </div>
          
          </div>
          
          <div className="UDSDright"></div>
          
        </div>
      
      </div>
    </>
  );
};

export default UD_Login;
