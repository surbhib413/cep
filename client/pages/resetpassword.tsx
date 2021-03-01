import ResetPassword from "../src/pages/ResetPassword/ResetPassword";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <ResetPassword {...props} />
    </>
  );
}