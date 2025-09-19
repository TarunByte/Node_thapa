import { createUser, getUserByEmail } from "../services/auth.services.js";

export const getRegisterPage = (req, res) => {
  return res.render("auth/register");
};

export const postRegister = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const userExists = await getUserByEmail(email);
  console.log("userExists ", userExists);

  if (userExists) return res.redirect("/register");

  const [user] = await createUser({ name, email, password });
  console.log(user);

  res.redirect("/login");
};

export const getLoginPage = (req, res) => {
  return res.render("auth/login");
};

export const postLogin = (req, res) => {
  // res.setHeader("Set-Cookie", "isLoggedIn=true; path=/;");
  res.cookie("isLoggedIn", true);
  res.redirect("/");
};

// Do You Need to Set Path=/ Manually?
// cookie-parser and Express automatically set the path to / by default.
