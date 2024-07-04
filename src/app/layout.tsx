import React, { StrictMode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StrictMode>
          {children}
        </StrictMode>
      </body>

    </html>
  );
}