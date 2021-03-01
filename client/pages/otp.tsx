import OtpVerification from "../src/pages/OtpVerification/OtpVerification";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <OtpVerification />
    </>
  );
}
