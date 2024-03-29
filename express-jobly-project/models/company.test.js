"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Company = require("./company.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newCompany = {
    handle: "new",
    name: "New",
    description: "New Description",
    numEmployees: 1,
    logoUrl: "http://new.img",
  };

  test("works", async function () {
    let company = await Company.create(newCompany);
    expect(company).toEqual(newCompany);

    const result = await db.query(
          `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'new'`);
    expect(result.rows).toEqual([
      {
        handle: "new",
        name: "New",
        description: "New Description",
        num_employees: 1,
        logo_url: "http://new.img",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Company.create(newCompany);
      await Company.create(newCompany);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let companies = await Company.findAll();
    expect(companies).toEqual([
      {
        handle: "c1",
        name: "C1",
        description: "Desc1",
        num_employees: 1,
        logo_url: "http://c1.img",
      },
      {
        handle: "c2",
        name: "C2",
        description: "Desc2",
        num_employees: 2,
        logo_url: "http://c2.img",
      },
      {
        handle: "c3",
        name: "C3",
        description: "Desc3",
        num_employees: 3,
        logo_url: "http://c3.img",
      },
    ]);
  });
});

/********************************************** findAll ( with name / minEmployees / maxEmployees query filters ) */
describe( 'Testing findAll functionality with name / minEmployees / maxEmployees', ()=> {

  // Test 1 
  test( 'Test 1: Test with partial name', async ()=> {
    const search = {
      "name": "ja"
    }
    const companies = await Company.findAll( search );
    expect( companies.statusCode ).toBe( 200 );
    expect( companies ).toEqual( {
      "companies": [
        {
          "handle": "jackson-sons",
          "name": "Jackson and Sons",
          "num_employees": 649,
          "description": "President couple political sit create.",
          "logo_url": "/logos/logo4.png"
        },
        {
          "handle": "jackson-davila-conley",
          "name": "Jackson, Davila and Conley",
          "num_employees": 813,
          "description": "Consider with build either.",
          "logo_url": "/logos/logo4.png"
        }
      ]
    });
  });

  // Test 2 
  test( 'Test 2: Empty query', async ()=> {
    const search = {};
    const companies = await Company.findAll( search );
    expect( companies.statusCode ).toBe( 200 );
  });

  // Test 3 
  test( 'Test 3: name / minEmployees / maxEmployees', async ()=> {
    const search = {
      "name": "ay",
      "minEmployees": 300,
      "maxEmployees": 950
    }
    const companies = await Company.findAll( search );
    expect( companies.statusCode ).toBe( 200 );
    expect( companies ).toEqual( {
      "companies": [
        {
          "handle": "ayala-buchanan",
          "name": "Ayala-Buchanan",
          "num_employees": 309,
          "description": "Make radio physical southern. His white on attention kitchen market upon. Represent west open seven. Particularly subject billion much score thank bag somebody.",
          "logo_url": null
        }
      ]
    });
  });

});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let company = await Company.get("c1");
    expect(company).toEqual({
      handle: "c1",
      name: "C1",
      description: "Desc1",
      numEmployees: 1,
      logoUrl: "http://c1.img",
    });
  });

  test("not found if no such company", async function () {
    try {
      await Company.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    name: "New",
    description: "New Description",
    numEmployees: 10,
    logoUrl: "http://new.img",
  };

  test("works", async function () {
    let company = await Company.update("c1", updateData);
    expect(company).toEqual({
      handle: "c1",
      ...updateData,
    });

    const result = await db.query(
          `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'c1'`);
    expect(result.rows).toEqual([{
      handle: "c1",
      name: "New",
      description: "New Description",
      num_employees: 10,
      logo_url: "http://new.img",
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      name: "New",
      description: "New Description",
      numEmployees: null,
      logoUrl: null,
    };

    let company = await Company.update("c1", updateDataSetNulls);
    expect(company).toEqual({
      handle: "c1",
      ...updateDataSetNulls,
    });

    const result = await db.query(
          `SELECT handle, name, description, num_employees, logo_url
           FROM companies
           WHERE handle = 'c1'`);
    expect(result.rows).toEqual([{
      handle: "c1",
      name: "New",
      description: "New Description",
      num_employees: null,
      logo_url: null,
    }]);
  });

  test("not found if no such company", async function () {
    try {
      await Company.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Company.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Company.remove("c1");
    const res = await db.query(
        "SELECT handle FROM companies WHERE handle='c1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such company", async function () {
    try {
      await Company.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
