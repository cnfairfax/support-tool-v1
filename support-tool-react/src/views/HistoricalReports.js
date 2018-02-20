import React from "react";
import { Redirect } from "react-router-dom";
 
class HistoricalReports extends React.Component {
    constructor(props) {
        super(props);
        this.download = this.download.bind(this);
        if(this.props.location.state && this.props.location.state.data) {
            this.state = {
                info: this.props.location.state.data,
                auth: this.props.location.state.auth,
                emailBool: true
            };   
        } else {
            this.state = {
                emails: [],
                emailBool: false
            }
        }
        
    }
    
    download = (event) => {
        window.open(event.target.getAttribute('data-url'));
    }
    
    render() {
        console.log(this.props);
        
        const { info } =  this.state;
        
        var domain = "https://cd-tool-cnfairfax.c9users.io:8082"
            
        if(this.state.emailBool) {
            var reports = info.map((report, i) => {
                var date = new Date(report.date);
                var humanDate = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
                var readableDateTime = humanDate + ' ' + date.getHours() + ':' + date.getMinutes();
                
                return (
                    <div className="table-row" key={ report.sessionID }>
                        <div className="cell account">{ report.account }</div>
                        <div className="cell created-on">{ readableDateTime }</div>
                        <div className="cell download">
                            <div className="button" data-url={ domain + report.blockedEmailsLink } onClick={ this.download }>Download</div>
                        </div>
                         <div className="cell download">
                            <div className="button" data-url={ domain + report.notBlockedEmailsLink } onClick={ this.download }>Download</div>
                        </div>
                         <div className="cell download">
                            <div className="button" data-url={ domain + report.invalidEmailsLink } onClick={ this.download }>Download</div>
                        </div>
                    </div>
                ) 
            });
            return (
                <div className="email-report">
                    <div className="module-header">
                        <h1>Account Reports</h1>
                    </div>
                    <div className="table-wrapper">
                        <div className="table-head">
                            <div className="table-row">
                                <div className="header-cell account">Account</div>
                                <div className="header-cell created-on">Reports Date</div>
                                <div className="header-cell download">Blocked Addresses</div>
                                <div className="header-cell download">Not Blocked Addresses</div>
                                <div className="header-cell download">Invalid Addresses</div>
                            </div>
                        </div>
                        <div className="table-body">
                            { reports }
                        </div>
                    </div>
                </div>
            );   
        } else {
            return <Redirect to="/GetHistoricalReports"/>
        }
    }   
}

 
export default HistoricalReports;