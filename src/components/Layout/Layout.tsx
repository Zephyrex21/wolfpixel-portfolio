import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Theme, ThemeToggleOrigin } from "../../utils/constants";

interface LayoutProps {
  theme: Theme;
  onToggleTheme: (origin?: ThemeToggleOrigin) => void;
}

const Layout: React.FC<LayoutProps> = ({ theme, onToggleTheme }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar theme={theme} onToggleTheme={onToggleTheme} />

      <main className="pt-[96px] sm:pt-[110px] md:pt-[100px] lg:pt-[76px]">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
