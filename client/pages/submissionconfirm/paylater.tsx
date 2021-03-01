import ConfirmSubmission from "../../src/pages/Application/ConfirmSubmission";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <ConfirmSubmission {...props} />
    </>
  );
}