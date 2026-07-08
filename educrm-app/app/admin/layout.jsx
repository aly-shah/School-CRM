import PortalShell from "@/components/PortalShell";
export default function AdminLayout({ children }) {
  return <PortalShell portal="admin">{children}</PortalShell>;
}
