const validEnv = () => {
    const required = ["FRONTEND_URL", "JWT_SECRET", "MONGO_URI"]
    
    const missing = required.filter(key => !process.env[key])

    if (missing.length > 0) {
        console.error(`Missing required environment variables: ${missing.join(", ")}`)
        process.exit(1)
    }
}

module.exports = validEnv