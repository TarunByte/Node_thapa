import { decodeIdToken, generateCodeVerifier, generateState } from "arctic";
import {
  authenticateUser,
  clearResetPasswordToken,
  clearUserSession,
  clearVerifyEmailTokens,
  comparePassword,
  createResetPasswordLink,
  createUser,
  createUserWithOauth,
  createVerifyEmailLink,
  findUserByEmail,
  findUserById,
  findVerificationEmailToken,
  generateRandomToken,
  getResetPasswordToken,
  getUserByEmail,
  getUserWithOauthId,
  hashPassword,
  insertVerifyEmailToken,
  linkUserWithOauth,
  sendNewVerifyEmailLink,
  updateUserByName,
  updateUserPassword,
  verifyUserEmailAndUpdate,
} from "../services/auth.services.js";
import {
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  verifyEmailSchema,
  verifyPasswordSchema,
  verifyResetPasswordSchema,
  verifyUserSchema,
} from "../validators/auth-validator.js";
import { getAllShortLinks } from "../services/shorterner.services.js";
import { sendEmail } from "../lib/send-email.js";
import { getHtmlFromMjmlTemplate } from "../lib/get-html-from-mjml-template.js";
import { OAUTH_EXCHANGE_EXPIRY } from "../config/constant.js";
import { google } from "../lib/oauth/google.js";

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

  if (!user.password) {
    // database hash password
    // if password is null
    req.flash(
      "errors",
      "You have created account using social login. Please login with your social account."
    );
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
    let errorMessage = JSON.parse(error)[0].message;
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

//postChangePassword
export const postChangePassword = async (req, res) => {
  const { data, error } = verifyPasswordSchema.safeParse(req.body);
  if (error) {
    let errorMessage = JSON.parse(error)[0].message;
    console.log("error:", errorMessage);
    req.flash("errors", errorMessage);
    return res.redirect("/change-password");
  }

  const { currentPassword, newPassword } = data;

  const user = await findUserById(req.user.id);
  if (!user) return res.status(404).send("User not found");

  const isPasswordValid = comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    req.flash("errors", "Current Password that you entered is invalid");
    return res.redirect("/change-password");
  }

  await updateUserPassword({ userId: user.id, newPassword });

  return res.redirect("/profile");
};

//getResetPasswordPage
export const getResetPasswordPage = async (req, res) => {
  return res.render("auth/forgot-password", {
    formSubmitted: req.flash("formSubmitted")[0],
    errors: req.flash("errors"),
  });
};

//postForgotPassword
export const postForgotPassword = async (req, res) => {
  const { data, error } = forgotPasswordSchema.safeParse(req.body);

  if (error) {
    let errorMessage = JSON.parse(error)[0].message;
    console.log("error:", errorMessage);
    req.flash("errors", errorMessage);
    return res.redirect("/reset-password");
  }

  const user = await findUserByEmail(data.email);

  if (user) {
    const resetPasswordLink = await createResetPasswordLink({
      userId: user.id,
    });

    const html = await getHtmlFromMjmlTemplate("reset-password-email", {
      name: user.name,
      link: resetPasswordLink,
    });

    sendEmail({
      to: user.email,
      subject: "RESET YOUR PASSWORD",
      html,
    });
  }
  req.flash("formSubmitted", true);
  return res.redirect("/reset-password");
};

//getResetPasswordTokenPage
export const getResetPasswordTokenPage = async (req, res) => {
  const { token } = req.params;
  const passwordResetData = await getResetPasswordToken(token);
  if (!passwordResetData) return res.render("auth/wrong-reset-password-token");

  return res.render("auth/reset-password", {
    formSubmitted: req.flash("formSubmitted")[0],
    errors: req.flash("errors"),
    token,
  });
};

//! Extract password reset token from request parameters.
//! validate token authenticity, expiration, and match with a previously issued token.
//! If valid, get new password from request body and validate using a schema (e.g., Zod) for complexity.
//! Identify user ID linked to the token.
//! Invalidate all existing reset tokens for that user ID.
//! Hash the new password with a secure algorithm.
//! Update the user's password in the database with the hashed version.
//! Redirect to login page or return a success response.

//postResetPasswordToken
export const postResetPasswordToken = async (req, res) => {
  const { token } = req.params;
  const passwordResetData = await getResetPasswordToken(token);
  if (!passwordResetData) {
    req.flash("errors", "Password Token is not matching");
    return res.render("auth/wrong-reset-password-token");
  }

  const { data, error } = verifyResetPasswordSchema.safeParse(req.body);
  if (error) {
    let errorMessage = JSON.parse(error)[0].message;
    console.log("error:", errorMessage);
    req.flash("errors", errorMessage);
    return res.redirect(`/reset-password/${token}`);
  }

  const { newPassword } = data;

  const user = await findUserById(passwordResetData.userId);

  await clearResetPasswordToken(user.id);

  await updateUserPassword({ userId: user.id, newPassword });

  return res.redirect("/login");
};

//getGoogleLoginPage
export const getGoogleLoginPage = async (req, res) => {
  if (req.user) return res.redirect("/");

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const url = google.createAuthorizationURL(state, codeVerifier, [
    "openid", // this is called scopes, here we are giving openid, and profile
    "profile", // openid gives tokens if needed, and profile gives user information
    // we are telling google about the information that we require from user.
    "email",
  ]);

  const cookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: OAUTH_EXCHANGE_EXPIRY,
    sameSite: "lax", // this is such that when google redirects to our website, cookies are mantained
  };

  res.cookie("google_oauth_state", state, cookieConfig);
  res.cookie("google_code_verifier", codeVerifier, cookieConfig);

  res.redirect(url.toString());
};

//getGoogleLoginCallback
export const getGoogleLoginCallback = async (req, res) => {
  // google redirects with code, and state in query params
  // we will use code to find out the user
  const { code, state } = req.query;
  console.log(code);

  const {
    google_oauth_state: storedState,
    google_code_verifier: codeVerifier,
  } = req.cookies;

  if (
    !code ||
    !state ||
    !storedState ||
    !codeVerifier ||
    state !== storedState
  ) {
    req.flash(
      "errors",
      "couldn't login with Google because of invalid login attempt. Please try again!"
    );
    return res.redirect("/login");
  }

  let tokens;
  try {
    // arctic will verify the code given by google with code verifier internally
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch (error) {
    req.flash(
      "errors",
      "couldn't login with Google because of invalid login attempt. Please try again!"
    );
    return res.redirect("/login");
  }

  console.log("token google:", tokens);

  const claims = decodeIdToken(tokens.idToken());
  const { sub: googleUserId, name, email } = claims;

  // there are few things that we should do
  // Condition 1: User already exists with google's oauth linked
  // Condition 2: User already exists with the same email but google's oauth isn't linked
  // Condition 3: User doesn't exists.

  // if user is already linked then we will get the user
  let user = await getUserWithOauthId({
    provider: "google",
    email,
  });

  // if user exists but user is not linked with oauth
  if (user && !user.providerAccountId) {
    await linkUserWithOauth({
      userId: user.id,
      provider: "google",
      providerAccountId: googleUserId,
    });
  }

  // if user doesn't exist
  if (!user) {
    user = await createUserWithOauth({
      name,
      email,
      provider: "google",
      providerAccountId: googleUserId,
    });
  }
  await authenticateUser({ req, res, user, name, email });

  res.redirect("/");
};
