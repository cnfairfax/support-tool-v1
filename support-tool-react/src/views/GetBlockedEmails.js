import React from "react";
import GetForm from "../components/GetForm";
 
class GetBlockedEmails extends React.Component {
  render() {
    return (
      <div className="solo-form-module">
        <h1>Get Blocked Emails</h1>
        <GetForm/>
      </div>
    );
  }
}
 
export default GetBlockedEmails;