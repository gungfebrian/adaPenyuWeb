export const XCODE_SIGNING_CONFIG = {
  applicationIdentifierPrefix: "7Y44BM6QU8",
  legacyApplicationIdentifierPrefix: "35SGY39Y8Z",
  bundleIdentifier: "com.ADA.ADA-Penyu",
  appIDs: [
    "7Y44BM6QU8.com.ADA.ADA-Penyu",
    "35SGY39Y8Z.com.ADA.ADA-Penyu",
  ],
  associatedDomainEntitlement: "applinks:www.adapenyu.com",
  aasaEndpoint: "https://www.adapenyu.com/.well-known/apple-app-site-association",
} as const;

export const APPLE_APP_SITE_ASSOCIATION = {
  applinks: {
    details: [
      {
        appIDs: [
          "7Y44BM6QU8.com.ADA.ADA-Penyu",
          "35SGY39Y8Z.com.ADA.ADA-Penyu",
        ],
        components: [
          {
            "/": "/account/reset-password",
            comment: "Password reset email action",
          },
          {
            "/": "/account/accept-invitation",
            comment: "Ranger invitation and initial owner setup email action",
          },
          {
            "/": "/account/confirm-email",
            comment: "Email confirmation action",
          },
        ],
      },
    ],
  },
} as const;

export function createAasaResponse(): Response {
  return new Response(JSON.stringify(APPLE_APP_SITE_ASSOCIATION, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
