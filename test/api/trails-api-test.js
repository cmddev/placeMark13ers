import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { trailmarkService } from "./trailmark-service.js";
import { maggie, mozart, maggieCredentials, testCollections, testTrails, concerto } from "../fixtures.js";

suite("Trail API tests", () => {
  let user = null;
  let beethovenSonatas = null;

  setup(async () => {
    trailmarkService.clearAuth();
    user = await trailmarkService.createUser(maggie);
    await trailmarkService.authenticate(maggieCredentials);
    await trailmarkService.deleteAllCollections();
    await trailmarkService.deleteAllTrails();
    await trailmarkService.deleteAllUsers();
    user = await trailmarkService.createUser(maggie);
    await trailmarkService.authenticate(maggieCredentials);
    mozart.userid = user._id;
    beethovenSonatas = await trailmarkService.createCollection(mozart);
  });

  teardown(async () => {});

  test("create trail", async () => {
    const returnedTrail = await trailmarkService.createTrail(beethovenSonatas._id, concerto);
    assertSubset(concerto, returnedTrail);
  });

  test("create Multiple trails", async () => {
    for (let i = 0; i < testTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await trailmarkService.getAllTrails(beethovenSonatas._id, testTrails[i]);
    }
    const returnedTrails = await trailmarkService.getAllTrails();
    assert.equal(returnedTrails.length, testTrails.length);
    for (let i = 0; i < returnedTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const trail = await trailmarkService.getTrail(returnedTrails[i]._id);
      assertSubset(trail, returnedTrails[i]);
    }
  });

  test("Delete TrailApi", async () => {
    for (let i = 0; i < testTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await trailmarkService.createTrail(beethovenSonatas._id, testTrails[i]);
    }
    let returnedTrails = await trailmarkService.getAllTrails();
    assert.equal(returnedTrails.length, testTrails.length);
    for (let i = 0; i < returnedTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const trail = await trailmarkService.deleteTrail(returnedTrails[i]._id);
    }
    returnedTrails = await trailmarkService.getAllTrails();
    assert.equal(returnedTrails.length, 0);
  });

  test("denormalised collection", async () => {
    for (let i = 0; i < testTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await trailmarkService.createTrail(beethovenSonatas._id, testTrails[i]);
    }
    const returnedCollection = await trailmarkService.getCollection(beethovenSonatas._id);
    assert.equal(returnedCollection.trails.length, testTrails.length);
    for (let i = 0; i < testTrails.length; i += 1) {
      assertSubset(testTrails[i], returnedCollection.trails[i]);
    }
  });
});
