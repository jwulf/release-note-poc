# Release Automation

To get the latest releases from GitHub:

```
ts-node get-releases.ts
```

This will create three files:

```
rel-8.1.json
rel-8.2.json
rel-8.3.json
```

To generate the combined report:

```
ts-node compare-releases.ts
```

This will generate the file `rel-8.3.report.json`.