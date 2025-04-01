
import { PropsWithChildren } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen bg-cyberBlue text-softWhite overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-cyberBlue to-darkGrey">
          {children}
        </main>
      </div>
    </div>
  );
}
