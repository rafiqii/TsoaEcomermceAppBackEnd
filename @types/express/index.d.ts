import userPayload from "../../TS/Interfaces/requestuser"

declare global{
    namespace Express {
        interface Request {
            user: userPayload
        }
    }
}
