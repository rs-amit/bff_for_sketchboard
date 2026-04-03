import http from "http"
import https from "https"
import { URL } from "url"

export const forwardRequest = (req, targetBase) => {
  return new Promise((resolve, reject) => {

    const targetUrl = new URL(req.originalUrl.replace("/api", ""), targetBase)

    const client = targetUrl.protocol === "https:" ? https : http

    // clone headers
    const headers = { ...req.headers }

    // host header should not be forwarded
    delete headers.host

    let body = null

    if (req.body && req.method !== "GET") {
      body = JSON.stringify(req.body)
      headers["content-type"] = "application/json"
      headers["content-length"] = Buffer.byteLength(body)
    } else {
      delete headers["content-length"]
    }

    const options = {
      protocol: targetUrl.protocol,
      hostname: targetUrl.hostname,
      port: targetUrl.port,
      path: targetUrl.pathname + targetUrl.search,
      method: req.method,
      headers
    }

    const proxyReq = client.request(options, (proxyRes) => {

      const chunks = []

      proxyRes.on("data", (chunk) => chunks.push(chunk))

      proxyRes.on("end", () => {

        const buffer = Buffer.concat(chunks)

        resolve({
          status: proxyRes.statusCode,
          headers: proxyRes.headers,
          data: buffer
        })

      })

    })

    proxyReq.on("error", (err) => {
      reject(err)
    })

    if (body) {
      proxyReq.write(body)
    }

    proxyReq.end()

  })
}