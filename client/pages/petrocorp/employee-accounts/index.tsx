import PetrocorporateEmployeeAccounts from "../../../src/pages/PetrocorporateEmployeeAccounts/PetrocorporateEmployeeAccounts";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <PetrocorporateEmployeeAccounts {...props} />
    </>
  );
}
