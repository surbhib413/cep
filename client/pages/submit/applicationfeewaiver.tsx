import SubmitApplicationFeeWaiver from "../../src/pages/Application/SubmitApplicationFeeWaiver";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <SubmitApplicationFeeWaiver {...props} />
    </>
  );
}
