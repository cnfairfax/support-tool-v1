import React from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
 
class ReportForm extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            result: undefined,
            processing: false,
            errors: null,
            accountKey: '',
            reports: []
        
        };
    }
    
    handleChange(event) {
        this.setState({
           [event.target.name]: [event.target.value] 
        });
    }
    
    handleSubmit(event) {
        event.preventDefault();
        this.setState({ processing: true });
        
        axios.post('https://cd-tool-cnfairfax.c9users.io:8082/api/getReports', {
            accountKey: this.state.accountKey
        }).then((response) => {
            this.setState({ processing: false, result: 'success', reports: response.data });
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
                this.setState({ processing: false, errors: error.response.data });
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }
    
    render() {
        // eslint-disable-next-line
        const { result, processing, reports, accountKey } = this.state
        
        if(result === 'success') {
            return (
                <Redirect to={{
                    pathname: '/HistoricalReports',
                    state: { 
                        data: reports,
                        auth: {
                            accountKey: accountKey
                        }
                    }
                }} />
            );
        }
        
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="field-group">
                    <label htmlFor="accountKey">Account Key:</label>
                    <input type="text" name="accountKey" id="accountKey" onChange={this.handleChange}/>
                </div>
                <div className="submit-box">
                    <input type="submit" value={ processing ? 'Fetching blocked emails' : 'Get Blocked Emails'}/>
                </div>
                { this.state.errors && 
                    <span className="warning field-error">
                        { this.state.errors }
                    </span>
                }
            </form>
        );
    }
}
 
export default ReportForm;