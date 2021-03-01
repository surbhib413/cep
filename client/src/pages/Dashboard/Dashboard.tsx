import { Container } from "@material-ui/core";
import React from "react";
import { useRouter } from "next/router";

const Dashboard = (): JSX.Element => {
  const router = useRouter();
  const redirectToPetrocorporate = (): void => {
    // props.history.push("/petrocorporate/signup");
    router.push("/signup/petrocorporate");
  };

  const redirectToSmartfleet = (): void => {
    // props.history.push("/smartfleet/signup");
    router.push("/signup/smartfleet");
  };
  return (
    <Container>
      <div className={`text-center p-5`}>
        <div>
          <h4
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => redirectToSmartfleet()}
          >
            Smartfleet
          </h4>
        </div>
        <div className="pt-4">
          <h4
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => redirectToPetrocorporate()}
          >
            Petrocorporate
          </h4>
        </div>
      </div>
    </Container>
  );
};

export default Dashboard;
