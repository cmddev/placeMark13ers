import axios from "axios";
import { serviceUrl } from "../fixtures.js";

export const trailmarkService = {
  trailmarkUrl: serviceUrl,

  async createUser(user) {
    const res = await axios.post(`${this.trailmarkUrl}/api/users`, user);
    return res.data;
  },

  async getUser(id) {
    const res = await axios.get(`${this.trailmarkUrl}/api/users/${id}`);
    return res.data;
  },

  async getAllUsers() {
    const res = await axios.get(`${this.trailmarkUrl}/api/users`);
    return res.data;
  },

  async deleteAllUsers() {
    const res = await axios.delete(`${this.trailmarkUrl}/api/users`);
    return res.data;
  },

  async createCollection(collection) {
    const res = await axios.post(`${this.trailmarkUrl}/api/collections`, collection);
    return res.data;
  },

  async deleteAllCollections() {
    const response = await axios.delete(`${this.trailmarkUrl}/api/collections`);
    return response.data;
  },

  async deleteCollection(id) {
    const response = await axios.delete(`${this.trailmarkUrl}/api/collections/${id}`);
    return response;
  },

  async getAllCollections() {
    const res = await axios.get(`${this.trailmarkUrl}/api/collections`);
    return res.data;
  },

  async getCollection(id) {
    const res = await axios.get(`${this.trailmarkUrl}/api/collections/${id}`);
    return res.data;
  },

  async getAllTrails() {
    const res = await axios.get(`${this.trailmarkUrl}/api/trails`);
    return res.data;
  },

  async createTrail(id, trail) {
    const res = await axios.post(`${this.trailmarkUrl}/api/collections/${id}/trails`, trail);
    return res.data;
  },

  async deleteAllTrails() {
    const res = await axios.delete(`${this.trailmarkUrl}/api/trails`);
    return res.data;
  },

  async getTrail(id) {
    const res = await axios.get(`${this.trailmarkUrl}/api/trails/${id}`);
    return res.data;
  },

  async deleteTrail(id) {
    const res = await axios.delete(`${this.trailmarkUrl}/api/trails/${id}`);
    return res.data;
  },

  async authenticate(user) {
    const response = await axios.post(`${this.trailmarkUrl}/api/users/authenticate`, user);
    axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.token;
    return response.data;
  },

  async clearAuth() {
    axios.defaults.headers.common["Authorization"] = "";
  }

};
