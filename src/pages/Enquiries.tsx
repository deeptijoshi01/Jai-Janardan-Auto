import { MessageSquare } from "lucide-react";
import AdminSectionPage from "./AdminSectionPage";

const Enquiries = () => (
  <AdminSectionPage
    title="Enquiries"
    description="Keep track of customer questions and vehicle enquiries."
    message="Enquiry management is coming soon"
    icon={MessageSquare}
  />
);

export default Enquiries;
