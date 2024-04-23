import React, { useEffect, useState } from "react";
import Home from "../../components/home/home";
import Header from "../../components/header/header";
import { useSelector } from "react-redux";
import {
  addStoryMode,
  loginMode,
  registerMode,
} from "../../redux/app/appSlice";
import Register from "../../components/register/register";
import style from "./homePage.module.css";
import Login from "../../components/login/login";
import AddStory from "../../components/addStory/addStory";
import { selectStory, toggle } from "../../redux/story/storySlice";
import Story from "../../components/story/story";
const HomePage = () => {
  const [clickStory, setClickStory] = useState([]);
  const registerStatus = useSelector(registerMode);
  const loginStatus = useSelector(loginMode);
  const addStoryStatus = useSelector(addStoryMode);
  const showStory = useSelector(selectStory);
  const toggleStory = useSelector(toggle);
  useEffect(() => {
    setClickStory(showStory);
  }, [toggleStory]);
  console.log(clickStory);

  return (
    <>
      {clickStory?.length > 0 && <Story />}
      {addStoryStatus && <AddStory />}
      {loginStatus && <Login />}
      {registerStatus && <Register />}
      <div
        className={
          (registerStatus && style.blur) ||
          (loginStatus && style.blur) ||
          (addStoryStatus && style.blur) ||
          (showStory.length > 0 && style.blur)
        }
      >
        <Header />
        <Home />
      </div>
    </>
  );
};

export default HomePage;
