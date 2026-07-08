import StudentProfile from "@/modules/StudentProfile";
export default function Page({ params }) {
  return <StudentProfile id={params.id} base="/admin" />;
}
