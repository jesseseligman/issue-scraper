import React, { Component } from 'react';
import './App.css';
import { FormGroup, ControlLabel, FormControl, Button, Table } from 'react-bootstrap';
import axios from 'axios';
import parse from 'parse-link-header';
import Loader from 'halogen/RingLoader';
import { removePullRequests, issueAgeBreakdown } from './helpers';

class App extends Component {
  constructor() {
    super();
    this.state = {
      repoUrl: '',
      issues: {
        newIssues: 0,
        middleIssues: 0,
        oldIssues: 0,
        total: 0
      },
      error: false,
      title: '',
      fetching: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.fetchIssues = this.fetchIssues.bind(this);
  }

  handleChange(e) {
    this.setState({ repoUrl: e.target.value });
  }

  handleKeyPress(event) {
    if (event.key !== 'Enter') {
      return;
    }
    this.fetchIssues();
    event.preventDefault();
  }

  fetchIssues(issues = [], page = 1) {
    // Very basic validation on input
    if (!this.state.repoUrl.includes('github.com')) {
      return this.setState({ error: true });
    }

    // Update state to show loader
    this.setState({ error: false, fetching: true });

    // Parse repo path from input url
    const repo = this.state.repoUrl.split('github.com/')[1];

    const config = {
      method: 'get',
      url: `https://api.github.com/repos/${repo}/issues`,
      params: {
        per_page: 100,
        page: page
      },
      headers: {
        Accept: 'application/vnd.github.v3+json'
      }
    };

    axios(config)
    .then((res) => {
      // Update total issues and filter out pull requests
      issues = issues.concat(removePullRequests(res.data));

      // Check to see if more requests need to be made. All paginated requests will have a Link header, and all paginated requests except for the last one will have a last key
      if (res.headers.link && parse(res.headers.link).last) {
        return this.fetchIssues(issues, page + 1);
      }

      // Once all requests have been made, sort issues and update state

      const nextIssues = issueAgeBreakdown(issues);

      this.setState({
        issues: nextIssues,
        title: `Issues for repo: ${this.state.repoUrl}`,
        fetching: false
      });

    })
    .catch((err) => {
      this.setState({ error: true, fetching: false });
    })
  }

  render() {
    const { newIssues, middleIssues, oldIssues, total } = this.state.issues;
    const hidden = { display: 'none' };

    return (
      <div >
        <div className="container">
          <h1 className="title">Github Issue Fetcher</h1>
          <div style={this.state.fetching ? hidden : null}>
            <h4 style={this.state.error ? hidden : null}>{this.state.title}</h4>
            <h4 className="error" style={this.state.error ? null : hidden }>
              Oh no! Something went wrong. Make sure you're using the base url for the repository.
              <br/>
              (ex. https://github.com/nodejs/node)
            </h4>
          </div>
          <div style={this.state.fetching ? null : hidden}>
            <Loader margin="15px" size="30px" color="blue"/>
          </div>
          <Table bordered bsClass="table">
            <thead>
              <tr>
                <th>Time Opened</th>
                <th>Number</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Within the last 24 hours</td>
                <td>{newIssues}</td>
              </tr>
              <tr>
                <td>24 hours to 7 days ago</td>
                <td>{middleIssues}</td>
              </tr>
              <tr>
                <td>More than 7 days ago</td>
                <td>{oldIssues}</td>
              </tr>
              <tr>
                <td>All open issues</td>
                <td>{total}</td>
              </tr>
            </tbody>
          </Table>
          <form>
            <FormGroup
              bsClass="form"
            >
              <ControlLabel>Enter a github repo URL</ControlLabel>
              <FormControl
                type="text"
                value={this.state.repoUrl}
                placeholder="Repository URL"
                onChange={this.handleChange}
                onKeyPress={this.handleKeyPress}
              />
              <div>{this.state.errorMessage}</div>
            </FormGroup>
          </form>
          <Button
            onClick={() => this.fetchIssues()}
          >
            Get Issues
          </Button>
        </div>
      </div>
    );
  }
}

export default App;
