# Issues

Taken from [the releases page](https://github.com/camunda/camunda-platform/releases).


Java Client

* Configure the client's inbound max_message_size ([#12122](https://github.com/camunda/zeebe/issues/12122))

Misc

* Use the ProcessInstanceBatch Command when terminating container elements ([#12538](https://github.com/camunda/zeebe/issues/12538))
* Create ProcessInstanceBatch Record and Intent ([#12537](https://github.com/camunda/zeebe/issues/12537))
* Remove the default un-overridable -Xms128m value ([#12416](https://github.com/camunda/zeebe/issues/12416))
* OAuth Auth Token authentication support in Zeebe Gateway ([#12000](https://github.com/camunda/zeebe/issues/12000))
* Support Broadcast signal for Signal End Events ([#11920](https://github.com/camunda/zeebe/issues/11920))
* Support Broadcast signal for Signal Intermediate Throw Events ([#11919](https://github.com/camunda/zeebe/issues/11919))

Bug Fixes

Misc

* List backup fails when a partition has same backup taken by multiple nodes ([#12622](https://github.com/camunda/zeebe/issues/12622))
* Listing backups fails if more than 255 backups are available ([#12597](https://github.com/camunda/zeebe/issues/12597))
* MessageTTL checking fails with deserialization errors ([#12509](https://github.com/camunda/zeebe/issues/12509))
* Broker cannot start with S3 accessKey and secretKey not supplied ([#12433](https://github.com/camunda/zeebe/issues/12433))
* Cannot disable Raft flush without specifying a delay ([#12328](https://github.com/camunda/zeebe/issues/12328))
* The newThrowErrorCommand incorrectly handled in 8.2.0 ([#12326](https://github.com/camunda/zeebe/issues/12326))
* Zeebe node sends messages to wrong node ([#12173](https://github.com/camunda/zeebe/issues/12173))
* Triggering due timer events causes periodic latency spikes ([#11594](https://github.com/camunda/zeebe/issues/11594))
* Unhandled NoSuchElementException when looking for executable process while deploying BPMN resource ([#11414](https://github.com/camunda/zeebe/issues/11414))
* Not possible to cancel process instance with many active element instances ([#11355](https://github.com/camunda/zeebe/issues/11355))

## Maintenance

* Renovate fails updating docker digest (#12577)
* Smoke tests fail due to full code cache (#12469)
* Allow listening for updates in BrokerTopologyListener (#12387)
* Try pushing activated job to next logical stream on failure before yielding (#12386)
* Additional job push metrics (#12384)
* Broadcasting for available jobs is done as a processor side-effect (#12083)
* The JobStreamer API is available to the engine processors (#12082)
* Unnecessary Blacklist checks (#12041)
* Build and test pipeline takes too long (#12028)
* Add gRPC stream API gateway implementation (#11713)
* Introduce job receiver in the gateway (#11712)

## Merged Pull Requests

* fix: list backup can handle duplicate backupids of a partition (#12624)
* fix: brokers can list more than 255 backups (#12621)
* [Backport release-8.3.0-alpha1] Process ProcessInstanceBatch.TERMINATE commands (#12610)
* Terminate children using the new ProcessInstanceBatch command (#12604)
* Bump TCC concurrency to stabilize IT stage (#12534)
* Aggregate equivalent client streams (#12402)
* deps(maven): bump reactive-streams from 1.0.3 to 1.0.4 (#12263)
* Updated Slack and forum link (#12174)
* docs(CONTRIBUTING): update "Starting on an issue" steps (#12170)

# Operate

## 🚀 New Features

* backend: Divide large bulk requests into smaller ones. (#4450)
* backend: REST API - Return 403 in Get single variable endpoint (#4323)
* enable search feature for process names, flow nodes and decisions (#4406)
* feature-flagged: add decision filter combo boxes (#4367)
* add carbon routes (#4314)
* feature-flagged: replace flow node dropdown by combobox (#4342)
* feature-flagged: replace process version dropdown by combobox (#4337)
* feature-flagged: replace process name dropdown by combobox (#4325)

## 💊 Bugfixes

* pom.xml to reduce vulnerabilities (#4333)
backend: use empty list as default for null value in map (#4455)
* backend: Use Public API ErrorController in BackupController (#4453)
* consume CAMUNDA_OPERATE_IDENTITY_REDIRECT_ROOT_URL from env vars (#4351)
* docker labels verification (#4444)
* fix broken carbon layer colors
* import: correctly process possible duplicates when import reread (#4424)
* deps: update dependency sass to v1.62.0 (#4423)
* deps: update dependency mobx to v6.9.0 (#4422)
* deps: update dependency @carbon/elements to v11.21.0 (#4419)
* deps: update dependency @carbon/react to v1.27.0 (#4420)
* replace version combobox by dropdown (#4385)
* * backend: Failures ignored reading records from Zeebe aliases (#4361)

## 🧹 Chore
* 
* backend: Update Zeebe and Identity to 8.3.0-alpha1 (#4476)
* els/repo: remove not needed refresh when getting session (#4478)
* lazy load carbon pages (#4466)
* adjust operations panel and entry tests (#4452)
* convert operation panel skeleton to carbon (#4451)
* add empty and error states to operations panel (#4449)
* add progress bar and change background for running operations (#4438)
* convert operation entry to carbon (#4437)
* add decision state checkboxes to carbon filter panel (#4435)
* add padding to section title (#4447)
* fix layering (#4443)
* processes layout (#4446)
* add decisions fields to carbon filter panel (#4433)
* ui improvements for carbon data table (#4426)
* support loading state for carbon data table (#4412)
* add skeleton state for carbon data table (#4408)
* empty and error state for data table (#4407)
* support infinite scroll in carbon data table (#4405)
* add sorting to carbon datatable (#4404)
* backend: docker-compose for testing without identity
* backend: tiny logs cleanup (#4432)
* Update Browserlist DB
* update monaco editor (#4417)
* data table link and icon (#4402)
* add carbon data table (#4401)
* deps: update dependency testcafe to v2.5.0 (#4414)
* deps: update dependency @testing-library/dom to v9.2.0 (#4396)
* deps: update actions/add-to-project action to v0.5.0 (#4390)
* deps: update dependency typescript to v5 (#4287)
* deps: update amannn/action-semantic-pull-request action to v5 (#4178)
* support overflowing collapsable panel (#4391)
* add collapsable panel with carbon stylings ([#4389](https://github.com/camunda/operate/issues/4389))
* create static panel header with carbon [#4384](https://github.com/camunda/operate/issues/4384)
