export async function POST() {
  const esp32IP = process.env.NEXT_PUBLIC_ESP32_IP

  console.log("[v0] Feed API called")
  console.log("[v0] ESP32 IP from env:", esp32IP)

  if (!esp32IP) {
    console.log("[v0] ESP32 IP not configured!")
    return Response.json({ error: "ESP32 IP not configured" }, { status: 500 })
  }

  try {
    const feedUrl = `http://${esp32IP}/feed`
    console.log("[v0] Making GET request to:", feedUrl)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(feedUrl, {
      method: "GET",
      signal: controller.signal,
    })

    clearTimeout(timeout)
    console.log("[v0] ESP32 responded with status:", response.status)

    if (!response.ok) {
      throw new Error(`ESP32 returned status ${response.status}`)
    }

    const text = await response.text()
    console.log("[v0] ESP32 Response text:", text)

    let data
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text, status: "success" }
    }

    console.log("[v0] Parsed response:", data)
    return Response.json(data)
  } catch (error: any) {
    console.error("[v0] ESP32 Error:", error?.message)
    return Response.json({ error: "Failed to communicate with ESP32", details: error?.message }, { status: 500 })
  }
}
