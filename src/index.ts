import express from "express"
import {application} from "./config/constants"

const app = express()

app.listen(application.port, () => console.log(`The server is running on port ${application.port}`))
