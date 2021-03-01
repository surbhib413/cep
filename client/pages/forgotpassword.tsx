import ForgotPassword from "../src/pages/ForgotPassword/ForgotPassword";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <ForgotPassword {...props} />
    </>
  );
}
