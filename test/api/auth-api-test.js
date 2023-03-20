import { assert } from "chai";
import { trailmarkService } from "./trailmark-service.js";
import { decodeToken } from "../../src/api/jwt-utils.js";
import { maggie, maggieCredentials } from "../fixtures.js";

suite("Authentication API tests", async () => {
  setup(async () => {
    trailmarkService.clearAuth();
    await trailmarkService.createUser(maggie);
    await trailmarkService.authenticate(maggieCredentials);
    await trailmarkService.deleteAllUsers();
  });

  test("authenticate", async () => {
    const returnedUser = await trailmarkService.createUser(maggie);
    const response = await trailmarkService.authenticate(maggieCredentials);
    assert(response.success);
    assert.isDefined(response.token);
  });

  test("verify Token", async () => {
    const returnedUser = await trailmarkService.createUser(maggie);
    const response = await trailmarkService.authenticate(maggieCredentials);

    const userInfo = decodeToken(response.token);
    assert.equal(userInfo.email, returnedUser.email);
    assert.equal(userInfo.userId, returnedUser._id);
  });

  test("check Unauthorized", async () => {
    trailmarkService.clearAuth();
    try {
      await trailmarkService.deleteAllUsers();
      assert.fail("Route not protected");
    } catch (error) {
      assert.equal(error.response.data.statusCode, 401);
    }
  });
});
