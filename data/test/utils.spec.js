import assert from "node:assert/strict";
import { test } from "node:test";
import { takef } from "../src/utils.ts";

test("takef", (t) => {
  assert.deepEqual(
    takef([1, 2, 3, 4, 5], (x) => x > 2),
    [3, 4, 5],
  );
  assert.deepEqual(
    takef([1, 2, 3, 4, 5], (x) => x > 10),
    [],
  );
  assert.deepEqual(
    takef([1, 2, 3, 2, 1], (x) => x > 2),
    [3, 2, 1],
  );
  assert.deepEqual(
    takef([1, 2, 3, 4, 5], (x) => x > 0),
    [1, 2, 3, 4, 5],
  );
  assert.deepEqual(
    takef([], (x) => true),
    [],
  );
});
