import PetrocorpEnrolSuccess from "../../src/pages/PetrocorporateRegistrationForm/Application/PetrocorpEnrolSuccess";

interface Props {
  history: any;
}

export default function Index(props: Props) {
  return (
    <>
      <PetrocorpEnrolSuccess {...props} />
    </>
  );
}
