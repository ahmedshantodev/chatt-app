import React, { useState } from "react";
import "./registration.css";
// material ui
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Heading from "../../components/layout/Heading";
import Paragraph from "../../components/layout/Paragraph";
import Image from "../../components/layout/Image";
import registrationImage from "../../../public/images/registration page image.png";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { toast } from "react-toastify";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";

const Register = () => {
  const auth = getAuth();
  let navigate = useNavigate();
  const [eyeOpen, setEyeOpen] = useState(false);

  const [registrationData, setRegistrationData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    // e.target.name ta [ ] ar modde ken neoya holo?
    setRegistrationData({
      ...registrationData,
      [e.target.name]: e.target.value,
    });
    setRegistrationError({ ...registrationError, [e.target.name]: "" });
  };

  const [registrationError, setRegistrationError] = useState({
    email: "",
    name: "",
    password: "",
  });

  const handleSubmit = () => {
    let pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!registrationData.email) {
      setRegistrationError({ ...registrationError, email: "email required" });
    } else if (!pattern.test(registrationData.email)) {
      setRegistrationError({
        ...registrationError,
        email: "valid email required",
      });
    } else if (!registrationData.name) {
      setRegistrationError({ ...registrationError, name: "name required" });
    } else if (!registrationData.password) {
      setRegistrationError({
        ...registrationError,
        password: "password required",
      });
    } else if (registrationData.password.length < 6) {
      setRegistrationError({
        ...registrationError,
        password: "password must be greater then 6",
      });
    } else {
      setSaveButton(true);
      createUserWithEmailAndPassword(
        auth,
        registrationData.email,
        registrationData.password
      )
        .then((userCredential) => {
          setSaveButton(false);
          sendEmailVerification(auth.currentUser).then(() => {
            setRegistrationData({ name: "", email: "", password: "" });
            toast.success(
              "Registration Successfull, Please check your email for verification",
              {
                position: "bottom-center",
                autoClose: 3000,
                draggable: true,
                theme: "dark",
              }
            );
            navigate("/log-in");
          });
        })
        .catch((error) => {
          setSaveButton(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorMessage.includes("auth/email-already-in-use")) {
            setRegistrationError({
              ...registrationError,
              email: "Email already exists",
            });
          }
        });
    }
  };

  const [saveButton, setSaveButton] = useState(false);

  return (
    <section>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid xs={6.5}>
            <div className="registration-left-part">
              <Heading
                className="registration-heading"
                text={"Get started with easily register"}
              />
              <Paragraph
                className={"registration-para"}
                text="Free register and you can enjoy it"
              />

              <div className="input-area">
                <TextField
                  value={registrationData.email}
                  name="email"
                  id="outlined-basic"
                  label="Email Address"
                  variant="outlined"
                  onChange={handleChange}
                />
                {registrationError.email && (
                  <Alert severity="error" color="warning">
                    {registrationError.email}
                  </Alert>
                )}

                <TextField
                  value={registrationData.name}
                  name="name"
                  id="outlined-basic"
                  label="Full Name"
                  variant="outlined"
                  onChange={handleChange}
                />
                {registrationError.name && (
                  <Alert severity="error" color="warning">
                    {registrationError.name}
                  </Alert>
                )}
                <div className="password">
                  <TextField
                    value={registrationData.password}
                    name="password"
                    type={eyeOpen ? "text" : "password"}
                    id="outlined-basic"
                    label="Password"
                    variant="outlined"
                    onChange={handleChange}
                  />
                  {eyeOpen ? (
                    <FaEye
                      onClick={() => setEyeOpen(!eyeOpen)}
                      className="eye"
                    />
                  ) : (
                    <FaEyeSlash
                      onClick={() => setEyeOpen(!eyeOpen)}
                      className="eye"
                    />
                  )}
                </div>
                {registrationError.password && (
                  <Alert severity="success" color="warning">
                    {registrationError.password}
                  </Alert>
                )}
                {!saveButton ? (
                  <Button onClick={handleSubmit} variant="contained">
                    Sign up
                  </Button>
                ) : (
                  <LoadingButton
                    loading
                    loadingPosition="start"
                    startIcon={<SaveIcon />}
                    variant="outlined"
                  >
                    Save
                  </LoadingButton>
                )}
                <Paragraph
                  text={[
                    "Already  have an account ?",
                    <Link to="/log-in" className="sign-in">
                      Sign In{" "}
                    </Link>,
                  ]}
                  className={"bottom-text"}
                />
              </div>
            </div>
          </Grid>
          <Grid xs={5.5}>
            <Image
              imageLink={registrationImage}
              altText={"random-image"}
              className={"registration-right-image"}
            />
          </Grid>
        </Grid>
      </Box>
    </section>
  );
};

export default Register;
