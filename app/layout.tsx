import './globals.css';
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';
import Navbar from './Navbar';
import AuthProvider from './auth/Provider';
import QueryClientProvider from './QueryClientProvider'; 

export default function RootLayout({children,}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider>
          <AuthProvider>
            <Theme>
              <Navbar />
              <main className='p-5'>{children}</main>
            </Theme>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}