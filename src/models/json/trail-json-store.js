import { v4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const db = new Low(new JSONFile("./src/models/json/trails.json"));
db.data = { trails: [] };

export const trailJsonStore = {
  async getAllTrailss() {
    await db.read();
    return db.data.trails;
  },

  async addTrail(collectiontId, trail) {
    await db.read();
    trail._id = v4();
    trail.collectiontId = collectiontId;
    db.data.trails.push(trails);
    await db.write();
    return trail;
  },

  async getTrailsByCollectionId(id) {
    await db.read();
    return db.data.trails.filter((trail) => trail.collectiontId === id);
  },

  async getTrailById(id) {
    await db.read();
    return db.data.trails.find((trail) => trail._id === id);
  },

  async deleteTrail(id) {
    await db.read();
    const index = db.data.trails.findIndex((trail) => trail._id === id);
    db.data.trails.splice(index, 1);
    await db.write();
  },

  async deleteAllTrails() {
    db.data.trails = [];
    await db.write();
  },

  async updateTrail(trail, updatedTrail) {
        trail.mountain = updatedTrail.mountain;
        trail.latitude = updatedTrail.latitude;
        trail.longitude = updatedTrail.longitude;
        trail.duration = updatedTrail.duration;
        trail.range = updatedTrail.range;
        trail.category = updatedTrail.category;
        trail.effort = updatedTrail.effort;
    await db.write();
  },
};
