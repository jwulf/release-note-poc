# Release Automation

Run this when a new 8.3 alpha or 8.2/8.1 point release comes out: 

* To get the latest releases from GitHub:

```
ts-node get-releases.ts
```

This will create three files:

```
rel-8.1.json
rel-8.2.json
rel-8.3.json
```

* To generate the combined report:

```
ts-node compare-releases.ts
```

This will generate the file `rel-8.3.report.json`.

* Now run this to upsert issues to the Firestore database:

```bash
ts-node create-db-entries.ts
```

* Now run this:

```bash
ts-node app.ts
```

Open [https://localhost:3000/releases](https://localhost:3000/releases) and triage the issues in the new release. You can de/select "Include in release". Anything that is "do not include in release" will not be created as a process.

* Create process instances, by running:

```bash
ts-node create-process-instances.ts
```



## GitHub Token

It needs a GitHub personal access token with the following permissions:

``` 
repo
```

And SSO authorization for the Camunda GitHub organisations.