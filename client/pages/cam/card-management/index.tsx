import CAMCardManagement from "../../../src/pages/CAMCardManagement/CAMCardManagement";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <CAMCardManagement {...props} />
    </>
  );
}
