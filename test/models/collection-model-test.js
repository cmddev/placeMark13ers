import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCollections, mozart } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Collection Model tests", () => {

  setup(async () => {
    db.init("mongo");
    await db.collectionStore.deleteAllCollections();
    for (let i = 0; i < testCollections.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testCollections[i] = await db.collectionStore.addCollection(testCollections[i]);
    }
  });

  test("create a collection", async () => {
    const collection = await db.collectionStore.addCollection(mozart);
    assertSubset(mozart, collection);
    assert.isDefined(collection._id);
  });

  test("delete all collections", async () => {
    let returnedCollections = await db.collectionStore.getAllCollections();
    assert.equal(returnedCollections.length, 3);
    await db.collectionStore.deleteAllCollections();
    returnedCollections = await db.collectionStore.getAllCollections();
    assert.equal(returnedCollections.length, 0);
  });

  test("get a collection - success", async () => {
    const collection = await db.collectionStore.addCollection(mozart);
    const returnedCollection = await db.collectionStore.getCollectionById(collection._id);
    assertSubset(mozart, collection);
  });

  test("delete One collection - success", async () => {
    const id = testCollections[0]._id;
    await db.collectionStore.deleteCollectionById(id);
    const returnedCollections = await db.collectionStore.getAllCollections();
    assert.equal(returnedCollections.length, testCollections.length - 1);
    const deletedCollection = await db.collectionStore.getCollectionById(id);
    assert.isNull(deletedCollection);
  });

  test("get a collection - bad params", async () => {
    assert.isNull(await db.collectionStore.getCollectionById(""));
    assert.isNull(await db.collectionStore.getCollectionById());
  });

  test("delete One collection - fail", async () => {
    await db.collectionStore.deleteCollectionById("bad-id");
    const allCollections = await db.collectionStore.getAllCollections();
    assert.equal(testCollections.length, allCollections.length);
  });
});
