import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");
const source = readFileSync(new URL("../src/utils/supabase/middleware.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;

function loadRefreshHelper(claims) {
  let validations = 0;
  const compiledModule = { exports: {} };
  runInNewContext(compiled, {
    exports: compiledModule.exports,
    require(name) {
      if (name === "./config") return { getSupabaseConfig: () => ({ url: "https://example.supabase.co", key: "test-key" }) };
      if (name === "@supabase/ssr") return {
        createServerClient(_url, _key, { cookies }) {
          return { auth: { async getClaims() {
            validations++;
            cookies.setAll([{ name: "refreshed-session", value: "new-token", options: { path: "/", httpOnly: true, sameSite: "lax" } }], { "Cache-Control": "private, no-store", "Expires": "0", "Pragma": "no-cache" });
            return { data: claims ? { claims } : null, error: null };
          } } };
        },
      };
      return require(name);
    },
    URL,
  });
  return { updateSession: compiledModule.exports.updateSession, validations: () => validations };
}

test("validates identity and forwards refreshed cookies to request and response", async () => {
  const helper = loadRefreshHelper({ sub: "verified-user" });
  const request = new NextRequest("https://example.com/schedule");
  const response = await helper.updateSession(request);
  assert.equal(helper.validations(), 1);
  assert.equal(request.cookies.get("refreshed-session").value, "new-token");
  assert.equal(response.cookies.get("refreshed-session").value, "new-token");
  assert.equal(response.cookies.get("refreshed-session").httpOnly, true);
  assert.equal(response.headers.get("location"), null);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
});
test("unauthenticated redirect retains refreshed cookies and anti-cache headers", async () => {
  const helper = loadRefreshHelper(null);
  const response = await helper.updateSession(new NextRequest("https://example.com/schedule"));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://example.com/login");
  assert.equal(response.cookies.get("refreshed-session").value, "new-token");
  for (const [name, expected] of [["cache-control", "private, no-store"], ["expires", "0"], ["pragma", "no-cache"]]) assert.equal(response.headers.get(name), expected);
});
test("login and OAuth callback remain accessible without a session", async () => {
  for (const path of ["/login", "/auth/callback"]) {
    const helper = loadRefreshHelper(null);
    const response = await helper.updateSession(new NextRequest(`https://example.com${path}`));
    assert.equal(response.headers.get("location"), null);
    assert.equal(helper.validations(), 1);
  }
});


test("meetings list also requires a verified session", async () => {
  const helper = loadRefreshHelper(null);
  const response = await helper.updateSession(new NextRequest("https://example.com/meetings"));
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "https://example.com/login");
  assert.equal(helper.validations(), 1);
});
