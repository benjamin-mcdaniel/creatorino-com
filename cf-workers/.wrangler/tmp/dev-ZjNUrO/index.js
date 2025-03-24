var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-UQdGba/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// common/utils.js
function createSupabaseClient(env) {
  const SUPABASE_URL = env.SUPABASE_URL || "";
  const SUPABASE_KEY = env.SUPABASE_KEY || "";
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error("Supabase environment variables are not properly configured");
  }
  return {
    auth: {
      getUser: /* @__PURE__ */ __name(async (token) => {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "apikey": SUPABASE_KEY
          }
        });
        if (!response.ok) throw new Error("Failed to get user");
        return response.json();
      }, "getUser")
    },
    from: /* @__PURE__ */ __name((table) => {
      return {
        select: /* @__PURE__ */ __name((columns = "*") => {
          let params = new URLSearchParams();
          if (columns !== "*") params.append("select", columns);
          return {
            eq: /* @__PURE__ */ __name(async (column, value) => {
              params.append(`${column}`, `eq.${value}`);
              const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params.toString()}`, {
                headers: {
                  "apikey": SUPABASE_KEY,
                  "Content-Type": "application/json"
                }
              });
              if (!response.ok) throw new Error(`Failed to query ${table}`);
              return { data: await response.json(), error: null };
            }, "eq"),
            single: /* @__PURE__ */ __name(function() {
              params.append("limit", "1");
              return this;
            }, "single")
          };
        }, "select"),
        update: /* @__PURE__ */ __name((data) => {
          return {
            eq: /* @__PURE__ */ __name(async (column, value) => {
              const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}`, {
                method: "PATCH",
                headers: {
                  "apikey": SUPABASE_KEY,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
              });
              if (!response.ok) throw new Error(`Failed to update ${table}`);
              return { data: await response.json(), error: null };
            }, "eq")
          };
        }, "update"),
        insert: /* @__PURE__ */ __name(async (data) => {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: "POST",
            headers: {
              "apikey": SUPABASE_KEY,
              "Content-Type": "application/json",
              "Prefer": "return=representation"
            },
            body: JSON.stringify(data)
          });
          if (!response.ok) throw new Error(`Failed to insert into ${table}`);
          return { data: await response.json(), error: null };
        }, "insert")
      };
    }, "from"),
    storage: {
      from: /* @__PURE__ */ __name((bucket) => {
        return {
          upload: /* @__PURE__ */ __name(async (path, file) => {
            const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${bucket}/${path}`, {
              method: "POST",
              headers: {
                "apikey": SUPABASE_KEY,
                "Content-Type": file.type
              },
              body: file
            });
            if (!response.ok) throw new Error("Failed to upload file");
            return { data: await response.json(), error: null };
          }, "upload"),
          getPublicUrl: /* @__PURE__ */ __name((path) => {
            return {
              data: {
                publicUrl: `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`
              },
              error: null
            };
          }, "getPublicUrl")
        };
      }, "from")
    }
  };
}
__name(createSupabaseClient, "createSupabaseClient");
async function getUserIdFromToken(request, env) {
  const authHeader = request.headers.get("Authorization");
  let token = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7);
  }
  if (!token) {
    throw new Error("Unauthorized");
  }
  const supabase = createSupabaseClient(env);
  const { data: userData } = await supabase.auth.getUser(token);
  if (!userData?.user) {
    throw new Error("No user found");
  }
  return userData.user.id;
}
__name(getUserIdFromToken, "getUserIdFromToken");
var standardHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*"
};
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: standardHeaders
  });
}
__name(jsonResponse, "jsonResponse");
function errorResponse(message, status = 500) {
  return jsonResponse({ error: message }, status);
}
__name(errorResponse, "errorResponse");

// profile/index.js
async function fetchUserProfile(userId, env) {
  try {
    const supabase = createSupabaseClient(env);
    const existingProfile = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (existingProfile && existingProfile.length > 0) {
      return { data: existingProfile[0], error: null };
    }
    console.log("Creating new profile for user", userId);
    const newProfile = {
      id: userId,
      first_name: "",
      last_name: "",
      nickname: "",
      // You would need the email from auth context
      bio: "",
      avatar_url: "",
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const createdProfile = await supabase.from("profiles").insert([newProfile]);
    return { data: createdProfile[0], error: null };
  } catch (error) {
    console.error("Error with profile:", error.message);
    return { data: null, error };
  }
}
__name(fetchUserProfile, "fetchUserProfile");
async function updateUserProfile(userId, updates, env) {
  try {
    const supabase = createSupabaseClient(env);
    const updatedData = {
      ...updates,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    };
    const result = await supabase.from("profiles").update(updatedData).eq("id", userId);
    return { data: result[0], error: null };
  } catch (error) {
    console.error("Error updating profile:", error.message);
    return { data: null, error };
  }
}
__name(updateUserProfile, "updateUserProfile");
async function handleRequest(request, env, ctx) {
  try {
    const userId = await getUserIdFromToken(request, env);
    if (request.method === "GET") {
      const result = await fetchUserProfile(userId, env);
      return jsonResponse(result);
    } else if (request.method === "PUT") {
      const updates = await request.json();
      const result = await updateUserProfile(userId, updates, env);
      return jsonResponse(result);
    }
    return errorResponse("Method not allowed", 405);
  } catch (error) {
    if (error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }
    return errorResponse(error.message, 500);
  }
}
__name(handleRequest, "handleRequest");

// youtube/index.js
async function handleRequest2(request, env, ctx) {
  try {
    await getUserIdFromToken(request, env);
    return jsonResponse({
      message: "YouTube API module is under development",
      status: "coming soon"
    });
  } catch (error) {
    if (error.message === "Unauthorized") {
      return errorResponse("Unauthorized", 401);
    }
    return errorResponse(error.message, 500);
  }
}
__name(handleRequest2, "handleRequest");

// index.js
async function handleRequest3(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;
  if (request.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400"
      }
    });
  }
  console.log(`Processing ${request.method} request to ${path}`);
  if (path.startsWith("/profile")) {
    return handleRequest(request, env, ctx);
  } else if (path.startsWith("/youtube")) {
    return handleRequest2(request, env, ctx);
  }
  return errorResponse("Not found", 404);
}
__name(handleRequest3, "handleRequest");
var index_default = {
  async fetch(request, env, ctx) {
    return handleRequest3(request, env, ctx);
  }
};

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-UQdGba/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = index_default;

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-UQdGba/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
