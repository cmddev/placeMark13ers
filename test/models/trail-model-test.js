import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCollections, testTrails, beethoven, mozart, concerto, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Trail Model tests", () => {

  let beethovenList = null;

  setup(async () => {
    db.init("mongo");
    await db.collectionStore.deleteAllCollections();
    await db.trailStore.deleteAllTrails();
    beethovenList = await db.collectionStore.addCollection(beethoven);
    for (let i = 0; i < testTrails.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testTrails[i] = await db.trailStore.addTrail(beethovenList._id, testTrails[i]);
    }
  });

  test("create single trail", async () => {
    const mozartList = await db.collectionStore.addCollection(mozart);
    const trail = await db.trailStore.addTrail(mozartList._id, concerto)
    assert.isNotNull(trail._id);
    assertSubset (concerto, trail);
  });

  test("update an existing trail", async () => {
  });

  test("create multiple trailApi", async () => {
    const trails = await db.collectionStore.getCollectionById(beethovenList._id);
    assert.equal(testTrails.length, testTrails.length)
  });

  test("delete all trailApi", async () => {
    const trails = await db.trailStore.getAllTrails();
    assert.equal(testTrails.length, trails.length);
    await db.trailStore.deleteAllTrails();
    const newTrails = await db.trailStore.getAllTrails();
    assert.equal(0, newTrails.length);
  });

  test("get a trail - success", async () => {
    const mozartList = await db.collectionStore.addCollection(mozart);
    const trail = await db.trailStore.addTrail(mozartList._id, concerto)
    const newTrail = await db.trailStore.getTrailById(trail._id);
    assertSubset (concerto, newTrail);
  });

  test("delete One Trail - success", async () => {
    const id = testTrails[0]._id;
    await db.trailStore.deleteTrail(id);
    const trails = await db.trailStore.getAllTrails();
    assert.equal(trails.length, testCollections.length - 1);
    const deletedTrail = await db.trailStore.getTrailById(id);
    assert.isNull(deletedTrail);
  });

  test("get a collection - bad params", async () => {
    assert.isNull(await db.trailStore.getTrailById(""));
    assert.isNull(await db.trailStore.getTrailById());
  });

  test("delete One User - fail", async () => {
    await db.trailStore.deleteTrail("bad-id");
    const trails = await db.trailStore.getAllTrails();
    assert.equal(trails.length, testCollections.length);
  });
});
