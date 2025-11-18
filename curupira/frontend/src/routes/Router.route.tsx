import { AppLayout } from '@/components/AppLayout';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ActivitiesListPage } from '~/pages/activities/ActivitiesList.page';
import { CategoriesListPage } from '~/pages/categories/CategoriesList.page';
import { EmissionCalculatorPage } from '~/pages/emission/EmissionCalculator.page';
import { HomePage } from '~/pages/home/Home.page';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />

        {/* Activities Routes */}
        <Route path="/activities" element={<ActivitiesListPage />} />

        {/* Categories Routes */}
        <Route path="/categories" element={<CategoriesListPage />} />

        {/* Emission Calculator */}
        <Route path="/emission-calculator" element={<EmissionCalculatorPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
