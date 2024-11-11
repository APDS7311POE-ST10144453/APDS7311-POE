import { Plugin } from "vite";
import * as dotenv from "dotenv";
import * as path from "path";
import { Logger } from "./src/utils/logger";

/**
 * Vite plugin to check for required environment variables.
 * 
 * This plugin loads environment variables from a .env file, checks
 * for specific required variables, and verifies that they have been
 * set to valid values (not placeholders). If any required variables
 * are invalid, an error message is logged, and the process exits.
 *
 * @returns {Plugin} - A Vite plugin that validates environment variables.
 */
export default function checkEnvPlugin(): Plugin {
  const logger = new Logger();
  
  return {
    name: "vite-plugin-check-env",

    // Runs after Vite's config is resolved, checking environment variables
    configResolved(): void {
      const envPath = path.resolve(__dirname, ".env");
      dotenv.config({ path: envPath });

      // Define placeholders for required environment variables
      const placeholders = {
        VITE_SWIFT_CODE_VALIDATOR_API_KEY: "your_swift_code_validator_api_key",
        REACT_APP_ENCRYPTION_KEY: "your_encryption_key"
      };

      const invalidVars: string[] = [];

      // Check if each required environment variable is valid
      for (const [key, placeholder] of Object.entries(placeholders)) {
        if (process.env[key] === placeholder) {
          invalidVars.push(key);
        }
      }

      // Log errors if invalid variables are found and exit process
      if (invalidVars.length > 0) {
        logger.error("The following environment variables are invalid or placeholders:");
        invalidVars.forEach((key) => {
          logger.error(`- ${key}`);
        });

        if (invalidVars.includes("REACT_APP_ENCRYPTION_KEY")) {
          logger.error(
            "Please set a valid encryption key for the application. You can generate one using the following command: node generatecrypto.js in the server directory"
          );
          logger.error("https://api-ninjas.com/api/swiftcode");
        }

        process.exit(1);
      } else {
        logger.info("All environment variables are set correctly.");
      }
    },
  };
}
