import { hashUserPassword, varifyPassword } from "../authentication/bcrypt.js";
import { generateJwtToken } from "../config/GenerateJwtTokens.js";
import Story from "../model/story.js";
import User from "../model/user.js";

const getLoggedinUser = async (req, res) => {
  try {
    const { _id } = req.user;

    if (_id) {
      const user = await User.findById(_id);
      res.status(200).json({ user });
    } else {
      res.status(400).json({ message: error.message });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    if (name && password) {
      const userExists = await User.findOne({ name: name });

      if (userExists) {
        const varify = await varifyPassword(userExists?.password, password);
        if (!varify) {
          const hashPassword = await hashUserPassword(password);
          const user = new User({ name, password: hashPassword });
          user.save();
          const token = await generateJwtToken(user._id);
          res.status(201).json({ user, token });
        } else {
          res.status(400).json({ message: "User already exists!" });
        }
      } else {
        const hashPassword = await hashUserPassword(password);
        const user = new User({ name, password: hashPassword });
        user.save();
        const token = await generateJwtToken(user._id);
        res.status(201).json({ user, token });
      }
    } else {
      res.status(400).json({ message: "All inputs required!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });
    if (user) {
      const varify = await varifyPassword(user.password, password);
      if (varify) {
        const token = await generateJwtToken(user._id);
        res.status(200).json({ user, token });
      } else {
        res.status(401).json({ message: "User not found!" });
      }
    } else {
      res.status(404).json({ message: "User not found!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

const getUserAllStories = async (req, res) => {
  try {
    const { _id } = req.user;
    if (_id) {
      const userAllStories = (await Story.find({ owner: _id })).map(
        ({ stories, _id }) => {
          return {
            stories,
            _id,
          };
        }
      );
      res.status(200).json(userAllStories);
    } else {
      res.statsus(400).json({ message: "_id is required!" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

const editUserStory = async (req, res) => {
  try {
    const { _id } = req.user;
    const { editStory, id } = req.body;

    const edit = await Story.findByIdAndUpdate(id);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
export { getLoggedinUser, registerUser, loginUser, getUserAllStories };
