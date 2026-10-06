import { Receipt } from "lucide-react";
import AdminSectionPage from "./AdminSectionPage";

const Sales = () => (
  <AdminSectionPage
    title="Sales"
    description="Review completed and in-progress vehicle sales."
    message="Sales management is coming soon"
    icon={Receipt}
  />
);

export default Sales;
