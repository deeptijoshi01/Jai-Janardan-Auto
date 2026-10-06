import { Settings } from "lucide-react";
import AdminSectionPage from "./AdminSectionPage";

const SettingsPage = () => (
  <AdminSectionPage
    title="Settings"
    description="Manage administrator preferences and dealership settings."
    message="Admin settings are coming soon"
    icon={Settings}
  />
);

export default SettingsPage;
