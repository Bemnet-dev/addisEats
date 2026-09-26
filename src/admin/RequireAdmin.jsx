import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth';
export const RequireAdmin = ({ children }) => {
    const { isAuthenticated } = useAdminAuth();
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    return <>{children}</>;
};
RequireAdmin.propTypes = {
    children: PropTypes.node,
};
