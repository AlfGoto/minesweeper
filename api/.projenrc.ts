import { Projalf } from "projalf"
const project = new Projalf({
  cdkVersion: "2.1.0",
  defaultReleaseBranch: "main",
  devDeps: ["projalf", "prettier", "eslint@^8", "@types/aws-lambda"],
  name: "minesweeper-bff",
  projenrcTs: true,

  deps: [
    "dynamodb-toolbox",
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/lib-dynamodb",
    "@aws-sdk/util-dynamodb",

    "@aws-lambda-powertools/logger",
    "@aws-lambda-powertools/tracer",
    "@hono/zod-openapi",
    "@hono/swagger-ui",
    "@middy/core",
    "hono",
    "zod",
    "aws-lambda"
  ]
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
})
project.synth()
