import Boom from "@hapi/boom";
import { IdSpec, CollectionArraySpec, CollectionSpec, CollectionSpecPlus } from "../models/joi-schemas.js";
import { db } from "../models/db.js";
import { validationError } from "./logger.js";

export const collectionApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const collections = await db.collectionStore.getAllCollections();
        return collections;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: CollectionArraySpec, failAction: validationError },
    description: "Get all collections",
    notes: "Returns all collections",
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request) {
      try {
        const collection = await db.collectionStore.getCollectionById(request.params.id);
        if (!collection) {
          return Boom.notFound("No collection with this id");
        }
        return collection;
      } catch (err) {
        return Boom.serverUnavailable("No collection with this id");
      }
    },
    tags: ["api"],
    description: "Find a collection",
    notes: "Returns a collection",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: CollectionSpecPlus, failAction: validationError },
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const collection = request.payload;
        const newCollection = await db.collectionStore.addCollection(collection);
        if (newCollection) {
          return h.response(newCollection).code(201);
        }
        return Boom.badImplementation("error creating collection");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a collection",
    notes: "Returns the newly created collection",
    validate: { payload: CollectionSpec, failAction: validationError },
    response: { schema: CollectionSpecPlus, failAction: validationError },
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const collection = await db.collectionStore.getCollectionById(request.params.id);
        if (!collection) {
          return Boom.notFound("No collection with this id");
        }
        await db.collectionStore.deleteCollectionById(collection._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No collection with this id");
      }
    },
    tags: ["api"],
    description: "Delete a collection",
    validate: { params: { id: IdSpec }, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.collectionStore.deleteAllCollections();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all CollectionApi",
  },
};
