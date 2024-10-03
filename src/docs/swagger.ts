import YAML from "yamljs";
import path from "path";

// Define types for Swagger paths and document
interface SwaggerDocument {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
  };
  servers: {
    url: string;
    description: string;
  }[];
  components: {
    securitySchemes: {
      BearerAuth: {
        type: string;
        scheme: string;
        bearerFormat: string;
      };
    };
  };
  paths: Record<string, unknown>;
}

// Load multiple YAML files
const GuestSwaggerDocument: SwaggerDocument = YAML.load(
  path.join(process.cwd(), "./src/docs/guest.yaml")
);
const ExpertSwaggerDocument: SwaggerDocument = YAML.load(
  path.join(process.cwd(), "./src/docs/expert.yaml")
);
const adminSwaggerDocument: SwaggerDocument = YAML.load(
  path.join(process.cwd(), "./src/docs/admin.yaml")
);

// Combine multiple Swagger YAML files
const swaggerDocument: SwaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "AskTrueLink API with JWT Authentication",
    description:
      "This API provides endpoints for authentication, user management, and more.",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  paths: {
    ...GuestSwaggerDocument.paths,
    ...ExpertSwaggerDocument.paths,
    ...adminSwaggerDocument.paths,
  },
};

export default swaggerDocument;
