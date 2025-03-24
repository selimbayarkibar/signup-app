import "./globals.css";

export const metadata = {
  title: "Signup",
  description: "Signup page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
