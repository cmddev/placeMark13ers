import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, TrailSpec, TrailSpecPlus, TrailArraySpec } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

export const trailApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const trails = await db.trailStore.getAllTrails();
        return trails;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: TrailArraySpec, failAction: validationError },
    description: "Get all trailApi",
    notes: "Returns all trailApi",
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request) {
      try {
        const trail = await db.trailStore.getTrailById(request.params.id);
        if (!trail) {
          return Boom.notFound("No trail with this id");
        }
        return trail;
      } catch (err) {
        return Boom.serverUnavailable("No trail with this id");
      }
    },
    tags: ["api"],
    description: "Find a Trail",
    notes: "Returns a trail",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: TrailSpecPlus, failAction: validationError },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const trail = await db.trailStore.addTrail(request.params.id, request.payload);
        if (trail) {
          return h.response(trail).code(201);
        }
        return Boom.badImplementation("error creating trail");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a trail",
    notes: "Returns the newly created trail",
    validate: { payload: TrailSpec },
    response: { schema: TrailSpecPlus, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.trailStore.deleteAllTrails();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all trailApi",
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const trail = await db.trailStore.getTrailById(request.params.id);
        if (!trail) {
          return Boom.notFound("No Trail with this id");
        }
        await db.trailStore.deleteTrail(trail._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Trail with this id");
      }
    },
    tags: ["api"],
    description: "Delete a trail",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  uploadImage: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const trail = await  db.trailStore.getTrailById(request.params.id);
        console.log("Returned",trail);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const response = await imageStore.uploadImage(request.payload.imagefile);
          trail.images.push({img : response.url,
            imgid: response.public_id})
          db.trailStore.updateTrail(trail._id, trail);
        }
        return h.response().code(200);
      } catch (err) {
        console.log(err);
        return h.response().code(500);
      }
    },
    tags: ["api"],
    description: "Upload an image",
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },

  deleteImage: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const trail = await db.trailStore.getTrailById(request.params.id);
        await db.imageStore.deleteImage(request.params.imgid);
        console.log("trail",trail.images)
        trail.images = trail.images.filter((value) =>  value.imgid !== request.params.imgid );
        console.log("AH",trail.images)
        db.trailStore.updateTrail(trail._id, trail);
        return h.response().code(200);
      } catch (err) {
        console.log(err);
        return h.response().code(500);
      }
    },
    tags: ["api"],
    description: "Delete an image",
  },
};
