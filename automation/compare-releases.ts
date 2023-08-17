import fs from 'fs'
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

const release_report = releases_8_3.map(i => {
    const also_in: string[] = []
    let r: Partial<FirestoreRecord> = {}
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
        component: i.note.component,
        subcomponent: i.note.subcomponent,
        context: i.note.context,
        releasedInVersion: i.version
    }
    return {...i, also_in, note}
})
fs.writeFileSync('rel-8.3.report.json', JSON.stringify(release_report, null, 2))