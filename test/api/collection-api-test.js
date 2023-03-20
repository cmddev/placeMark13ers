import { EventEmitter } from "events";
import { assert } from "chai";
import { trailmarkService } from "./trailmark-service.js";
import { assertSubset } from "../test-utils.js";
import { maggie, maggieCredentials, mozart, testCollections } from "../fixtures.js";

EventEmitter.setMaxListeners(25);

suite("Collection API tests", () => {
  let user = null;

  setup(async () => {
    trailmarkService.clearAuth();
    user = await trailmarkService.createUser(maggie);
    await trailmarkService.authenticate(maggieCredentials);
    await trailmarkService.deleteAllCollections();
    await trailmarkService.deleteAllUsers();
    user = await trailmarkService.createUser(maggie);
    await trailmarkService.authenticate(maggieCredentials);
    mozart.userid = user._id;
  });

  teardown(async () => {});

  test("create collection", async () => {
    const returnedCollection = await trailmarkService.createCollection(mozart);
    assert.isNotNull(returnedCollection);
    assertSubset(mozart, returnedCollection);
  });

  test("delete a collection", async () => {
    const collection = await trailmarkService.createCollection(mozart);
    const response = await trailmarkService.deleteCollection(collection._id);
    assert.equal(response.status, 204);
    try {
      const returnedCollection = await trailmarkService.getCollection(collection.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No collection with this id", "Incorrect Response Message");
    }
  });

  test("create multiple collections", async () => {
    for (let i = 0; i < testCollections.length; i += 1) {
      testCollections[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await trailmarkService.createCollection(testCollections[i]);
    }
    let returnedLists = await trailmarkService.getAllCollections();
    assert.equal(returnedLists.length, testCollections.length);
    await trailmarkService.deleteAllCollections();
    returnedLists = await trailmarkService.getAllCollections();
    assert.equal(returnedLists.length, 0);
  });

  test("remove non-existant collection", async () => {
    try {
      const response = await trailmarkService.deleteCollection("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No collection with this id", "Incorrect Response Message");
    }
  });
});
