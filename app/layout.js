import "../styles/main.css";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Campus Connect - Digital Guestbook",
  description: "Connect with your campus community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  );
}
