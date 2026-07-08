import "./globals.css";

export const metadata = {
  title: "EduCRM 360 — School Management",
  description: "One platform to run your entire school.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
