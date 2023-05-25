/**
 * Collection Controller within the application
 * @Author: Caroline Daly
 */

import { TrailSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";

export const collectionController = {
  index: {
    handler: async function (request, h) {
      const collection = await db.collectionStore.getCollectionById(request.params.id);
      const viewData = {
        title: "Collection",
        collection: collection,
      };
      return h.view("collection-view", viewData);
    },
  },

  addTrail: {
    validate: {
      payload: TrailSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        return h.view("collection-view", { title: "Add Trail error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const collection = await db.collectionStore.getCollectionById(request.params.id);
      const newTrail = {
        // title: request.payload.title,
        // artist: request.payload.artist,
        // duration: Number(request.payload.duration),
        mountain: request.payload.mountain,
        latitude: Number(request.payload.latitude),
        longitude: Number(request.payload.longitude),
        duration: Number(request.payload.duration),
        range: request.payload.range,
        category: request.payload.category,
        effort: request.payload.effort,
      };
      await db.trailStore.addTrail(collection._id, newTrail);
      return h.redirect(`/collection/${collection._id}`);
    },
  },

  deleteTrail: {
    handler: async function (request, h) {
      const collection = await db.collectionStore.getCollectionById(request.params.id);
      await db.trailStore.deleteTrail(request.params.trailid);
      return h.redirect(`/collection/${collection._id}`);
    },
  },

  uploadImage: {
    handler: async function(request, h) {
      try {
        const collection = await db.collectionStore.getCollectionById(request.params.id);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          collection.img = url;
          db.collectionStore.updateCollection(collection);
        }
        return h.redirect(`/collection/${collection._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/collection/${collection._id}`);
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true
    }
  },

  deleteImage: {
    handler: async function( request, h) {
      const collection = await db.collectionStore.getCollectionById(request.params.id);
      await db.imageStore.deleteImage(collection.imgid);
      collection.img = undefined;
    }
  }
};
