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
    const relevant_releases = data.filter(({tag_name}) => tag_name.includes('8.'))

    const releases = relevant_releases.map(release => ({
        version: release.tag_name,
        notes: getIssues(release.body ?? '').filter(e => !!e)
    }))

    const releases_8_3 = releases
        .filter(rel => rel.version.includes('8.3'))
        .flatMap(rel => rel.notes.map(note => ({
            version: rel.version,
            note})))
    const releases_8_2 = releases
        .filter(rel => rel.version.includes('8.2'))
        .flatMap(rel => rel.notes.map(note => ({
            version: rel.version,
            note
        })))
    const releases_8_1 = releases
        .filter(rel => rel.version.includes('8.1'))
        .flatMap(rel => rel.notes.map(note => ({
            version: rel.version,
            note
        })))

    fs.writeFileSync('rel-8.3.json', JSON.stringify(releases_8_3, null, 2))
    fs.writeFileSync('rel-8.2.json', JSON.stringify(releases_8_2, null, 2))
    fs.writeFileSync('rel-8.1.json', JSON.stringify(releases_8_1, null, 2))
}

function getIssues(note: string) {
    const githubFragment = 'https://github.com/'
    const lines = note
        .split('\n')
        .map(l => l.replace('\r', ''))
        .filter(l => !!l)
        .filter(l => !l.startsWith('# Release '))
        .filter(l => !l.startsWith('# 8'))
    let component: string
    let subcomponent: string
    let context: string
    const issues = lines
        .map(line => {
            if (line.includes(githubFragment)) {
                return {
                    githubUrl: githubFragment + line.split(githubFragment)[1].replace('))', ''),
                    component,
                    subcomponent,
                    context
                }
            } else {
                if (line.startsWith('# ')) {
                    component = line.replace('# ', '').replace('\r\n', '')
                    return {isContext: true}
                } 
                if (line.startsWith('## ')) {
                    context = line.replace('## ', '').replace('\r\n', '')
                    return {isContext: true}
                }
                if (line.startsWith('### ')) {
                    subcomponent = line.replace('### ', '').replace('\r\n', '')
                    return {isContext: true}
                }
            }
        })
        .filter(line => !line?.isContext === true)
    return issues
}


main()

