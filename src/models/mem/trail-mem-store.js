import { v4 } from "uuid";

let trails = [];

export const trailMemStore = {
  async getAllTrailss() {
    return trails;
  },

  async addTrail(collectionId, trail) {
    trail._id = v4();
    trail.collectionId = collectionId;
    trails.push(trail);
    return trail;
  },

  async getTrailssByCollectionId(id) {
    return trails.filter((trail) => trail.collectionId === id);
  },

  async getTrailById(id) {
    let trail = trails.find((trail) => trail._id === id);
    if (trail == undefined) {
      trail = null;
    }
    return trail;
  },

  async getCollectionTrails(collectionId) {
    return trails.filter((trail) => trail.collectionId === collectionId);
  },

  async deleteTrail(id) {
    const index = trails.findIndex((trail) => trail._id === id);
    if (index !== -1) trails.splice(index, 1);
  },

  async deleteAllTrailss() {
    trails = [];
  },

  async updateTrail(trail, updatedTrail) {
    trail.mountain = updatedTrail.mountain;
    trail.latitude = updatedTrail.latitude;
    trail.longitude = updatedTrail.longitude;
    trail.duration = updatedTrail.duration;
    trail.range = updatedTrail.range;
    trail.category = updatedTrail.category;
    trail.effort = updatedTrail.effort;
  },
};
