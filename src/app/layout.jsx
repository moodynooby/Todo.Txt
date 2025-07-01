import './globals.css';

export const metadata = {
  title: 'Todo.TxT',
  description: 'A simple todo.txt app',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}