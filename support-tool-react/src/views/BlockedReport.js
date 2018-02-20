import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
 
class BlockedReport extends React.Component {
    constructor(props) {
        super(props);
        this.unblockEmail = this.unblockEmail.bind(this);
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
    
    unblockEmail = (event) => {
        
        event.target.innerHTML = 'Unblocking';
        
        var index = Number(event.target.getAttribute('data-index'));
        
        axios.post('https://cd-tool-cnfairfax.c9users.io:8082/api/unblockEmail', {
            accountKey: this.state.auth.accountKey,
            subd: this.state.auth.subd,
            token: this.state.auth.token,
            Email: event.target.getAttribute('data-email')
        }).then((response) => {
            this.state.emails.splice(index, 1);
            this.setState({ processing: false, result: 'success' });
        }).catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                this.setState({ processing: false, errors: error.response.data });
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
                this.setState({ processing: false });
            } else {
                // Something happened in setting up the request that triggered an Error
                this.setState({ processing: false });
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
        console.log(event.target.getAttribute('data-email'));
    }
    
    render() {
        console.log(this.props);
        
        const { blocked, blockedURL, notBlockedURL, invalidURL } =  this.state.info;
        
        var blockedURLFull = "https://cd-tool-cnfairfax.c9users.io:8082" + blockedURL,
            notBlockedURLFull = "https://cd-tool-cnfairfax.c9users.io:8082" + notBlockedURL,
            invalidURLFull = "https://cd-tool-cnfairfax.c9users.io:8082" + invalidURL
            
        if(this.state.emailBool) {
            var emailList = blocked.map((email, i) => {
                return (
                    <div className="table-row" key={ email.Email }>
                        <div className="cell email">{ email.Email }</div>
                        <div className="cell blocked-on">{ email.CreatedOn }</div>
                        <div className="cell delete">
                            <div className="button" data-email={ email.Email } data-index={ i } onClick={ this.unblockEmail }>Unblock</div>
                        </div>
                    </div>
                ) 
            });
            return (
                <div className="email-report">
                    <div className="module-header">
                        <h1>Blocked Emails</h1>
                    </div>
                    <div className="buttons downloads">
                            <button data-url={ blockedURLFull } onClick={ this.download }>Blocked List CSV</button>
                            <button data-url={ notBlockedURLFull } onClick={ this.download }>Not Blocked List CSV</button>
                            <button data-url={ invalidURLFull } onClick={ this.download }>Invalid List CSV</button>
                        </div>
                    <div className="table-wrapper">
                        <div className="table-head">
                            <div className="table-row">
                                <div className="header-cell email">Email</div>
                                <div className="header-cell blocked-on">Blocked On</div>
                                <div className="header-cell delete">Unblock</div>
                            </div>
                        </div>
                        <div className="table-body">
                            { emailList }
                        </div>
                    </div>
                </div>
            );   
        } else {
            return <Redirect to="/CheckForBlockedEmails"/>
        }
    }   
}

 
export default BlockedReport;