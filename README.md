# Camunda Platform 8.3.0 Release Notes

<!-- vscode-markdown-toc -->
* 1. [Enhancements](#Enhancements)
	* 1.1. [Java Client](#JavaClient)
		* 1.1.1. [Configurable inbound `max_message_size`](#Configurableinboundmax_message_size)
	* 1.2. [Broker](#Broker)
		* 1.2.1. [Support Signal Intermediate Throw and End events](#SupportSignalIntermediateThrowandEndevents)
		* 1.2.2. [OAuth Identity Authentication added to Zeebe Gateway](#OAuthIdentityAuthenticationaddedtoZeebeGateway)
		* 1.2.3. [Removed JVM default -Xms128 for Docker image](#RemovedJVMdefault-Xms128forDockerimage)
* 2. [Bug Fixes](#BugFixes)
		* 2.1. [Simultaneously expiring messages stop partition processing](#Simultaneouslyexpiringmessagesstoppartitionprocessing)
		* 2.2. [Terminating a process instance with many child elements fails, blacklisting instance or causing an OOM exception](#TerminatingaprocessinstancewithmanychildelementsfailsblacklistinginstanceorcausinganOOMexception)
		* 2.3. [Listing backups fails if more than 255 backups are available](#Listingbackupsfailsifmorethan255backupsareavailable)
		* 2.4. [Broker will not start when S3 backup store configured and credentials in AWS provider chain](#BrokerwillnotstartwhenS3backupstoreconfiguredandcredentialsinAWSproviderchain)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

# Zeebe

##  1. <a name='Enhancements'></a>Enhancements

###  1.1. <a name='JavaClient'></a>Java Client

####  1.1.1. <a name='Configurableinboundmax_message_size'></a>Configurable inbound `max_message_size`

The Java Client had `maxInboundMessageSize` for the gRPC channel hardcoded to 4MB. 

As a result, when creating a process instance `.withResult()`, the Java client would throw an error upon the process completion, as it could not receive a variable payload in excess of 4MB as the process instance outcome. 

With the 8.3.0 release, the `maxInboundMessageSize` has been made configurable via one of environment variable, configuration property, or using the Java API. By default it is set to 4MB. 

Developers can now set a larger maximum message size and retrieve the outcome of process instances where the variable size is greater than 4MB. 

*Keep in mind that passing large variable payloads into the workflow engine has an impact on broker performance and resource usage.*

For more details see issue [#12122](https://github.com/camunda/zeebe/issues/12122) and pull request [#11902](https://github.com/camunda/zeebe/pull/11902).

###  1.2. <a name='Broker'></a>Broker

####  1.2.1. <a name='SupportSignalIntermediateThrowandEndevents'></a>Support Signal Intermediate Throw and End events

Signal events could be broadcast from a client library over the gRPC API, but not from within BPMN itself. 

With this release, Signal Intermediate Throw and Signal End events are implemented. Now users can deploy models that use these events, and a signal will be broadcast to all running process instances when the event is processed.

*Note that creating models with these events requires the latest version of Camunda Modeler.*

See issue [#11918](https://github.com/camunda/zeebe/issues/11918) and [#3555](https://github.com/camunda/camunda-modeler/issues/3555) for more details.

####  1.2.2. <a name='OAuthIdentityAuthenticationaddedtoZeebeGateway'></a>OAuth Identity Authentication added to Zeebe Gateway

The Zeebe Gateway did not implement any support for OAuth. Implementing OAuth authentication for a Zeebe Gateway traditionally required deploying a separate reverse proxy in front of the Gateway. 

With this release, we have implemented OAuth authentication in the Gateway (not authorization - *yet*). This is disabled by default, and can be activated via configuration.

For more details, see issue [#12000](https://github.com/camunda/zeebe/issues/12000) and pull request [#12001](https://github.com/camunda/zeebe/pull/12001).

####  1.2.3. <a name='RemovedJVMdefault-Xms128forDockerimage'></a>Removed JVM default -Xms128 for Docker image

The Docker image for Zeebe had a hardcoded `-Xms128` as a JVM startup parameter.  Consequently, users could not override this parameter with a custom value in `JAVA_OPTS`. 

With this release, the hardcoded value has been removed. The Docker image now uses the JVM default, and the parameter is available for override by users. 

This change has also been backported to 8.0.14 and 8.1.11 and 8.2.3. 

Thanks to Alexey Vinogradov for the contribution. 

For more details see issue [#12416](https://github.com/camunda/zeebe/issues/12416) and pull request [#12482](https://github.com/camunda/zeebe/pull/12482).

##  2. <a name='BugFixes'></a>Bug Fixes

####  2.1. <a name='Simultaneouslyexpiringmessagesstoppartitionprocessing'></a>Simultaneously expiring messages stop partition processing

In 8.1.9 we introduced a regression that performs an unsafe concurrent access to a writer of a shared record value. When this occurs, a message similar to `java.lang.RuntimeException: Could not deserialize object [MessageRecord]. Deserialization stuck at offset 24 of length 69` is observed in the broker log. 

This error causes the processing actor to fail on a partition when two messages expire at the same time. The effect of this depends on the broker configuration. By default,  all processing is stopped on the partition until the broker is restarted or another leader is elected for the partition. On the other hand, if the (experimental) feature flag `enableMessageTtlCheckerAsync` is enabled, then processing continues on the partition, with the exception of further message expirations, which are not processed. 

In this release, access to the shared record is managed to make it thread-safe. As a result, simultaneously expiring messages no longer cause a processing failure on a partition.

This fix has been backported to 8.1.11 and 8.2.3.

For more details see issue [#12509](https://github.com/camunda/zeebe/issues/12509) and pull request [#12510](https://github.com/camunda/zeebe/pull/12510).

####  2.2. <a name='TerminatingaprocessinstancewithmanychildelementsfailsblacklistinginstanceorcausinganOOMexception'></a>Terminating a process instance with many child elements fails, blacklisting instance or causing an OOM exception

Terminating a process instance was done by sending a terminate command to every child element. If a process instance had many child elements, this could cause an exception. This exception would lead to the process instance being blacklisted, or - with sufficient child elements - would cause an OOM exception.

This release implements a new batching system for the termination command that significantly reduces the resource requirement. A large class of process instances with many child elements that caused errors on termination will now terminate without issue.

Note that terminating process instances with deeply nested child elements is not addressed by this feature. 

For further details see issue [#12485](https://github.com/camunda/zeebe/issues/12485).

####  2.3. <a name='Listingbackupsfailsifmorethan255backupsareavailable'></a>Listing backups fails if more than 255 backups are available

The number of backups was stored as a `uint8`. When querying the list of broker backups over the `actuator/backups` endpoint, if there were more than 255 backups, the call would fail.

In this release, the number of backups is stored as a `uint16`, allowing for a theoretical maximum of 65535 backups to be stored and listed. Note that we do not recommend approaching this limit, due to resource and performance constraints.

For more details, see issue [#12597](https://github.com/camunda/zeebe/issues/12597).

####  2.4. <a name='BrokerwillnotstartwhenS3backupstoreconfiguredandcredentialsinAWSproviderchain'></a>Broker will not start when S3 backup store configured and credentials in AWS provider chain

Due to a regression introduced in 8.1.9, when a broker had the (experimental) backup feature enabled and set to `S3`, if the S3 secrets were in the AWS provider chain, rather than environment variables, the broker will fail to start.

In this release, the breaking change has been fixed, and the broker correctly loads the secrets from the AWS provider chain in this case. 

For more details, see issue [#12433](https://github.com/camunda/zeebe/issues/12433).