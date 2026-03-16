import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/layout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  HomePage,
  BranchesPage,
  BranchDetailPage,
  CollectionsPage,
  CollectionDetailPage,
  ItemDetailPage,
  SearchPage,
  LoginPage,
  ProfilePage,
} from '@/pages';
import {
  AdminDashboard,
  AdminBranches,
  AdminBranchForm,
  AdminCollections,
  AdminCollectionForm,
  AdminUsers,
  AdminUserForm,
  AdminUploads,
  AdminSettings,
} from '@/pages/admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="branches/:slug" element={<BranchDetailPage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="collections/:id" element={<CollectionDetailPage />} />
            <Route path="items/:id" element={<ItemDetailPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="branches" element={<AdminBranches />} />
            <Route path="branches/new" element={<AdminBranchForm />} />
            <Route path="branches/:id/edit" element={<AdminBranchForm />} />
            <Route path="collections" element={<AdminCollections />} />
            <Route path="collections/new" element={<AdminCollectionForm />} />
            <Route path="collections/:id/edit" element={<AdminCollectionForm />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/new" element={<AdminUserForm />} />
            <Route path="users/:id/edit" element={<AdminUserForm />} />
            <Route path="uploads" element={<AdminUploads />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
