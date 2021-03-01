import PetrocorporateRegistrationForm from "../../src/pages/PetrocorporateRegistrationForm/PetrocorporateRegistrationForm";

interface Props {
  history: any;
  location: any;
}

export default function Index(props: Props) {
  return (
    <>
      <PetrocorporateRegistrationForm {...props} />
    </>
  );
}
