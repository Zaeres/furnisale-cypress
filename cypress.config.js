const { defineConfig } = require("cypress");

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    baseUrl:'https://du3yfad2ke.eu-central-1.awsapprunner.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
