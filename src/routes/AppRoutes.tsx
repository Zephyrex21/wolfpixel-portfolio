import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Error404 from "../pages/Error404";
import Layout from "../components/Layout/Layout";
import { Theme, ThemeToggleOrigin } from "../utils/constants";

interface AppRoutesProps {
  theme: Theme;
  onToggleTheme: (origin?: ThemeToggleOrigin) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ theme, onToggleTheme }) => {
  return (
    <Routes>
      <Route element={<Layout theme={theme} onToggleTheme={onToggleTheme} />}>
        <Route path="/" element={<Home theme={theme} />} />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRoutes;
