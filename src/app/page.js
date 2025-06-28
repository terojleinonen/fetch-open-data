// Page component - Renders the main page.
export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen bg-transparent">
      <div className="text-center">
        <div>
          <h1 className="text-6xl text-[var(--text-color)]">
            Stephen King Universe
          </h1>
        </div>
        {/* Links have been moved to NavigationBar.js */}
      </div>
    </div>
  )
}