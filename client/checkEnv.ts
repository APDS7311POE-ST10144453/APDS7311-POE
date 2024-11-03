import { Plugin } from "vite";
import * as dotenv from "dotenv";
import * as path from "path";
import { Logger } from "./utils/logger";

export default function checkEnvPlugin(): Plugin {
  const logger = new Logger();
  
  return {
    name: "vite-plugin-check-env",
    configResolved(): void {
      const envPath = path.resolve(__dirname, ".env");
      dotenv.config({ path: envPath });

      const placeholders = {
        VITE_SWIFT_CODE_VALIDATOR_API_KEY: "your_swift_code_validator_api_key",
      };

      const invalidVars: string[] = [];

      for (const [key, placeholder] of Object.entries(placeholders)) {
        if (process.env[key] === placeholder) {
          invalidVars.push(key);
        }
      }

      if (invalidVars.length > 0) {
        logger.error("The following environment variables are invalid or placeholders:");
        invalidVars.forEach((key) => {
          logger.error(`- ${key}`);
        });

        if (invalidVars.includes("REACT_APP_SWIFT_CODE_VALIDATOR_API_KEY")) {
          logger.error(
            "Please set a valid API key for the Swift Code Validator. You can get one from:"
          );
          logger.error("https://api-ninjas.com/api/swift-code-lookup");
        }

        process.exit(1);
      } else {
        logger.info("All environment variables are set correctly.");
      }
    },
  };
}
