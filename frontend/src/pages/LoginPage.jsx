import React, { useContext, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { Context, server } from "../index.js";
import toast from "react-hot-toast";

const LoginPage = () => {
  const {isAuthenticated,setIsAuthenticated} = useContext(Context);
  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setUserDetail({
      ...userDetail,
      [event.target.name]: event.target.value,
    });
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(`${server}/login`,
        { email: userDetail.email, password: userDetail.password },
        { withCredentials: true }
      );
      setIsAuthenticated(true);
      console.log(isAuthenticated);
      // console.log("token : ", response.data.token);
      // console.log("user : ", response.data.user);
      Cookies.set("tokenf", response.data.token, {
        expires: 1,
      });
      console.log(isAuthenticated);
      // navigate(`/profile`);
      toast.success(`logged in`)
    } catch (error) {
      console.error("lgoin error", error);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated) return <Navigate to={"/profile"} />;
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper
          elevation={3}
          style={{ padding: "20px", borderRadius: "10px", textAlign: "center" }}
        >
          <h1>Login Page</h1>
          {!loading && (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                type="email"
                name="email"
                value={userDetail.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Password"
                variant="outlined"
                type={showPassword ? "text" : "password"}
                name="password"
                value={userDetail.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleTogglePasswordVisibility}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                style={{ marginTop: "10px" }}
              >
                Login
              </Button>
            </form>
          )}

          {loading && <CircularProgress size={100} />}
          {!isAuthenticated && (
            <h4 style={{ margin: "20px", fontSize: "16px", color: "black" }}>
              Not Signed Up ? Sign Up here
            </h4>
          )}

          {/* Signup button */}
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            style={{ marginTop: "10px" }}
            component={Link}
            to="/signup"
          >
            Sign Up
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default LoginPage;
