import localFont from "next/font/local";
import ConditionalNavigationBar from "./components/ConditionalNavigationBar"; // Import ConditionalNavigationBar
import "./globals.css";

// Defines the Geist Sans font, loads it from a local file, and sets it up as a CSS variable.
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
// Defines the Geist Mono font, loads it from a local file, and sets it up as a CSS variable.
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// metadata object - Configures the application's metadata, used for SEO and general page information.
export const metadata = {
  title: "Stephen King Universe",
  description: "Generated by create next app",
};

// RootLayout component - The main layout component for the application.
// It sets up the HTML structure, loads fonts, and renders child components.
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalNavigationBar /> {/* Use ConditionalNavigationBar */}
        {children}
      </body>
    </html>
  );
}
