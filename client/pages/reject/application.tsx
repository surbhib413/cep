import RejectPopUp from "../../src/pages/Application/RejectPopUp";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <RejectPopUp {...props} />
    </>
  );
}
