import { Users } from "lucide-react";
import AdminSectionPage from "./AdminSectionPage";

const Customers = () => (
  <AdminSectionPage
    title="Customers"
    description="Review and manage your dealership's customer relationships."
    message="Customer management is coming soon"
    icon={Users}
  />
);

export default Customers;
