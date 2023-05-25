/**
 * Trail Controller within the application
 * @Author: Caroline Daly
 */

import { TrailSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const trailController = {
  index: {
    handler: async function (request, h) {
      const collection = await db.collectionStore.getCollectionById(request.params.id);
      const trail = await db.trailStore.getTrailById(request.params.trailid);
      const viewData = {
        title: "Edit Song",
        collection: collection,
        trail: trail,
      };
      return h.view("trail-view", viewData);
    },
  },

  update: {
    validate: {
      payload: TrailSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("trail-view", { title: "Edit trail error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const trailId = request.params.trailid;
      const collectionId = request.params.id;
      const collection = await db.collectionStore.getCollectionById(collectionId);
      const trail = await db.trailStore.getTrailById(trailId);
      console.log(request.payload);
      // const trail = await db.trailStore.getTrailById(request.params.trailid);
      const newTrail = {
        mountain: request.payload.mountain,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        duration: Number(request.payload.duration),
        range: request.payload.range,
        category: request.payload.category,
        effort: request.payload.effort,
      };
      await db.trailStore.updateTrail(trail, newTrail);
      // await db.trailStore.updateTrail(request.params.trailid, newTrail);
      return h.redirect(`/collection/${request.params.id}`);
    },
  }
};
