// jobRoutes.test.js

const request = require("supertest");

const db = require("../db");
const app = require("../app");
const Job = require("../models/job");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "Test Job",
        salary: 80000,
        equity: 0.01,
        companyHandle: "c1",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "Test Job",
        salary: 80000,
        equity: 0.01,
        companyHandle: "c1",
      },
    });
  });

  test("unauth for non-admin", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "Test Job",
        salary: 80000,
        equity: 0.01,
        companyHandle: "c1",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request if missing data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "Test Job",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
  test("works for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Job1",
          salary: 80000,
          equity: 0.01,
          companyHandle: "c1",
        },
        {
          id: expect.any(Number),
          title: "Job2",
          salary: 90000,
          equity: 0.02,
          companyHandle: "c2",
        },
        {
          id: expect.any(Number),
          title: "Job3",
          salary: 100000,
          equity: 0.03,
          companyHandle: "c3",
        },
      ],
    });
  });

  test("works: filtering by title, minSalary, and hasEquity", async function () {
    const resp = await request(app).get("/jobs").query({
      title: "job",
      minSalary: 90000,
      hasEquity: true,
    });
    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Job2",
          salary: 90000,
          equity: 0.02,
          companyHandle: "c2",
        },
        {
          id: expect.any(Number),
          title: "Job3",
          salary: 100000,
          equity: 0.03,
          companyHandle: "c3",
        },
      ],
    });
  });

  test("works: no filtering", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Job1",
          salary: 80000,
          equity: 0.01,
          companyHandle: "c1",
        },
        {
          id: expect.any(Number),
          title: "Job2",
          salary: 90000,
          equity: 0.02,
          companyHandle: "c2",
        },
        {
          id: expect.any(Number),
          title: "Job3",
          salary: 100000,
          equity: 0.03,
          companyHandle: "c3",
        },
      ],
    });
  });
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  test("works for anon", async function () {
    const job = await Job.create({
      title: "Test Job",
      salary: 80000,
      equity: 0.01,
      companyHandle: "c1",
    });
    const resp = await request(app).get(`/jobs/${job.id}`);
    expect(resp.body).toEqual({
      job: {
        id: job.id,
        title: "Test Job",
        salary: 80000,
        equity: 0.01,
        companyHandle: "c1",
      },
    });
  });

  test("not found for no such job", async function () {
    const resp = await request(app).get("/jobs/0");
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
  test("works for admin", async function () {
    const job = await Job.create({
      title: "Test Job",
      salary: 80000,
      equity: 0.01,
      companyHandle: "c1",
    });
    const resp = await request(app)
      .patch(`/jobs/${job.id}`)
      .send({ title: "New Job Title" })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      job: {
        id: job.id,
        title: "New Job Title",
        salary: 80000,
        equity: 0.01,
        companyHandle: "c1",
      },
    });
  });

  test("unauth for non-admin", async function () {
    const job = await Job.create({
      title: "Test Job",
      salary: 80000,
      equity: 0.01,
      companyHandle: "c1",
    });
    const resp = await request(app)
      .patch(`/jobs/${job.id}`)
      .send({ title: "New Job Title" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such job", async function () {
    const resp = await request(app)
      .patch("/jobs/0")
      .send({ title: "New Job Title" })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request if no data", async function () {
    const job = await Job.create({
      title: "Test Job",
      salary: 80000,
      equity: 0.01,
      companyHandle: "c1",
    },);
  });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
test("works for admin", async function () {
  const job = await Job.create({
    title: "Test Job",
    salary: 80000,
    equity: 0.01,
    companyHandle: "c1",
  });

  const resp = await request(app)
    .delete(`/jobs/${job.id}`)
    .set("authorization", `Bearer ${adminToken}`);
  
  expect(resp.body).toEqual({ deleted: job.id });
});

test("unauth for non-admin", async function () {
  const job = await Job.create({
    title: "Test Job",
    salary: 80000,
    equity: 0.01,
    companyHandle: "c1",
  });

  const resp = await request(app)
    .delete(`/jobs/${job.id}`)
    .set("authorization", `Bearer ${u1Token}`);
  
  expect(resp.statusCode).toEqual(401);
});

test("not found for no such job", async function () {
  const resp = await request(app)
    .delete("/jobs/0")
    .set("authorization", `Bearer ${adminToken}`);
  
  expect(resp.statusCode).toEqual(404);
});
});
