import { CodegenConfig } from "@graphql-codegen/cli";

// @TODO I think there's a chance to improve this by creating a codegen config based on storefront-kit's codegen, and allow it to extend or merge or something here
// That way, custom scalars like 'url' are better typed
const config: CodegenConfig = {
  schema: "node_modules/@shopify/storefront-kit-react/storefront.schema.json",
  documents: ["pages/**/*.tsx"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./gql/": {
      preset: "client",
      plugins: [],
    },
  },
};

export default config;
