      <PatientHome />
import PatientHome from "../pages/PatientHome";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return <Outlet />;
}

export default PublicLayout;
