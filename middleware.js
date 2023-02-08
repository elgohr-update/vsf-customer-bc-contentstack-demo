const { createServer } = require("@vue-storefront/middleware");
const { integrations } = require("./middleware.config");
const cors = require("cors");

const buildApp = async (config) => {
  const CORS_MIDDLEWARE_NAME = "corsMiddleware";

  const app = await createServer(config);

  const corsMiddleware = app._router.stack.find(
    (middleware) => middleware.name === CORS_MIDDLEWARE_NAME
  );

  corsMiddleware.handle = cors({
    origin: [
      "http://localhost:3000",
      ...(process.env.MIDDLEWARE_ALLOWED_ORIGINS?.split(",") ?? []),
    ],
    credentials: true,
  });

  return app;
};

if (process.env.NODE_ENV !== "test") {
  (async () => {
    const app = await buildApp({ integrations });
    const host = process.argv[2] ?? "0.0.0.0";
    const port = process.argv[3] ?? 8181;

    app.listen(port, host, () => {
      console.log(`Middleware started on ${host}:${port}`);
    });
  })();
}

module.exports = buildApp;
