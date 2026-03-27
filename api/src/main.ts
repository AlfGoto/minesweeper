import * as cdk from "aws-cdk-lib"
import { MinesweeperBff } from "./minesweeper-bff"

const env = {
  account: process.env.CDK_DEPLOY_ACCOUNT ?? process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEPLOY_REGION ?? process.env.CDK_DEFAULT_REGION
}

const app = new cdk.App()

const serviceName = "minesweeper-bff"

const stage = app.node.tryGetContext("stage") as string | undefined
if (!stage) {
  throw new Error("Missing context: stage")
}

new MinesweeperBff(app, `${stage}-${serviceName}`, { env, stage, serviceName })

app.synth()
