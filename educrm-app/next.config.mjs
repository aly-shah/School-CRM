/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        // school.scalamatic.com/app.apk -> the latest APK built by GitHub Actions
        source: "/app.apk",
        destination: "https://github.com/aly-shah/School-CRM/releases/download/app-latest/app.apk",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
