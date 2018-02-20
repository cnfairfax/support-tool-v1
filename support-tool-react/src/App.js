import React from "react";
import {
  Route,
  NavLink,
  BrowserRouter
} from "react-router-dom";
import Home from "./views/Home";
import GetBlockedEmails from "./views/GetBlockedEmails";
import BlockedEmails from "./views/BlockedEmails";
import CheckForBlockedEmails from "./views/CheckForBlockedEmails";
import BlockedReport from "./views/BlockedReport";
import GetHistoricalReports from "./views/GetHistoricalReports";
import HistoricalReports from "./views/HistoricalReports";
import "./App.css";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <div className="header">
          <img src="/logo.png" alt="ClickDimensions"/>
          <h1>Email Unblock Manager</h1>
            <ul className="nav">
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/GetBlockedEmails">Fetch Blocked Emails</NavLink></li>
              <li><NavLink to="/CheckForBlockedEmails">Check Blocked Emails</NavLink></li>
              <li><NavLink to="/GetHistoricalReports">Pull Account History</NavLink></li>
            </ul>
          </div>
          <div className="content page">
            <Route exact path="/" component={Home}/>
            <Route exact path="/GetBlockedEmails" component={GetBlockedEmails}/>
            <Route exact path="/BlockedEmails" component={BlockedEmails}/>
            <Route exact path="/CheckForBlockedEmails" component={CheckForBlockedEmails}/>
            <Route exact path="/BlockedReport" component={BlockedReport}/>
            <Route exact path="/GetHistoricalReports" component={GetHistoricalReports}/>
            <Route exact path="/HistoricalReports" component={HistoricalReports}/>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}
 
export default App;
