import { useSelector } from "react-redux";
import Header from "../src/components/Header/Header";

export default function Index(props: any) {
  const store: any = useSelector((state) => state);
  const { toggleSidenavOpen } = props;
  return (
    <>
      {store.assistedFlow ? (
        ""
      ) : (
        <Header toggleSidenavOpen={toggleSidenavOpen}></Header>
      )}
    </>
  );
}
