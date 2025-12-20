module.exports = {
  apps: [
    {
      name: "document-verification-system",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        ALLOW_INSECURE_COOKIES: "true", // Enable for HTTP deployments
      },
    },
  ],
}
