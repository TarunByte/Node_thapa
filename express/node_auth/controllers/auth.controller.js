import {
  authenticateUser,
  clearUserSession,
  clearVerifyEmailTokens,
  comparePassword,
  createUser,
  createVerifyEmailLink,
  findUserById,
  findVerificationEmailToken,
  generateRandomToken,
  getUserByEmail,
  hashPassword,
  insertVerifyEmailToken,
  sendNewVerifyEmailLink,
  updateUserByName,
  verifyUserEmailAndUpdate,
} from "../services/auth.services.js";
import {
  loginUserSchema,
  registerUserSchema,
  verifyEmailSchema,
  verifyUserSchema,
} from "../validators/auth-validator.js";
import { getAllShortLinks } from "../services/shorterner.services.js";
import { sendEmail } from "../lib/nodemailer.js";

export const getRegisterPage = (req, res) => {
  if (req.user) return res.redirect("/");

  return res.render("auth/register", { errors: req.flash("errors") });
};

// when the user register and click on register button
export const postRegister = async (req, res) => {
  if (req.user) return res.redirect("/");

  // console.log(req.body);
  // const { name, email, password } = req.body;

  const { data, error } = registerUserSchema.safeParse(req.body);
  // console.log(data);

  if (error) {
    let errors = JSON.parse(error)[0].message;
    console.log(error);
    req.flash("errors", errors);
    res.redirect("/register");
  }

  const { name, email, password } = data;

  const userExists = await getUserByEmail(email);
  console.log("userExists ", userExists);

  // if (userExists) return res.redirect("/register");
  if (userExists) {
    req.flash("errors", "User already exists");
    return res.redirect("/register");
  }

  const hashedPassword = await hashPassword(password);

  const [user] = await createUser({ name, email, password: hashedPassword });
  console.log(user);

  // res.redirect("/login");

  await authenticateUser({ req, res, user, name, email });

  await sendNewVerifyEmailLink({ email, userId: user.id });

  res.redirect("/");
};

export const getLoginPage = (req, res) => {
  if (req.user) return res.redirect("/");

  return res.render("auth/login", { errors: req.flash("errors") });
};

export const postLogin = async (req, res) => {
  if (req.user) return res.redirect("/");

  // const { email, password } = req.body;

  const { data, error } = loginUserSchema.safeParse(req.body);
  // console.log(data);

  if (error) {
    let errors = JSON.parse(error)[0].message;
    console.log(error);
    req.flash("errors", errors);
    res.redirect("/login");
  }

  const { email, password } = data;

  const user = await getUserByEmail(email);
  console.log("user ", user);

  if (!user) {
    req.flash("errors", "Invalid Email or Password");
    return res.redirect("/login");
  }
  //todo bcrypt.compare(plainTextPassword, hashedPassword)
  const isPasswordValid = await comparePassword(password, user.password);

  // if (user.password !== password) return res.redirect("/login");
  if (!isPasswordValid) {
    req.flash("errors", "Invalid Email or Password");
    return res.redirect("/login");
  }

  // res.cookie("isLoggedIn", true);

  // const token = generateToken({
  //   id: user.id,
  //   name: user.name,
  //   email: user.email,
  // });

  // res.cookie("access_token", token);

  // we need to create a session
  await authenticateUser({ req, res, user });

  res.redirect("/");
};

// Do You Need to Set Path=/ Manually?
// cookie-parser and Express automatically set the path to / by default.

export const getMe = (req, res) => {
  if (!req.user) return res.send("Not logged in");
  return res.send(`<h1>Hey ${req.user.name} - ${req.user.email}</h1>`);
};

export const logoutUser = async (req, res) => {
  await clearUserSession(req.user.sessionId);

  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.redirect("/login");
};

// getProfilePage
export const getProfilePage = async (req, res) => {
  if (!req.user) return res.send("Not logged in");

  const user = await findUserById(req.user.id);
  if (!user) return res.redirect("/login");

  const userShortLinks = await getAllShortLinks(user.id);

  return res.render("auth/profile", {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailValid: user.isEmailValid,
      createdAt: user.createdAt,
      links: userShortLinks,
    },
  });
};

//getVerifyEmailPage
export const getVerifyEmailPage = async (req, res) => {
  // if (!req.user || req.user.isEmailValid) return res.redirect("/");

  if (!req.user) return res.redirect("/");

  const user = await findUserById(req.user.id);

  if (!user || user.isEmailValid) return res.redirect("/");

  return res.render("auth/verify-email", {
    email: req.user.email,
  });
};

// resendVerificationLink
export const resendVerificationLink = async (req, res) => {
  if (!req.user) return res.redirect("/");
  const user = await findUserById(req.user.id);
  if (!user || user.isEmailValid) return res.redirect("/");

  await sendNewVerifyEmailLink({ email: req.user.email, userId: req.user.id });

  res.redirect("/verify-email");
};

//verifyEmailToken
export const verifyEmailToken = async (req, res) => {
  const { data, error } = verifyEmailSchema.safeParse(req.query);

  if (error) {
    return res.send("Verification link invalid or expired!");
  }

  // const token = await findVerificationEmailToken(data); // without joins
  const [token] = await findVerificationEmailToken(data); // with joins
  console.log("~ verifyEmailToken ~ token:", token);
  if (!token) res.send("Verification link invalid or expired!");

  await verifyUserEmailAndUpdate(token.email);

  // clearVerifyEmailTokens(token.email).catch(console.error);
  clearVerifyEmailTokens(token.userId).catch(console.error);

  return res.redirect("/profile");
};

//getEditProfilePage
export const getEditProfilePage = async (req, res) => {
  if (!req.user) return res.redirect("/");

  const user = await findUserById(req.user.id);
  if (!user) return res.status(404).send("User not found");

  return res.render("auth/edit-profile", {
    name: user.name,
    errors: req.flash("errors"),
  });
};

//postEditProfile
export const postEditProfile = async (req, res) => {
  if (!req.user) return res.redirect("/");

  // const user = req.body;
  const { data, error } = verifyUserSchema.safeParse(req.body);
  if (error) {
    let errorMessage = JSON.parse(error);
    console.log("error:", errorMessage);
    req.flash("errors", errorMessage);
    return res.redirect("/edit-profile");
  }

  await updateUserByName({ userId: req.user.id, name: data.name });

  return res.redirect("/profile");
};

//getChangePasswordPage
export const getChangePasswordPage = async (req, res) => {
  if (!req.user) return res.redirect("/");

  return res.render("auth/change-password", {
    errors: req.flash("errors"),
  });
};
