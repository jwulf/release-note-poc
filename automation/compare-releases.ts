import { Octokit } from "@octokit/rest";
import fs from 'fs'
import dotenv from "dotenv"

dotenv.config()

const octokit = new Octokit({
auth: process.env.GITHUB_TOKEN,
});

const wait = (sec: number)  => new Promise(res => setTimeout(() => res(null), sec*1000))

import { FirestoreRecord } from './dataschema'

interface issue {
    version: string,
    note: {
      githubUrl: string,
      component: string,
      subcomponent: string,
      context: string
    }
}

const releases_8_3: issue[] = JSON.parse(fs.readFileSync('rel-8.3.json', 'utf-8'))
const releases_8_2: issue[] = JSON.parse(fs.readFileSync('rel-8.2.json', 'utf-8')) 
const releases_8_1: issue[] = JSON.parse(fs.readFileSync('rel-8.1.json', 'utf-8')) 

async function main() {
    const output = []
    let count = 1
    for (const i of releases_8_3) {
        const also_in: string[] = []
        let r: Partial<FirestoreRecord> = {}
        const ghUrl = i.note.githubUrl.replace('https://github.com/', '')
        const issueNo = ghUrl.split('issues/')[1]
        const org = ghUrl.split('/issues/')[0].split('/')[0]
        const repo = ghUrl.split('/issues/')[0].split('/')[1]
        const req = {
            issue_number: parseInt(issueNo, 10),
            owner: org,
            repo
        }
        const issue = isNaN(req.issue_number) ? {data: { title: ghUrl + ' isNaN'}} : await octokit.issues.get(req).catch(_ => ({data: { title: `${org}/${repo}/${issueNo} ${_.message}` }}))

        console.log(`${count++} of ${releases_8_3.length} - ${issue.data.title}`)

        await wait(0.3) // throttle

        const githubIssueTitle = issue.data.title
        releases_8_1.forEach(i1 => {
            if (i1.note.githubUrl === i.note.githubUrl) {
                also_in.push(i1.version)
            }
        })
        releases_8_2.forEach(i2 => {
            if (i2.note.githubUrl === i.note.githubUrl) {
                also_in.push(i2.version)
            }
        })
        if (i.note.context.includes('Breaking Changes')) {
            r.releaseNoteType = 'Breaking Change'
        }
        if (i.note.context.includes('Enhancements') || i.note.context.includes('New Features')) {
            r.releaseNoteType = 'Enhancement'
        }
        if (i.note.context.includes('Bug Fixes') || i.note.context.includes('Bugfixes')) {
            r.releaseNoteType = 'Bug Fix'
        }
        r.includeInReleaseNotes = !!r.releaseNoteType
        const note = {
            ...r, 
            githubIssueUrl: i.note.githubUrl,
            githubIssueTitle,
            component: i.note.component,
            subcomponent: i.note.subcomponent,
            context: i.note.context,
            releasedInVersion: i.version
        }
        output.push({...i, also_in, note})
    }

    fs.writeFileSync('rel-8.3.report.json', JSON.stringify(output, null, 2))
}

main()
