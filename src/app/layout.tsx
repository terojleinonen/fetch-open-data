import type { Metadata } from "next";
import "./globals.css";
import Shell from "./components/Shell";
export const metadata:Metadata={title:{default:"Stephen King Universe",template:"%s · Stephen King Universe"},description:"An interactive archive of works, stories and entities drawn from public data sources."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-theme="recovered" suppressHydrationWarning><body><Shell>{children}</Shell></body></html>}
