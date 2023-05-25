import { userApi } from "./api/user-api.js";
import { collectionApi } from "./api/collection-api.js";
import { trailApi } from "./api/trail-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

  { method: "POST", path: "/api/collections", config: collectionApi.create },
  { method: "DELETE", path: "/api/collections", config: collectionApi.deleteAll },
  { method: "GET", path: "/api/collections", config: collectionApi.find },
  { method: "GET", path: "/api/collections/{id}", config: collectionApi.findOne },
  { method: "DELETE", path: "/api/collections/{id}", config: collectionApi.deleteOne },

  { method: "GET", path: "/api/trails", config: trailApi.find },
  { method: "GET", path: "/api/trails/{id}", config: trailApi.findOne },
  { method: "POST", path: "/api/collections/{id}/trails", config: trailApi.create },
  { method: "DELETE", path: "/api/trails", config: trailApi.deleteAll },
  { method: "DELETE", path: "/api/trails/{id}", config: trailApi.deleteOne },
  { method: "POST", path: "/api/trails/{id}/uploadimage", config: trailApi.uploadImage },
  { method: "DELETE", path: "/api/trails/{id}/deleteimage/{imgid}", config: trailApi.deleteImage },

  { method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },
];
