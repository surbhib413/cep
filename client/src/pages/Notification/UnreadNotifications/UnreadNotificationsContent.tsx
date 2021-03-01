import React from 'react';
import NotificationMainPage from "../NotificationMainPage";

const UnreadNotifications = (props: any): JSX.Element => {
  return (
    <div>
      <NotificationMainPage {...props}></NotificationMainPage>
      Check Unread
    </div>
  )
}

export default UnreadNotifications;