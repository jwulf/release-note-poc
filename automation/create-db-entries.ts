import fs from 'fs'
import {Firestore} from '@google-cloud/firestore';
import dotenv from 'dotenv';
import { createDocId } from './database';

dotenv.config()

export const collectionName = 'release-notes'

const db = new Firestore({
  projectId: 'camunda-researchanddevelopment',
});

const releases = JSON.parse(fs.readFileSync('rel-8.3.report.json', 'utf-8'))

async function main() {
    for (const item of releases) {
        const doc = {
            alsoReleasedIn: [item.note.releasedInVersion, ...item.also_in],
            ...item.note
        }
        const id = createDocId(item.note.githubIssueUrl)
        console.log(`Create ${collectionName}/${id}`)
        const docRef = db.doc(`${collectionName}/${id}`)
        /** Make sure we don't overwrite includedInRelease */
        await docRef.set(doc, {
            mergeFields: [ 
                'context',
                'releaseNoteType',
                'subcomponent',
                'component',
                'githubIssueUrl',
                'id',
                'releasedInVersion',
                'alsoReleasedIn',
                'githubIssueTitle'
            ]
        })
    }
}

main()