import {Firestore} from '@google-cloud/firestore';
import dotenv from 'dotenv';
import { FirestoreRecord } from './dataschema';

dotenv.config()

export const collectionName = 'release-notes'

export const createDocId = (githubIssueUrl: string) => githubIssueUrl.replaceAll('/', '_')

const db = new Firestore({
  projectId: 'camunda-researchanddevelopment',
});

export const dataset = getAll()

export async function getAll(notify = true) {
    const results: FirestoreRecord[]  = []
    const collectionRef = db.collection(collectionName)
    const snapshot = await collectionRef
        .orderBy('includeInReleaseNotes', 'desc')
        .orderBy('releasedInVersion', 'desc')
        .orderBy('component')
        .orderBy('releaseNoteType')
        .get()
    snapshot.forEach(doc => {
        let id = doc.id;
        let data = doc.data();
        results.push({ id, ...data } as FirestoreRecord);
    });
    if (notify) {
        const unsubscribe = collectionRef.onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type === 'added') {
                    console.log('New document: ', change.doc.data());
                    (await dataset).push(change.doc.data() as FirestoreRecord)
                }
                if (change.type === 'modified') {
                    console.log('Modified document: ', change.doc.data());
                    const data = change.doc.data()
                    const id = change.doc.id
                    const issue = (await dataset).filter((p: any) => p.id == id)[0]
                    Object.keys(data).forEach(key => {
                        (issue as any)[key] = data[key]
                    })
                }
                if (change.type === 'removed') {
                    console.log('Removed document: ', change.doc.data());
                    // @TODO
                }
            });
        });
    }
    return results
}


export async function saveDoc(doc: FirestoreRecord) {
    const id = createDocId(doc.githubIssueUrl)
    console.log(`Update ${collectionName}/${id}`)
    const docRef = db.doc(`${collectionName}/${id}`)
    await docRef.set(doc, {merge: true})
}

