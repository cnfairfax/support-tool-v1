import React from "react";
import CheckForm from "../components/CheckForm";
 
class GetBlockedEmails extends React.Component {
  render() {
    return (
      <div className="solo-form-module">
        <h1>Check Emails Against Blocked Emails</h1>
        <CheckForm/>
      </div>
    );
  }
}
 
export default GetBlockedEmails;