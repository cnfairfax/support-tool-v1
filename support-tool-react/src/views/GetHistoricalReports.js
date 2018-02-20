import React from "react";
import ReportForm from "../components/ReportForm";
 
class GetHistoricalReports extends React.Component {
  render() {
    return (
      <div className="solo-form-module">
        <h1>Pull Account Reports</h1>
        <ReportForm/>
      </div>
    );
  }
}
 
export default GetHistoricalReports;