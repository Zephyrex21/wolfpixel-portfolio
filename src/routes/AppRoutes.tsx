import Home from "../pages/Home";
import Error404 from "../pages/Error404";
import Layout from "../components/Layout/Layout";
import { Theme } from "../utils/constants";

interface AppRoutesProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ theme, onToggleTheme }) => {
  // No react-router — the whole site is one page plus a 404, so a full
  // client-side router was ~20KB gzip for functionality that boils down
  // to "is the path / or not". vercel.json's rewrite still sends every
  // path to index.html (needed either way, so a direct visit to a
  // random URL doesn't hit a raw host 404 before React ever loads) —
  // this is just what decides what to render once it has.
  const isHome = window.location.pathname === "/";

  if (!isHome) {
    return <Error404 />;
  }

  return (
    <Layout theme={theme} onToggleTheme={onToggleTheme}>
      <Home theme={theme} />
    </Layout>
  );
};

export default AppRoutes;
