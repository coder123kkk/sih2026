import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Skill Intelligence Platform — India\'s Official Statistical System',
  description: 'AI-enabled Skill Intelligence and Learning Platform integrated with iGOT Karmayogi for capacity building of India\'s statistical workforce.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body suppressHydrationWarning>
        <div className="app-layout">
          <Sidebar />
          <div className="main-content">
            <Navbar />
            <main style={{ flex: 1 }}>
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
