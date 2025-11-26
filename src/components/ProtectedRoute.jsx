import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { isTokenValid } from "../utils/jwtUtils";

/**
 * Composant wrapper pour les routes protégées
 * Redirige vers /login si l'utilisateur n'est pas authentifié
 */
export function ProtectedRoute({ children }) {
  const { user, token } = useAuthStore();
  
  // Vérifier que l'utilisateur est connecté ET que le token est valide
  if (!user || !token || !isTokenValid()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
