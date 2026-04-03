import express from "express"
import { services } from "../config/services.js"
import { forwardRequest } from "../gateway/forwardRequest.js"
import { asyncHandler } from "../utils/asynchandler.js"

const router = express.Router()

router.post(
  "/signup",
  asyncHandler(async (req, res) => {

    console.log("-------1")

    const response = await forwardRequest(req, services.authService)

    Object.entries(response.headers || {}).forEach(([key, value]) => {
      res.setHeader(key, value)
    })

    res.status(response.status).send(response.data)

  })
)

export default router