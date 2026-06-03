import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          // Relax strict settings so test files compile cleanly
          strict: false,
          esModuleInterop: true,
          module: "commonjs",
          moduleResolution: "node",
          baseUrl: ".",
          paths: { "@/*": ["./*"] },
        },
      },
    ],
  },
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  // Explicitly exclude node_modules test files
  testPathIgnorePatterns: ["/node_modules/"],
  // Needed because redux-persist and cookies-next use ESM
  transformIgnorePatterns: ["node_modules/(?!(cookies-next)/)"],
};

export default config;
