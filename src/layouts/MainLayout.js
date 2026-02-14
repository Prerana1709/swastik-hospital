// MainLayout: wrapper for authenticated pages (dashboard, clinical, etc.).
// Renders child route via Outlet; layout shell can be extended later (e.g. shared sidebar/navbar).
import { Outlet } from "react-router-dom";

function MainLayout() {
  return <Outlet />;
}

export default MainLayout;
