import Password from "../src/pages/Password/Password";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <Password {...props} />
    </>
  );
}
