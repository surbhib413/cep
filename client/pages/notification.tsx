import Notification from "../src/pages/Notification/Notification";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <Notification {...props} />
    </>
  );
}
