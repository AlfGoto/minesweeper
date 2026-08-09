import { SSMClient, GetParameterCommand } from "@aws-sdk/client-ssm"

const ssm = new SSMClient({})
let cachedWebhookUrl: string | undefined

async function getWebhookUrl(): Promise<string> {
  if (cachedWebhookUrl) return cachedWebhookUrl

  const response = await ssm.send(
    new GetParameterCommand({
      Name: "/minesweeper-bff/discord-webhook-url",
      WithDecryption: true
    })
  )

  cachedWebhookUrl = response.Parameter?.Value
  if (!cachedWebhookUrl) throw new Error("Discord webhook URL not found in SSM")

  return cachedWebhookUrl
}

export async function notifyError(error: unknown): Promise<void> {
  const stage = process.env.STAGE ?? "unknown"
  const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME ?? "unknown"

  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  const embed = {
    title: "Error in Minesweeper API",
    color: 0xff0000,
    fields: [
      { name: "Stage", value: stage, inline: true },
      { name: "Function", value: functionName, inline: true },
      { name: "Error", value: errorMessage.slice(0, 1024) }
    ],
    timestamp: new Date().toISOString()
  }

  if (errorStack) {
    embed.fields.push({
      name: "Stack Trace",
      value: `\`\`\`${errorStack.slice(0, 1000)}\`\`\``
    })
  }

  try {
    const webhookUrl = await getWebhookUrl()
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] })
    })
  } catch (notifyError) {
    console.error("Failed to send Discord notification:", notifyError)
  }
}
