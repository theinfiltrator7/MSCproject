import React from "react";
import "./Login.css";

import pattern from "./assets/pattern.jpg";
import { Button as AntdButton } from "antd";

const Login = (props) => {

  return (
    <div className="loginWrapper">
      <div className="loginLeftWrapper">
        <img className="loginBackgroundImage" src={pattern} />
      </div>
      <div className="loginFormWrapper">
        <div className="loginFormContent">
          {props.screen === "SIGNUP" ? (
            <div className="loginHeading">SignUp</div>
          ) : (
            <div className="loginHeading">SignUp</div>
          )}
          <input
            className="loginInputField"
            name="email"
            type="email"
            onChange={props.onChange}
            placeholder="Enter your email"
          />
          <input
            className="loginInputField"
            name="password"
            type="password"
            onChange={props.onChange}
            placeholder="Enter password"
          />
          {props.screen === "SIGNUP" ? (
            <input
              className="loginInputField"
              name="passwordConfirm"
              type="password"
              onChange={props.onChange}
              placeholder="Confirm password"
            />
          ) : null}
          <div className="loginButtonWrapper">
            <AntdButton
              state={props.networkCallState}
              onClick={props.submitForm}
            >
              {props.screen === "SIGNUP" ? "Signup" : "Login"}
            </AntdButton>
          </div>

          {props.screen === "SIGNUP" ? (
            <div className="loginText">
              {"I already have an account "}
              <span
                className="loginTextClickable"
                onClick={() => {
                  props.toggleScreen("LOGIN");
                }}
              >
                Login
              </span>
              {" instead"}
            </div>
          ) : (
            <div className="loginText">
              {" "}
              <span
                className="loginTextClickable"
                onClick={() => {
                  props.toggleScreen("SIGNUP");
                }}
              >
                Signup
              </span>{" "}
              instead
            </div>
          )}
          <div className="loginText" style={{ color: "red" }}>
            {props.message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
