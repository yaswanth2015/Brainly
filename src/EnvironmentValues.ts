import * as dotenv from "dotenv"

export class EnvironmentVariables {
    private static readonly sharedInstance: EnvironmentVariables = new EnvironmentVariables()
    private readonly mongoURL: string;
    private readonly jwtSecretKey: string;

    private constructor() {
        dotenv.config()
        this.mongoURL = process.env.MONGO_URL as string
        this.jwtSecretKey = process.env.JWT_SECRET_KEY as string
    }

    public static getSharedInstance(): EnvironmentVariables {
        return EnvironmentVariables.sharedInstance
    }

    public getMongoUrl(): string {
        return this.mongoURL
    }

    public getJWTSecretKey(): string {
        return this.jwtSecretKey
    }
}