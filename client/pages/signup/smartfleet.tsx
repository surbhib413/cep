import Signup from "../../src/pages/SignUp/Signup";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <Signup {...props} />
    </>
  );
}
