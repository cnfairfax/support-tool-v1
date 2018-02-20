import React from "react";
import { Redirect } from "react-router-dom";
import axios from "axios";
 
class UnblockButton extends React.Component {
     constructor(props) {
        super(props);
        this.unblockAllEmails = this.unblockAllEmails.bind(this);
        this.state = {
            auth: this.props.location.auth,
            emails: this.props.location.emails,
            parentPath: this.props.location.redirectPath,
            success: ''
        };
    }
    
    unblockAllEmails = (event) => {
        var { accountKey, subd, token } = this.state.auth;
        var emails = this.state.emails;
    }
    
    render() {
        if(this.state.success === 'success') {
            return (
                <Redirect path={ this.state.parentPath } />
            );
        }
        
        return (
            <button onClick={ this.unblockAllEmails }>Unblock All</button>
        );
    }
}

export default UnblockButton