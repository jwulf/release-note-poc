import {Operate} from "camunda-8-sdk"
import dotenv from "dotenv"
import * as db from "./database"
import { FirestoreRecord } from "./dataschema"

dotenv.config()

const operate = new Operate.OperateApiClient()

async function main() {
    console.log(`Retrieving records from Firestore`)
    const docs = await db.getAll(false)
    console.log(`Retrieved ${docs.length} records`)
    console.log(`Retrieving active instances from Operate`)
    const activeInstances = await operate.searchProcessInstances({
        filter: { 
            state: 'ACTIVE',
        }
    })
    console.log(`Retrieved ${activeInstances.total} active instances`)
    console.log(`Retrieving completed instances from Operate`)
    const completedInstances = await operate.searchProcessInstances({
        filter: { 
            state: 'COMPLETED',
        }
    })
    console.log(`Retrieved ${completedInstances.total} active instances`)
    console.log(`Retrieving variables for process instances`)
    const existing = [...(await getFirestoreKeys(activeInstances)), ...(await getFirestoreKeys(completedInstances))]
    const toCreate: FirestoreRecord[] = []
    let doNotIncludeCount = 0
    for (const doc of docs) {
        if (!existing.includes(doc.id)) {
            if (doc.includeInReleaseNotes) {
                toCreate.push(doc)
            }
            else {
                doNotIncludeCount++
            }
        }
    }
    console.log(`There were ${activeInstances.total} active process instances, and ${completedInstances.total} completed instances`)
    console.log(`There are ${docs.length} issues in the release notes database`)
    console.log(`There are ${doNotIncludeCount} issues that are marked "do not include"`)
    console.log(`And we are ready to create ${toCreate.length} process instances`)
}

async function getFirestoreKeys(processes: Operate.SearchResults<Operate.ProcessInstance>) {
    console.log(`Retrieving variables for ${processes.total} process instances`)
    const keys: string[] = []
    for (const p of processes.items) {
        const id = parseInt(p.bpmnProcessId, 10)
        const vars = await operate.getVariablesforProcess(id)
        const k = vars.items.filter(v => v.name == 'id')
        keys.push(k[0].value)
    }
    return keys
}

main()