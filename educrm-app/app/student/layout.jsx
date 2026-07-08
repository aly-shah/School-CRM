import PortalShell from "@/components/PortalShell";
export default function StudentLayout({ children }) {
  return <PortalShell portal="student">{children}</PortalShell>;
}
