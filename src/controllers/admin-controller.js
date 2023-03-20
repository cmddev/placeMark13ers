/**
 * Accounts controller handling all User Accounts related actions.
 * @author 
 * @date 
 * @version 
 */
import bcrypt from "bcrypt";
import { db } from "../models/db.js";
import { UserSpec, UserSpecPlus, UserCredentialsSpec } from "../models/joi-schemas.js";


export const accountsController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to TrailMark" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request, h) {
      return h.view("signup-view", { title: "Sign up for TrailMark" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("signup-view", { title: "sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.view("login-view");
    },
  },
  showLogin: {
    auth: false,
    handler: function (request, h) {
      return h.view("login-view", { title: "Login to TrailMark" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("login-view", { title: "Log In Error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const { email, password } = request.payload;
      const user = await db.userStore.getUserByEmail(email);
      console.log("USER - ", user)
      const passwordsMatch = await bcrypt.compare(password, user.password);
        
      if (!user || !passwordsMatch) {
        return h.redirect("/");
      }
      request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    auth: false,
    handler: function (request, h) {
      request.cookieAuth.clear();
      return h.redirect("/");
    },
  },

  async getCurrentUser(request) {
    const loggedInUser = request.auth.credentials;
    return loggedInUser;
  },

  showUserDetails: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const user = await db.userStore.getUserById(loggedInUser._id);
      const viewData = {
        title: "My Account",
        user: user,
      };
      return h.view("my-account-view", viewData);
    },
  },

  updateUserDetails: {
    validate: {
      payload: UserSpecPlus,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("my-account-view", { title: "Error", errors: error.details }).takeover.code(400);
      },
    },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const updatedUser = {
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password: request.payload.password,
      };
      try {
        await db.userStore.updateUser(loggedInUser._id, updatedUser);
      } catch (error) {
        console.log(error);
      }
      return h.view("login-view");
    },
  },

  async validate(request, session) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { valid: false };
    }
    return { valid: true, credentials: user, permissions: user.permission };
  },

  deleteMyAccount: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      let userCrafts = [];
      userCrafts = await db.craftStore.getUserCrafts(loggedInUser._id);
      for (let i = 0; i < userCrafts.length; i += 1) {
        let userSpots = [];
        // eslint-disable-next-line no-await-in-loop
        userSpots = await db.spotStore.getSpotsByCraftId(userCrafts[i]._id);
        for (let j = 0; j < userSpots.length; j += 1) {
          // eslint-disable-next-line no-await-in-loop
          await db.spotStore.deleteSpot(userSpots[j]._id);
        }
        // eslint-disable-next-line no-await-in-loop
        await db.craftStore.deleteCraftById(userCrafts[i]._id);
      }
      await db.userStore.deleteUserById(loggedInUser._id);
      return h.redirect("/");
    },
  },
};