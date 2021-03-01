import CreateEmployeeAccounts from "../../../src/pages/PetrocorporateEmployeeAccounts/CreateEmployeeAccounts/CreateEmployeeAccounts";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <CreateEmployeeAccounts {...props} />
    </>
  );
}
