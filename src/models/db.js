import { userMemStore } from "./mem/user-mem-store.js";
import { collectionMemStore } from "./mem/collection-mem-store.js";
import { trailMemStore } from "./mem/trail-mem-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { collectionJsonStore } from "./json/collection-json-store.js";
import { trailJsonStore } from "./json/trail-json-store.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { collectionMongoStore } from "./mongo/collection-mongo-store.js";
import { trailMongoStore } from "./mongo/trail-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,
  collectionStore: null,
  trailStore: null,

  init(storeType) {
    switch (storeType) {
      case "json" :
        this.userStore = userJsonStore;
        this.collectionStore = collectionJsonStore;
        this.trailStore = trailJsonStore;
        break;
      case "mongo" :
        this.userStore = userMongoStore;
        this.collectionStore = collectionMongoStore;
        this.trailStore = trailMongoStore;
        connectMongo();
        break;
      default :
        this.userStore = userMemStore;
        this.collectionStore = collectionMemStore;
        this.trailStore = trailMemStore;
    }
  }
};
