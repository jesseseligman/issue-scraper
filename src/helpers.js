
const removePullRequests = (issues) => {
  return issues.filter((issue) => {
    return !issue.pull_request;
  })
};

const issueAgeBreakdown = (issues) => {
  const oneDay = 86400000;
  const oneWeek = 604800000;
  const issueAge = (i) => Date.now() - Date.parse(i.created_at);

  const newIssues = issues.filter((issue) => {
    return issueAge(issue) < oneDay;
  }).length;

  const middleIssues = issues.filter((issue) => {
    return issueAge(issue) >= oneDay && issueAge(issue) < oneWeek;
  }).length;

  const oldIssues = issues.filter((issue) => {
    return issueAge(issue) >= oneWeek;
  }).length;

  return {
    newIssues: newIssues,
    middleIssues: middleIssues,
    oldIssues: oldIssues,
    total: issues.length
  };
}



export { removePullRequests, issueAgeBreakdown };
