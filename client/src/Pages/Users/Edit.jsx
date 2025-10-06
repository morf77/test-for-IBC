import { Close } from "@mui/icons-material";
import {
  Autocomplete,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import React from "react";
import { updateUser } from "../../redux/action/user";
import { useDispatch, useSelector } from "react-redux";
import {
  PiHandCoins,
  PiHouseLine,
  PiImage,
  PiImages,
  PiMapPinLine,
  PiNotepad,
  PiRuler,
  PiXLight,
} from "react-icons/pi";
import {
  Divider,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  DialogActions,
} from "@mui/material";
import { pakistanCities } from "../../constant";
import { CFormSelect } from "@coreui/react";
import { errorMessages, errorRegexMessages, regexes } from "./CreateUser";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const EditModal = ({ open, setOpen, isClient }) => {
  /////////////////////////////////////// VARIABLES ///////////////////////////////////////
  const dispatch = useDispatch();
  const { currentUser, isFetching } = useSelector((state) => state.user);
  const initialEmployeeState = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
  };

  /////////////////////////////////////// STATES ///////////////////////////////////////
  const [userData, setUserData] = useState(currentUser);
  const [submitTriggered, setSubmitTriggered] = useState(false);

  /////////////////////////////////////// USE EFFECT ///////////////////////////////////////
  useEffect(() => {
    setUserData(currentUser);
  }, [currentUser]);

  /////////////////////////////////////// FUNCTIONS ///////////////////////////////////////
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
    dispatch(updateUser(currentUser._id, userData, userData?.role));
    setUserData(initialEmployeeState);
    setOpen(false);
  };

  const handleInputChange = (field, value) => {
    setUserData((prevFilters) => ({ ...prevFilters, [field]: value }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      scroll={"paper"}
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth="sm"
      maxWidth="sm"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle className="flex items-center justify-between">
        <div className="text-sky-400 font-primary">Edit Employee</div>
        <div className="cursor-pointer" onClick={handleClose}>
          <PiXLight className="text-[25px]" />
        </div>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-2 p-3 text-gray-500 font-primary">
          <div className="text-xl flex justify-start items-center gap-2 font-normal">
            <PiNotepad size={23} />
            <span>Employee Detials</span>
          </div>
          <Divider />
          <table className="mt-4">
            <tr>
              <td className="pb-4 text-lg">First Name </td>
              <td className="pb-4">
                <TextField
                  size="small"
                  fullWidth
                  value={userData?.firstName}
                  error={checkError("firstName")}
                  helperText={checkMessage("firstName")}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="pb-4 text-lg">Last Name </td>
              <td className="pb-4">
                <TextField
                  size="small"
                  fullWidth
                  value={userData?.lastName}
                  error={checkError("lastName")}
                  helperText={checkMessage("lastName")}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
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
                  value={userData?.email}
                  error={checkError("email")}
                  helperText={checkMessage("email")}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td className="pb-4 text-lg">User Name </td>
              <td className="pb-4">
                <TextField
                  size="small"
                  fullWidth
                  value={userData?.username}
                  error={checkError("username")}
                  helperText={checkMessage("username")}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                />
              </td>
            </tr>
            <tr>
              <td className="flex items-start pt-2 text-lg">Phone </td>
              <td className="pb-4">
                <TextField
                  type="number"
                  size="small"
                  value={userData?.phone}
                  error={checkError("phone")}
                  helperText={checkMessage("phone")}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
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
  );
};

export default EditModal;
