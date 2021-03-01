import ServiceRequestsTable from "../src/pages/ServiceRequestsTable/ServiceRequestsTable";
import axios from "axios";
import { useEffect } from "react";

const Index = ({ page, data }) => {
  // useEffect(() => {
  //   // The counter changed!
  // }, [page]);
  return (
    <>
      <ServiceRequestsTable page={page} data={data} />
    </>
  );
};

Index.getInitialProps = async ({ query }) => {
  const rowsPerPage = 10;
  const page = query.page ? query.page : 1;
  let headers = new Headers();
  headers.append("Content-Type", "applicatio  n/json");
  headers.append("Accept", "application/json");
  headers.append("Access-Control-Allow-Origin", "*");
  headers.append(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/todos?_limit=${rowsPerPage}&_page=${page}`,
    { headers }
  );
  return { data: response.data };
};
export default Index;
