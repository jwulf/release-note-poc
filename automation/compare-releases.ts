import fs from 'fs'

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
    return {...i, also_in}
})
fs.writeFileSync('rel-8.3.report.json', JSON.stringify(release_report, null, 2))