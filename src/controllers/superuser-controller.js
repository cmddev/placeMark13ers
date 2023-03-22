/**
 * Controller for Super User Admin Rights within the application
 * @Author: Caroline Daly
 */

import { db } from "../models/db.js";

export const superUserController = {
    index: {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            const allUsers = await db.userStore.getAllUsers();
            const allCollections = await db.collectionStore.getAllCollections();
            const allTrails = await db.trailStore.getAllTrails();
            const viewData = {
                title: "SuperUser Dashboard",
                users: allUsers,
                collections: allCollections,
                trails: allTrails,
            };
            return h.view("SuperUser-view", viewData);
        },
    },
    deleteUser: {
        handler: async function (request, h) {
            const user = await db.userStore.getUserbyId(request.params.id);
            await db.userStore.deleteUserById(user._id);
            return h.redirect("/superuser-view");
        },
    },
};