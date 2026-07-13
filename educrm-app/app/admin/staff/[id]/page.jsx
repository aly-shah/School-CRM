import StaffProfile from "@/modules/StaffProfile";
export default function Page({ params }) {
  return <StaffProfile id={params.id} base="/admin" />;
}
