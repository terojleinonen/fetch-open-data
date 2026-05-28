import "./globals.css"
import Navigation from "./components/navigation/Navigation"

export const metadata = {
  title: "Stephen King Universe",
  description: "A cinematic archival interface exploring the Stephen King universe",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="appShell">

          {/* LEFT NAVIGATION */}
          <aside className="leftNav">
            <Navigation />
          </aside>

          {/* MAIN CONTENT */}
          <main className="mainContent">
            {children}
          </main>

          {/* RIGHT SIDEBAR */}
        </div>
      </body>
    </html>
  )
}