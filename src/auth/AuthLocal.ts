import { JwtPayload, verify } from "jsonwebtoken";
import { getLogger } from "../utils/logger";
import { AuthUser, IAuthor } from "./IAuthor";

export class AuthLocal implements IAuthor {
  private readonly logger = getLogger(AuthLocal.name);

  constructor(
    private readonly secret: string
    ) {}

  async verifyToken(token: string): Promise<AuthUser> {
    const FUNC_NAME = "verifyToken"
    try {
      const jwtPayload: JwtPayload = <JwtPayload> verify(token, this.secret);
      this.logger.debug(FUNC_NAME, "user token with", { jwtPayload })
      return {
        userId: jwtPayload.id,
        username: jwtPayload.username,
        iat: jwtPayload.iat,
        exp: jwtPayload.exp,
      }
    } catch (error) {
      this.logger.error(FUNC_NAME, error)
    }
    return null;
  }
}
