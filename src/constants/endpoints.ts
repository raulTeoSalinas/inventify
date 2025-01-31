const ENDPOINTS = {
  production: {
    data: "https://inventify-directus-329104956989.us-south1.run.app/graphql",
    system: "https://inventify-directus-329104956989.us-south1.run.app/graphql/system",
    assets: "https://inventify-directus-329104956989.us-south1.run.app/assets",
    files: "https://inventify-directus-329104956989.us-south1.run.app/files",
    root: "https://inventify-directus-329104956989.us-south1.run.app",
  },
  develop: {
    data: "https://inventify-directus-329104956989.us-south1.run.app/graphql",
    system: "https://inventify-directus-329104956989.us-south1.run.app/graphql/system",
    assets: "https://inventify-directus-329104956989.us-south1.run.app/assets",
    files: "https://inventify-directus-329104956989.us-south1.run.app/files",
    root: "https://inventify-directus-329104956989.us-south1.run.app",
  },
}

export const ENDPOINT = ENDPOINTS.develop;