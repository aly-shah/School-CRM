import { PageHeader } from "@/components/ui";
import FeeVoucher from "@/modules/FeeVoucher";

export default function Page({ params }) {
  return (
    <>
      <div className="no-print"><PageHeader title="Fee voucher" subtitle="Preview · print or download as PDF" /></div>
      <FeeVoucher studentId={params.id} backHref="/finance/vouchers" />
    </>
  );
}
