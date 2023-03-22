import { db } from "../models/db.js";

export const superUserController = {
    index: {
        handler: async function (request, h) {
            const loggedInUser = request.auth.credentials;
            const allUsers = await db.userStore.getAllUsers();
            const allCollections = await db.collectionStore.getAllCollections();
            const allTrails = await db.trailStore.getAllTrails();
            //   const numberOfTrails = await db.trailStore.numberOfTrails();
            //   const numberOfCollections = await db.collectionStore.numberOfCollections();
            //   const numberOfUsers = await db.userStore.numberOfUsers();

            const viewData = {
                title: "SuperUser Dashboard",
                users: allUsers,
                collections: allCollections,
                trails: allTrails,
                // numberOfTrails : numberOfTrails,
                // numberOfCollections : numberOfCollections,
                // numberOfUsers : numberOfUsers,
            };
            //   if (loggedInUser.email === "superuser@trailmark.com") {
            //     return h.view("SuperUser-view", viewData);
            //   }
            // return h.redirect("/dashboard")
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