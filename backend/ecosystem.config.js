module.exports = {
  apps: [
    {
      name: "IVTHAC-Backend",
      script: "dist/app.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3001,
      },
    },
  ],
};
