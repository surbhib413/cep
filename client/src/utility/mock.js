export const paymentSuccess = {
  email: "johndoe@example.com",
  dispatch_time: "15-20",
  application_summary: "2 Physical Card",
  application_id: "QA123456790",
  payment_type: "CMS Balance",
  cms_balance: "49,900.00",
  amount_paid: "100.00",
  invoice_link: "#",
};
export const applicationSubmit = {
  dispatch_time: "15-20",
  application_summary: "2 Physical Card",
  application_id: "QA123456790",
  payment_type: "Paid at Fuel Station",
  transaction_reference_no: "100.00",
  amount_paid: "100",
};
export const applicationSubmit2 = {
  dispatch_time: "15-20",
  application_summary: "2 Physical Card",
  application_id: "QA123456790",
  payment_type: "Request for fee waiver",

  amount_paid: "100",
};

export default { paymentSuccess, applicationSubmit,applicationSubmit2 };
