// ===================================
// IMPERHA NÓMINAS - Sistema Enterprise
// Layout para páginas de autenticación
// ===================================

import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

function AuthLayout() {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Outlet />
    </Box>
  );
}

export default AuthLayout;
