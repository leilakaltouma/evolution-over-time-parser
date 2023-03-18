import { createObjectCsvWriter } from "csv-writer";
import { Octokit } from "@octokit/core";
import * as dotenv from 'dotenv' 
dotenv.config()

const csvWriter = createObjectCsvWriter({
  path: 'cities.csv',
  header: [
    { id: 'City', title: 'city' },
    { id: 'temperature', title: 'temperature' },
    { id: 'timeStamp', title: 'timestamp' }
  ]
});

const octokit = new Octokit({
  auth: process.env.SECRET_TOKEN
});

const fileName = 'cities.json';
const commits = [];

async function fetchCommitData(commit) {
  const response = await fetch(commit);
  const data = await response.json();

  return data;
}

async function main() {
  try {
    const commitList = await octokit.request('GET /repos/{owner}/{repo}/commits', {
      owner: 'leilakaltouma',
      repo: 'evolution-over-time',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    for (const commit of commitList.data) {
      const data = await fetchCommitData(commit.url);

      if (data.files[0].filename === fileName) {
        commits.push({'fileUrl': data.files[0].raw_url, 'date': data.commit.author.date});
      }
    }

    const cities = [];

    for (const commit of commits) {
      const data = await fetchCommitData(commit.fileUrl);
      data.forEach((city) => city.timeStamp = commit.date)
      cities.push(data);
    }


    await csvWriter.writeRecords(cities.flat());
    console.log('...Done');
  } catch (error) {
    console.log(error);
  }
}

main();