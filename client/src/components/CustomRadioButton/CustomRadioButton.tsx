import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";
import Radio, { RadioProps } from "@material-ui/core/Radio";

// const GreenRadio = withStyles({
//   root: {
//     color: green[400],
//     '&$checked': {
//       color: green[600],
//     },
//   },
//   checked: {},
// })((props: RadioProps) => <Radio color="default" {...props} />);

const CustomRadioButton = () => {
  const [selectedValue, setSelectedValue] = React.useState("a");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <Radio
        //checked={selectedValue === "d"}
        //onChange={handleChange}
        //value='d'
        color='primary'
        name='radio-button-demo'
        inputProps={{ "aria-label": "D" }}
      />
    </div>
  );
};

export default CustomRadioButton;
