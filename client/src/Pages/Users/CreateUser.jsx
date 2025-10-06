import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createClient, createEmployee } from "../../redux/action/user";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { PiNotepad, PiXLight } from "react-icons/pi";
import { CFormSelect } from "@coreui/react";
import { pakistanCities } from "../../constant";

export const errorMessages = {
  firstName: "First Name is required",
  lastName: "Last Name is required",
  username: "Username is required",
  password: "Password is required",
  phone: "Phone is required",
  email: "Email is required",
};

// can be changed by business logic its for example
export const errorRegexMessages = {
  email: "Email is invalid",
  phone: "Phone is invalid",
  username: "Username is invalid",
  password: "Password is invalid",
  firstName: "First Name is invalid",
  lastName: "Last Name is invalid",
};
// can be changed by business logic its for example
export const regexes = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\d{10}$/,
  username: /^[a-zA-Z0-9]+$/,
  password: /^[a-zA-Z0-9]+$/,
  firstName: /^[a-zA-Z]+$/,
  lastName: /^[a-zA-Z]+$/,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CreateUser = ({ open, setOpen, scroll, isClient }) => {
  //////////////////////////////////////// VARIABLES /////////////////////////////////////
  const { isFetching } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const initialUserState = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    phone: "",
    email: "",
  };

  //////////////////////////////////////// STATES /////////////////////////////////////
  const [userData, setUserData] = useState(initialUserState);

  const [submitTriggered, setSubmitTriggered] = useState(false);

  //////////////////////////////////////// USE EFFECTS /////////////////////////////////////

  //////////////////////////////////////// FUNCTIONS /////////////////////////////////////
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      [
        "firstName",
        "lastName",
        "username",
        ...(isClient ? [] : ["password"]),
        "phone",
      ].some((field) => fieldError(field))
    )
      return setSubmitTriggered(true);

    dispatch(
      isClient
        ? createClient(userData, setOpen)
        : createEmployee(userData, setOpen)
    );

    setUserData(initialUserState);
    setSubmitTriggered(false);
  };

  const handleChange = (field, value) => {
    setUserData((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const handleClose = () => {
    setOpen(false);
    setUserData(initialUserState);
  };

  const fieldError = (field) => {
    return !userData[field] || !regexes[field].test(userData[field]);
  };

  const checkError = (field) => {
    return submitTriggered && fieldError(field);
  };

  const checkMessage = (field) => {
    return submitTriggered
      ? !userData[field]
        ? errorMessages[field]
        : !regexes[field].test(userData[field])
        ? errorRegexMessages[field]
        : ""
      : "";
  };

  return (
    <div>
      <Dialog
        scroll={scroll}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        fullWidth="sm"
        maxWidth="sm"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle className="flex items-center justify-between">
          <div className="text-sky-400 font-primary">
            Add New {isClient ? "Client" : "Employee"}
          </div>
          <div className="cursor-pointer" onClick={handleClose}>
            <PiXLight className="text-[25px]" />
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
            <div className="text-xl flex justify-start items-center gap-2 font-normal">
              <PiNotepad size={23} />
              <span>{isClient ? "Client" : "Employee"} Detials</span>
            </div>
            <Divider />
            <table className="mt-4">
              <tr>
                <td className="pb-4 text-lg">First Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    error={checkError("firstName")}
                    helperText={checkMessage("firstName")}
                    value={userData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Last Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    error={checkError("lastName")}
                    helperText={checkMessage("lastName")}
                    value={userData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">User Name </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    error={checkError("username")}
                    helperText={checkMessage("username")}
                    value={userData.username}
                    onChange={(e) => handleChange("username", e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="pb-4 text-lg">Email </td>
                <td className="pb-4">
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Optional"
                    error={checkError("email")}
                    helperText={checkMessage("email")}
                    value={userData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </td>
              </tr>
              {!isClient && (
                <tr>
                  <td className="flex items-start pt-2 text-lg">Password </td>
                  <td className="pb-4">
                    <TextField
                      type="password"
                      error={checkError("password")}
                      helperText={checkMessage("password")}
                      value={userData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      size="small"
                      fullWidth
                    />
                  </td>
                </tr>
              )}
              <tr>
                <td className="flex items-start pt-2 text-lg">Phone </td>
                <td className="pb-4">
                  <TextField
                    type="number"
                    size="small"
                    error={checkError("phone")}
                    helperText={checkMessage("phone")}
                    value={userData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    fullWidth
                  />
                </td>
              </tr>
            </table>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            onClick={handleClose}
            variant="contained"
            type="reset"
            className="bg-[#d7d7d7] px-4 py-2 rounded-lg text-gray-500 mt-4 hover:text-white hover:bg-[#6c757d] border-[2px] border-[#efeeee] hover:border-[#d7d7d7] font-thin transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            variant="contained"
            className="bg-primary-red px-4 py-2 rounded-lg text-white mt-4 hover:bg-red-400 font-thin"
          >
            {isFetching ? "Submitting..." : "Submit"}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreateUser;
