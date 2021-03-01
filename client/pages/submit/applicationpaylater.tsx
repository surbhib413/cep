import SubmitApplicationPayLater from "../../src/pages/Application/SubmitApplicationPayLater";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <SubmitApplicationPayLater {...props} />
    </>
  );
}