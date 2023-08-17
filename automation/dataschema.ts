type ReleaseNoteType = 'Enhancement' | 'Bug Fix' | 'Breaking Change'
type Component = 'Zeebe Broker' | 'Zeebe Client' | 'Operate' | 'Tasklist' | 'Optimize' | 'Identity'

export interface FirestoreRecord {
    targetReleaseVersion: string
    releasedInVersion: string
    component: Component
    releaseNoteType: ReleaseNoteType
    githubIssueTitle: string
    githubIssueUrl: string
    relatedIssues: string
    includeInReleaseNotes: boolean
    releaseNoteTitle: string
    releaseNoteText: string
    needsMoreInfo: boolean
    engineeringFeedback: string
    reviewedEngineering: boolean
    pmFeedback: string
    reviewedPM: boolean
}