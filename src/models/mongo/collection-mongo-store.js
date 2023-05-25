import { Collection } from "./collection.js";
import { trailMongoStore } from "./trail-mongo-store.js";

export const collectionMongoStore = {
  async getAllCollections() {
    const collections = await Collection.find().lean();
    return collections;
  },

  async getCollectionById(id) {
    if (id) {
      const collection = await Collection.findOne({ _id: id }).lean();
      if (collection) {
        collection.trails = await trailMongoStore.getTrailsByCollectionId(collection._id);
      }
      return collection;
    }
    return null;
  },

  async addCollection(collection) {
    const newCollection = new Collection(collection);
    const collectionObj = await newCollection.save();
    return this.getCollectionById(collectionObj._id);
  },

  async getUserCollections(id) {
    const collection = await Collection.find({ userid: id }).lean();
    return collection;
  },

  async deleteCollectionById(id) {
    try {
      await Collection.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllCollections() {
    await Collection.deleteMany({});
  },

  async updateCollection(updatedCollection) {
    const collection = await Collection.findOne({ _id: updatedCollection._id });
    collection.title = updatedCollection.title;
    collection.img = updatedCollection.img;
    collection.imgid = updatedCollection.imgid;
    await collection.save();
  },

};
