import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';
import { ChatPanel } from '../ai/ChatPanel';
import { UploadModal } from '../upload/UploadModal';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <Sidebar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatPanel />
      <UploadModal />
    </div>
  );
}
