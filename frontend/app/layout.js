import { Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import { PrivyProvider } from "@privy-io/react-auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const globalStyles = `
  :root {
    --font-geist-sans: ${geistSans.variable};
    --font-geist-mono: ${geistMono.variable};
  }
`;

export const metadata = {
  title: "EcoMed",
  description: "A health platform for eco-friendly solutions",
};

export default function RootLayout({ children }) {
  const PRIVY_APP_ID = process.env.PRIVY_ID;
  return (
    <html lang="en">
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com"  />
      <link href="https://fonts.googleapis.com/css2?family=Anton&family=Doto:wght@100..900&family=Liter&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Playwrite+ES+Deco+Guides&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Raleway:ital,wght@0,100..900;1,100..900&family=Sigmar&family=Sour+Gummy:ital,wght@0,100..900;1,100..900&family=Style+Script&display=swap" rel="stylesheet" />


        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined"
        />
        <style>{globalStyles}</style>
      </head>
      <body
        className={`Poppins`}
      >
        <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
        //   logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
        },
      }}
    >
        {children}
        </PrivyProvider>
      </body>
    </html>
  );
}