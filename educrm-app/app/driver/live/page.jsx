import { PageHeader } from "@/components/ui";
import LiveMap from "@/modules/LiveMap";

export default function Page() {
  return (
    <>
      <PageHeader title="Live tracking" subtitle="Route 1 · North Loop · Bus LEB-4471 — updating in real time" />
      <LiveMap />
    </>
  );
}
