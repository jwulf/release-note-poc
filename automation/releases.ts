import { Octokit } from "@octokit/rest";
import fs from 'fs'
import dotenv from "dotenv"
dotenv.config()

const octokit = new Octokit({
auth: process.env.GITHUB_TOKEN,
});

async function main() {
    const {data} = await octokit.repos.listReleases({
        owner: 'camunda',
        repo: 'camunda-platform'
    })
    const relevant_releases = data.filter(({tag_name}) => tag_name.includes('8.2') || tag_name.includes('8.3'))
    const releases = relevant_releases.map(release => ({
        version: release.tag_name,
        notes: getIssues(release.body ?? '')
    }))
    
    const releases_8_3 = releases
        .filter(rel => rel.version.includes('8.3'))
        .flatMap(rel => rel.notes.map(note => ({[rel.version]: note})))
    const releases_8_2 = releases
        .filter(rel => rel.version.includes('8.2'))
        .flatMap(rel => rel.notes.map(note => ({[rel.version]: note})))
    fs.writeFileSync('rel-8.3.json', JSON.stringify(releases_8_3, null, 2))
    fs.writeFileSync('rel-8.2.json', JSON.stringify(releases_8_2, null, 2))
}

function getIssues(note: string) {
    const githubFragment = 'https://github.com/'
    const lines = note.split('\r\n')
    const issues = lines
        .filter(line => line.includes(githubFragment))
        .map(line => githubFragment + line.split(githubFragment)[1].replace('))', ''))
    return issues
}

function compareReleases() {
    type smap = {[key: string]: string}[]
    const releases_8_3 = JSON.parse(fs.readFileSync('rel-8.3.json', 'utf-8')) as smap
    const releases_8_2 = JSON.parse(fs.readFileSync('rel-8.2.json', 'utf-8')) as smap

    const releaseReport = releases_8_3.map(val => {
        const release = Object.keys(val)[0]
        const issue = val[release]        
        const inVersion = releases_8_2.filter(val => (issue == Object.values(val)[0]))
        return {...val, release, issue, in: inVersion.length > 0 ? Object.keys(inVersion[0])[0] : 'NOTHING'}
    })
    fs.writeFileSync('rel-8.3-report.raw.json', JSON.stringify(releaseReport, null, 2))
    const unique = releaseReport.filter(val => (val.in == 'NOTHING'))
    console.log(unique)
    fs.writeFileSync('rel-8.3-report.json', JSON.stringify(unique, null, 2))
}

// main()

compareReleases()