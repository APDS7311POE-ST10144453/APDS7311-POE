import { Plugin } from "vite";
import * as dotenv from "dotenv";
import * as path from "path";

export default function checkEnvPlugin(): Plugin {
  return {
    name: "vite-plugin-check-env",
    configResolved() {
      // Load environment variables from .env file
      const envPath = path.resolve(__dirname, ".env");
      dotenv.config({ path: envPath });

      const placeholders = {
        REACT_APP_SWIFT_CODE_VALIDATOR_API_KEY:
          "your_swift_code_validator_api_key",
      };

      const invalidVars: string[] = [];

      for (const [key, placeholder] of Object.entries(placeholders)) {
        if (process.env[key] === placeholder) {
          invalidVars.push(key);
        }
      }

      if (invalidVars.length > 0) {
        console.log(
          "The following environment variables are invalid or placeholders:"
        );
        invalidVars.forEach((key) => {
          console.log(`- ${key}`);
        });

        if (invalidVars.includes("REACT_APP_SWIFT_CODE_VALIDATOR_API_KEY")) {
          console.log(
            "Please set a valid API key for the Swift Code Validator. You can get one from:"
          );
          console.log("https://api-ninjas.com/api/swift-code-lookup");
        }

        process.exit(1); // Exit the application with an error code
      } else {
        console.log("All environment variables are set correctly.");
      }
    },
  };
}
