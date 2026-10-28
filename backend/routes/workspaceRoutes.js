const express = require("express")
const {signInRealWorkspace, signInDemoWorkspace} = require("../controllers/workspaceController.js")
const router = express.Router()

router.post("/login", signInRealWorkspace)

router.post("/demo", signInDemoWorkspace)

module.exports = router;