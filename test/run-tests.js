const assert = require("node:assert/strict");
const fs = require("fs");
const path = require("path");

const { app } = require("../src/app");

const usersFilePath = path.join(__dirname, "..", "src", "data", "users.json");
const recordsFilePath = path.join(__dirname, "..", "src", "data", "records.json");

const originalUsers = fs.readFileSync(usersFilePath, "utf8");
const originalRecords = fs.readFileSync(recordsFilePath, "utf8");

const restoreDataFiles = () => {
  fs.writeFileSync(usersFilePath, originalUsers);
  fs.writeFileSync(recordsFilePath, originalRecords);
};

const runTest = async (name, handler) => {
  try {
    await handler();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  } finally {
    restoreDataFiles();
  }
};

const withServer = async (handler) => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    await handler(port);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
};

const main = async () => {
  await runTest("health route returns API info", async () => {
    await withServer(async (port) => {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.equal(body.auth.seededUsers.admin, "usr_admin_001");
    });
  });

  await runTest("viewer can read records but cannot access dashboard summary", async () => {
    await withServer(async (port) => {
      const recordsResponse = await fetch(`http://127.0.0.1:${port}/records`, {
        headers: {
          "x-user-id": "usr_viewer_001",
        },
      });
      const summaryResponse = await fetch(`http://127.0.0.1:${port}/dashboard/summary`, {
        headers: {
          "x-user-id": "usr_viewer_001",
        },
      });

      assert.equal(recordsResponse.status, 200);
      assert.equal(summaryResponse.status, 403);
    });
  });

  await runTest("analyst can access dashboard summary", async () => {
    await withServer(async (port) => {
      const response = await fetch(`http://127.0.0.1:${port}/dashboard/summary`, {
        headers: {
          "x-user-id": "usr_analyst_001",
        },
      });
      const body = await response.json();

      assert.equal(response.status, 200);
      assert.equal(body.data.totalIncome, 5450);
      assert.equal(body.data.totalExpenses, 1250);
      assert.equal(body.data.netBalance, 4200);
      assert.equal(body.data.recordCount, 4);
      assert.ok(Array.isArray(body.data.categoryTotals));
      assert.ok(Array.isArray(body.data.recentActivity));
      assert.ok(Array.isArray(body.data.monthlyTrends));
    });
  });

  await runTest("records list supports filters pagination and single record lookup", async () => {
    await withServer(async (port) => {
      const listResponse = await fetch(
        `http://127.0.0.1:${port}/records?type=expense&category=rent&page=1&limit=5`,
        {
          headers: {
            "x-user-id": "usr_viewer_001",
          },
        }
      );
      const listBody = await listResponse.json();

      assert.equal(listResponse.status, 200);
      assert.equal(listBody.meta.total, 1);
      assert.equal(listBody.data.length, 1);
      assert.equal(listBody.data[0].id, "rec_002");

      const getResponse = await fetch(`http://127.0.0.1:${port}/records/rec_001`, {
        headers: {
          "x-user-id": "usr_viewer_001",
        },
      });
      const getBody = await getResponse.json();

      assert.equal(getResponse.status, 200);
      assert.equal(getBody.data.category, "salary");
    });
  });

  await runTest("admin can create update and delete a record", async () => {
    await withServer(async (port) => {
      const createResponse = await fetch(`http://127.0.0.1:${port}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "usr_admin_001",
        },
        body: JSON.stringify({
          amount: 2200,
          type: "income",
          category: "bonus",
          date: "2026-04-05",
          note: "Quarterly bonus",
        }),
      });
      const createBody = await createResponse.json();

      assert.equal(createResponse.status, 201);
      assert.equal(createBody.data.category, "bonus");

      const updateResponse = await fetch(
        `http://127.0.0.1:${port}/records/${createBody.data.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "usr_admin_001",
          },
          body: JSON.stringify({
            note: "Quarterly performance bonus",
          }),
        }
      );
      const updateBody = await updateResponse.json();

      assert.equal(updateResponse.status, 200);
      assert.equal(updateBody.data.note, "Quarterly performance bonus");

      const deleteResponse = await fetch(
        `http://127.0.0.1:${port}/records/${createBody.data.id}`,
        {
          method: "DELETE",
          headers: {
            "x-user-id": "usr_admin_001",
          },
        }
      );

      assert.equal(deleteResponse.status, 200);
    });
  });

  await runTest("record validation and auth failures are handled correctly", async () => {
    await withServer(async (port) => {
      const unauthenticatedResponse = await fetch(`http://127.0.0.1:${port}/records`);
      assert.equal(unauthenticatedResponse.status, 401);

      const invalidPayloadResponse = await fetch(`http://127.0.0.1:${port}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "usr_admin_001",
        },
        body: JSON.stringify({
          amount: -20,
          type: "wrong-type",
          category: "",
          date: "not-a-date",
        }),
      });
      const invalidPayloadBody = await invalidPayloadResponse.json();

      assert.equal(invalidPayloadResponse.status, 400);
      assert.ok(invalidPayloadBody.errors.length >= 4);

      const forbiddenResponse = await fetch(`http://127.0.0.1:${port}/records`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "usr_viewer_001",
        },
        body: JSON.stringify({
          amount: 100,
          type: "income",
          category: "misc",
          date: "2026-04-05",
        }),
      });

      assert.equal(forbiddenResponse.status, 403);
    });
  });

  await runTest("admin can create and update a user", async () => {
    await withServer(async (port) => {
      const createResponse = await fetch(`http://127.0.0.1:${port}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "usr_admin_001",
        },
        body: JSON.stringify({
          name: "Nina Kapoor",
          email: "nina@example.com",
          role: "analyst",
          status: "active",
        }),
      });
      const createBody = await createResponse.json();

      assert.equal(createResponse.status, 201);
      assert.equal(createBody.data.email, "nina@example.com");

      const updateResponse = await fetch(
        `http://127.0.0.1:${port}/users/${createBody.data.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "usr_admin_001",
          },
          body: JSON.stringify({
            status: "inactive",
          }),
        }
      );
      const updateBody = await updateResponse.json();

      assert.equal(updateResponse.status, 200);
      assert.equal(updateBody.data.status, "inactive");
    });
  });

  await runTest("user routes enforce uniqueness admin access and inactive user rejection", async () => {
    await withServer(async (port) => {
      const listAsAnalyst = await fetch(`http://127.0.0.1:${port}/users`, {
        headers: {
          "x-user-id": "usr_analyst_001",
        },
      });
      assert.equal(listAsAnalyst.status, 403);

      const duplicateEmailResponse = await fetch(`http://127.0.0.1:${port}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "usr_admin_001",
        },
        body: JSON.stringify({
          name: "Duplicate Admin",
          email: "admin@finance.local",
          role: "viewer",
          status: "active",
        }),
      });
      assert.equal(duplicateEmailResponse.status, 409);

      const createResponse = await fetch(`http://127.0.0.1:${port}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "usr_admin_001",
        },
        body: JSON.stringify({
          name: "Inactive User",
          email: "inactive@example.com",
          role: "viewer",
          status: "inactive",
        }),
      });
      const createBody = await createResponse.json();

      assert.equal(createResponse.status, 201);

      const inactiveAccessResponse = await fetch(`http://127.0.0.1:${port}/records`, {
        headers: {
          "x-user-id": createBody.data.id,
        },
      });

      assert.equal(inactiveAccessResponse.status, 403);
    });
  });

  await runTest("missing routes return 404 json response", async () => {
    await withServer(async (port) => {
      const response = await fetch(`http://127.0.0.1:${port}/missing-route`);
      const body = await response.json();

      assert.equal(response.status, 404);
      assert.equal(body.message, "Route not found");
    });
  });

  if (process.exitCode) {
    process.exit(process.exitCode);
  }
};

main().catch((error) => {
  restoreDataFiles();
  console.error(error);
  process.exit(1);
});
