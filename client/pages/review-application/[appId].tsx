import ReviewApplication from "../../src/pages/ReviewApplication/ReviewApplication";

interface Props {
  history: any;
  location: any;
}

export default function Index(props: Props) {
  return (
    <>
      <ReviewApplication {...props} />
    </>
  );
}
