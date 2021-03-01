import EnrolSuccess from "../../src/pages/Application/EnrolSuccess";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <EnrolSuccess {...props} />
    </>
  );
}
