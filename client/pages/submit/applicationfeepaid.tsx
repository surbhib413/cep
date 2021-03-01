import SubmitApplicationFeePaid from "../../src/pages/Application/SubmitApplicationFeePaid";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <SubmitApplicationFeePaid {...props} />
    </>
  );
}