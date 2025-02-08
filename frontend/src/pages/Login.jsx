import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email: email,
        password: password,
      });

      console.log("Response from server:", response.data); // Log response data

      // Assuming the backend sends back a success message
      // alert(response.data.message || "Login successful!"); // Displaying success message or a default message
    //   toast.success("Login successful!!", {
    //     position: "top-center",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //     // transition: Bounce,
    //   });
      // Redirect to language selection page after successful login
      navigate("/");
    } catch (err) {
      console.error("Error during login:", err);
      if (err.response) {
        console.log("Response data:", err.response.data); // Log response data
        console.log("Response status:", err.response.status); // Log response status
        console.log("Response headers:", err.response.headers); // Log response headers

        // Handle different error cases
        if (err.response.status === 403) {
          // User not found
          // alert("Incorrect email or password. Please try again.");
        //   toast.error("Incorrect email or password!", {
        //     position: "top-center",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //     progress: undefined,
        //     theme: "light",
        //     // transition: Bounce,
        //   });
        } else {
          // Other errors
          alert(err.response.data.message || "An error occurred during login."); // Displaying error message
        }
      } else {
        // alert("An error occurred during login. Please try again."); // Generic error message
        // toast("An error occurred during login. Please try again.");
        // toast.error("User doesnt exist. Please Register First!", {
        //   position: "top-center",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        //   // transition: Bounce,
        // });
      }
    }
  };

  const handleSignup = () => {
    navigate("/register");
  };

  const crossClick = () => {
    navigate("/");
  };

  return (
    <>
      {/* <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        // transition: Bounce
      /> */}
      <div
        className="h-screen w-screen flex justify-center items-center relative bg-white"
        style={{ fontFamily: "Literata, serif" }}
      >
        <div className="ocean">
          <div className="wave"></div>
          <div className="wave wave2"></div>
        </div>
        <div className="ellipse0 opacity-75 rounded-full absolute -top-8 -left-8 z-0"></div>
        <div className="ellipse0 rounded-full opacity-75 absolute top-[40%] left-[60%] z-0"></div>

        <div className=" w-screen h-screen top-0 left-0 z-1 flex justify-center items-center ">
          <div className="relative bg-[##ffffff6b] backdrop-blur-sm z-1 border-2 border-[#ededff] shadow-lg shadow-[rgba(0,0,0,0.25)] rounded-2xl py-16 px-16">
            <span onClick={crossClick} className="cursor-pointer">
              {/* <img src={cross} alt="waves" className="absolute top-4 right-4" /> */}
            </span>
            <div className="flex">
              {/* <img src={logo} className="h-24 mr-8 mb-4" alt="logo" /> */}
              <h1
                className="text-center blur-none text-4xl mt-4 mb-8 font-extrabold text-[#60359E]"
                style={{ fontFamily: "Literata, serif" }}
              >
                Login
              </h1>
            </div>
            <div className="flex">
              <input
                value={email}
                placeholder="Email"
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                className="border-b-2 border-slate-400 w-64 py-2 bg-transparent outline-none font-medium text-slate-700"
                required
              />
              <span className="border-b-2 border-slate-400 pb-2">
                {/* <img src={user} alt="user" /> */}
              </span>
            </div>
            <div className="flex mt-8">
              <input
                value={password}
                placeholder="Password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="border-b-2 border-slate-400 w-64 py-2 bg-transparent outline-none font-medium text-slate-700"
                required
              />
              <span className="border-b-2 border-slate-400 pb-2">
                {/* <img src={lock} alt="lock" /> */}
              </span>
            </div>
            <div
              className="text-center text-2xl font-extrabold text-[#60359E] bg-white py-2 px-4 mt-8 mb-8 rounded-lg shadow-lg shadow-[rgba(0,0,0,0.25)]  hover:bg-[#60359E] hover:text-white cursor-pointer"
              style={{
                fontFamily: "Literata, serif",
                border: "1px solid #CFC4EC",
              }}
            >
              <button className="" type="submit" onClick={handleSubmit}>
                Log in
              </button>
            </div>
            <div
              className="text-center text-2xl font-extrabold text-[#60359E] bg-white py-2 px-4 mt-8 mb-8 rounded-lg shadow-lg shadow-[rgba(0,0,0,0.25)]  hover:bg-[#60359E] hover:text-white cursor-pointer"
              style={{
                fontFamily: "Literata, serif",
                border: "1px solid #CFC4EC",
              }}
            >
              <button className="" type="submit" onClick={handleSubmit}>
                Sign in with google
              </button>
            </div>

            <span className="text-[#8f8f8f] font-medium text-xl">
              Don't have an account?{" "}
            </span>
            <span
              className="border-b-2 border-[#7D7D7D] text-[#7D7D7D] font-semibold text-xl cursor-pointer"
              onClick={handleSignup}
            >
              Sign up
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
