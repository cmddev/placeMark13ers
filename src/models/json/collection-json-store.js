import { v4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { trailJsonStore } from "./trail-json-store.js";

const db = new Low(new JSONFile("./src/models/json/collections.json"));
db.data = { collections: [] };

export const collectionJsonStore = {
  async getAllCollections() {
    await db.read();
    return db.data.collections;
  },

  async addCollection(collection) {
    await db.read();
    collection._id = v4();
    db.data.collections.push(collection);
    await db.write();
    return collection;
  },

  async getCollectionById(id) {
    await db.read();
    let list = db.data.collections.find((collection) => collection._id === id);
    if (list) {
      list.trails = await trailJsonStore.getTrailsByCollectionId(list._id);
    } else {
      list = null;
    }
    return list;
  },

  async getUserCollections(userid) {
    await db.read();
    return db.data.collections.filter((collection) => collection.userid === userid);
  },

  async deleteCollectionById(id) {
    await db.read();
    const index = db.data.collections.findIndex((collection) => collection._id === id);
    if (index !== -1) db.data.collections.splice(index, 1);
    await db.write();
  },

  async deleteAllCollections() {
    db.data.collections = [];
    await db.write();
  },
};
