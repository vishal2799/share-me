import React from "react";
//import GoogleLogin from "react-google-login";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";

import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    axios
      .get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `Bearer ${response.access_token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        const { sub, name, picture } = res.data;
        const doc = {
          _id: sub,
          _type: "user",
          userName: name,
          image: picture,
        };
        client.createIfNotExists(doc).then(() => {
          navigate("/", { replace: true });
          console.log("created sanity");
        });
      })
      .catch((err) => {
        console.log(err);
      });
    // localStorage.setItem("user", JSON.stringify(response.profileObj));
    // const { name, googleId, imageUrl } = response.profileObj;
    // const doc = {
    //   _id: googleId,
    //   _type: "user",
    //   userName: name,
    //   image: imageUrl,
    // };
    // client.createIfNotExists(doc).then(() => {
    //   navigate("/", { replace: true });
    // });
  };
  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => responseGoogle(tokenResponse),
  });

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className=" relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0    bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" />
          </div>

          <div className="shadow-2xl">
            <button
              type="button"
              className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
              onClick={() => login()}
            >
              <FcGoogle className="mr-4" /> Sign in with google
            </button>
            {/* <GoogleLogin
              onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
              }}
              onError={() => {
                console.log("Login Failed");
              }}
            /> */}
            {/* <GoogleLogin
              clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <FcGoogle className="mr-4" /> Sign in with google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
