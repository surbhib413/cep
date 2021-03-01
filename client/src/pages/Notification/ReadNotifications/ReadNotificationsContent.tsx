import React from 'react';
import NotificationMainPage from "../NotificationMainPage";

const ReadNotifications = (props: any): JSX.Element => {
  return (
    <div>
      <NotificationMainPage {...props}></NotificationMainPage>
      Test Read
    </div>
  )
}

export default ReadNotifications;