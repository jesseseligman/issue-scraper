#Shippable Interview Problem
###Live Application: http://jseligman-issue-scraper.herokuapp.com/

###My Solution
The first thing I did when presented with this problem was to investigate the Github API docs and see what information could be obtained given a repo URL. What I found was that I could get all of the open issues plus pull requests from a (public) repo url. The response comes paginated, with a max number of results per request of 100. Once I had the initial request working, the next step was to make a new request for each page, for any repository with more than 100 open issues. After getting data retrieval working, the next step was to properly manipulate data. This entailed first filtering out all pull requests, and then sorting issues based on the date that they were created. The last step, was to render the results.

###Possible Improvements
  * Improve parsing of url to allow user to enter any permutation of the repo url rather than just the base url (ex. right now https://github.com/nodejs/node works but https://github.com/nodejs/node/issues doesn't)
  * Refactor the API call to more efficiently get all paginated results
  * Improve UI
