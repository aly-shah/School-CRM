// row -> client student shape
export function mapStudent(r) {
  return {
    id: r.id, name: r.name, grade: r.grade, roll: r.roll, gender: r.gender,
    dob: r.dob, blood: r.blood, house: r.house, status: r.status,
    attendance: r.attendance, overall: Number(r.overall), grade_letter: r.grade_letter, rank: r.rank,
    feeDue: r.fee_due, fees: { annual: r.fee_annual, paid: r.fee_paid, due: r.fee_due },
    address: r.address, medical: r.medical, sibling: r.sibling,
    father: r.father_name ? { name: r.father_name, occ: r.father_occ, phone: r.father_phone } : null,
    parent: r.parent_name ? { name: r.parent_name, rel: r.parent_rel, phone: r.parent_phone, email: r.parent_email } : null,
    subjects: r.subjects || [], photo: r.photo || null,
  };
}
