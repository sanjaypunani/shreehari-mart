import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import { theme } from '@shreehari/design-system';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';

import { OrdersPage } from './pages/OrdersPage';
import { OrderFormPage } from './pages/OrderFormPage';
import { OrderAnalyticsPage } from './pages/OrderAnalyticsPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductFormPage } from './pages/ProductFormPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryFormPage } from './pages/CategoryFormPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerFormPage } from './pages/CustomerFormPage';
import { CustomerWalletPage } from './pages/CustomerWalletPage';
import { SocietiesPage } from './pages/SocietiesPage';
import { SocietyFormPage } from './pages/SocietyFormPage';
import { BuildingsPage } from './pages/BuildingsPage';
import { BuildingFormPage } from './pages/BuildingFormPage';
import { DashboardPage } from './pages/DashboardPage';
import { MonthlyBillingPage } from './pages/MonthlyBillingPage';
import { DeliveryPartnersPage } from './pages/DeliveryPartnersPage';
import { DeliveryPartnerFormPage } from './pages/DeliveryPartnerFormPage';
import { Layout } from './components/Layout';

function App() {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        <Notifications />
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/orders/new" element={<OrderFormPage />} />
              <Route path="/orders/:id/edit" element={<OrderFormPage />} />
              <Route
                path="/orders/analytics"
                element={<OrderAnalyticsPage />}
              />
              <Route path="/delivery-partners" element={<DeliveryPartnersPage />} />
              <Route path="/delivery-partners/new" element={<DeliveryPartnerFormPage />} />
              <Route path="/delivery-partners/:id/edit" element={<DeliveryPartnerFormPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/products/new" element={<ProductFormPage />} />
              <Route path="/products/:id/edit" element={<ProductFormPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/categories/new" element={<CategoryFormPage />} />
              <Route path="/categories/:id/edit" element={<CategoryFormPage />} />
              <Route path="/customers" element={<CustomersPage />} />
              <Route path="/customers/new" element={<CustomerFormPage />} />
              <Route
                path="/customers/:id/edit"
                element={<CustomerFormPage />}
              />
              <Route
                path="/customers/:customerId/wallet"
                element={<CustomerWalletPage />}
              />
              <Route path="/societies" element={<SocietiesPage />} />
              <Route path="/societies/new" element={<SocietyFormPage />} />
              <Route path="/societies/:id/edit" element={<SocietyFormPage />} />
              <Route path="/buildings" element={<BuildingsPage />} />
              <Route path="/buildings/new" element={<BuildingFormPage />} />
              <Route
                path="/buildings/:id/edit"
                element={<BuildingFormPage />}
              />
              <Route path="/monthly-billing" element={<MonthlyBillingPage />} />
            </Routes>
          </Layout>
        </Router>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
