import React, { useState } from "react";
import { CustomButton } from "./CustomButton/CustomButton";
import { Popup1 } from "./CustomPopups/Popup1/Popup1";
import { Popup2 } from "./CustomPopups/Popup2/Popup2";
import { Popup3 } from "./CustomPopups/Popup3/Popup3";
import { Popup4 } from "./CustomPopups/Popup4/Popup4";


export const Components = () => {
  //Popup1
  const [openPopup1, setOpenPopup1] = useState(false);
  const handlePopup1Click = () => {
    setOpenPopup1(true);
  };

  //Popup2
  const [openPopup2, setOpenPopup2] = useState(false);
  const handlePopup2Click = () => {
    setOpenPopup2(true);
  };

  //Popup3
  const [openPopup3, setOpenPopup3] = useState(false);
  const handlePopup3Click = () => {
    setOpenPopup3(true);
  };

  const [openPopup4, setOpenPopup4] = useState(false);
  const handlePopup4Click = () => {
    setOpenPopup4(true);
  };

  
  


  return (
    <>
      <div>
        <h3>Custom Popups</h3>
        <hr></hr>

        <h4>Popup1</h4>
        <CustomButton variant="contained" onClick={handlePopup1Click}>
          Open Popup1
        </CustomButton>
        <Popup1
          open={openPopup1}
          close={() => setOpenPopup1(false)}
          closeAndSubmit={() => setOpenPopup1(false)}
          title="Title"
          description="Description"
        ></Popup1>

        <h4>Popup2</h4>
        <CustomButton variant="contained" onClick={handlePopup2Click}>
          Open Popup2
        </CustomButton>
        <Popup2
          open={openPopup2}
          close={() => setOpenPopup2(false)}
          closeAndSubmit={() => setOpenPopup2(false)}
          title="Title"
          description="Description"
        ></Popup2>

        <h4>Popup3</h4>
        <CustomButton variant="contained" onClick={handlePopup3Click}>
          Open Popup3
        </CustomButton>
        <Popup3
          open={openPopup3}
          close={() => setOpenPopup3(false)}
          closeAndSubmit={() => setOpenPopup3(false)}
          title="Title"
          description="Description"
        ></Popup3>


<h4>Popup4</h4>
        <CustomButton variant="contained" onClick={handlePopup4Click}>
          Open Popup4
        </CustomButton>
        <Popup4
          open={openPopup4}
          close={() => setOpenPopup4(false)}
          closeAndSubmit={() => setOpenPopup4(false)}
          title="Title"
          description="Description"
        ></Popup4>
      </div>
    </>
  );
};
