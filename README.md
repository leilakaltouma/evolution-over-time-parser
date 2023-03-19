## evolution-over-time-parser

This simple script scrape and parses the commit history from [here](https://github.com/leilakaltouma/evolution-over-time/tree/main) and return a CSV file with added timestamps.<br>

For this task, I created a repository that contained a JSON file with a simple data structure. I wrote a JavaScript code that parses the data and reads it into a native structure in memory. Then, I built a time machine that used GitHub API to play back the data repository's git history. At each commit, my code parsed the data and stored the entire sequence in memory along with the timestamp of the git commits. Finally, I converted the sequence into a CSV file.


## Installation

1) npm install
2) npm start
