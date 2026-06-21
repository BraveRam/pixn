import coreWebVitals from "eslint-config-next/core-web-vitals";
import tsConfig from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...tsConfig,
  {
    // Vendored shadcn/magicui file-upload primitive. The React Compiler
    // `immutability` rule flags necessary DOM file-injection (`input.files = ...`)
    // and a forward reference that are correct in this third-party component.
    // Keep them visible as warnings instead of editing vendored code.
    files: ["components/ui/**"],
    rules: {
      "react-hooks/immutability": "warn",
    },
  },
];

export default eslintConfig;
