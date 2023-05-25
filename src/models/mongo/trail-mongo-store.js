import { Trail } from "./trail.js";
import { Collection } from "./collection.js";

export const trailMongoStore = {
  async getAllTrails() {
    const trails = await Trail.find().lean();
    return trails;
  },

  async addTrail(collectionId, trail) {
    trail.collectionid = collectionId;
    const newTrail = new Trail(trail);
    const trailObj = await newTrail.save();
    return this.getTrailById(trailObj._id);
  },

  async getTrailsByCollectionId(id) {
    const trails = await Trail.find({ collectionid: id }).lean();
    return trails;
  },

  async getTrailById(id) {
    if (id) {
      const trail = await Trail.findOne({ _id: id }).lean();
      return trail;
    }
    return null;
  },

  async deleteTrail(id) {
    try {
      await Trail.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllTrails() {
    await Trail.deleteMany({});
  },

  async updateTrail(trail, updatedTrail) {
    const trailDoc = await Trail.findOne({ _id: trail._id });
    trailDoc.mountain = updatedTrail.mountain;
    trailDoc.latitude = updatedTrail.latitude;
    trailDoc.longitude = updatedTrail.longitude;
    trailDoc.duration = updatedTrail.duration;
    trailDoc.range = updatedTrail.range;
    trailDoc.category = updatedTrail.category;
    trailDoc.effort = updatedTrail.effort;
    trailDoc.images = updatedTrail.images;
    await trailDoc.save();
  },
};
