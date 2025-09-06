namespace NodeJS {
    interface ProcessEnv {
        // Application
        PORT: number

        // Database
        DB_HOST: string
        DB_PORT: number
        DB_NAME: string
        DB_USERNAME: string
        DB_PASSWORD: string

    }
}