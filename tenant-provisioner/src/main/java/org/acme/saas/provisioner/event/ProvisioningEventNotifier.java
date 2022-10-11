package org.acme.saas.provisioner.event;

import java.net.URI;
import java.util.UUID;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.core.MediaType;

import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;

import com.fasterxml.jackson.databind.ObjectMapper;

import io.cloudevents.CloudEvent;
import io.cloudevents.CloudEventData;
import io.cloudevents.core.builder.CloudEventBuilder;
import io.cloudevents.core.data.PojoCloudEventData;

@ApplicationScoped
public class ProvisioningEventNotifier {
    public static final String EVENT_SOURCE = "tenant-provisioner";
    private static final Logger log = Logger.getLogger(ProvisioningEventNotifier.class);
    @ConfigProperty(name = "k-sink")
    String brokerUrl;

    @Inject
    @RestClient
    EventNotifier eventNotifier;

    @Inject
    ObjectMapper mapper;

    public void emitProvisioningStatus(NewTenantRequest newTenantRequest, ProvisioningRequestStatus.Status status) {
        CloudEvent event = CloudEventBuilder.v1()
                .withSource(URI.create(EVENT_SOURCE))
                .withType(ProvisioningRequestStatus.EVENT_TYPE)
                .withId(UUID.randomUUID().toString())
                .withDataContentType(MediaType.APPLICATION_JSON)
                .withData(createProvisioningStatus(newTenantRequest, status))
                .build();
        log.infof("Emitting provisioning request event for %s/%s, with status %s to %s", newTenantRequest.getTenantName(),
                newTenantRequest.getTenandId(), status, brokerUrl);
        eventNotifier.emit(event);
    }

    private CloudEventData createProvisioningStatus(NewTenantRequest newTenantRequest,
            ProvisioningRequestStatus.Status status) {
        ProvisioningRequestStatus provisioningRequestStatus = ProvisioningRequestStatus.builder()
                .tenandId(newTenantRequest.getTenandId())
                .tenantName(newTenantRequest.getTenantName()).status(status).build();
        return PojoCloudEventData.wrap(provisioningRequestStatus, mapper::writeValueAsBytes);
    }

    public void emitResourceProvisioningStatus(NewTenantRequest newTenantRequest, String resourceName, String resourcetype,
            ResourceProvisioningStatus.Status status) {
        CloudEvent event = CloudEventBuilder.v1()
                .withSource(URI.create(EVENT_SOURCE))
                .withType(ResourceProvisioningStatus.EVENT_TYPE)
                .withId(UUID.randomUUID().toString())
                .withDataContentType(MediaType.APPLICATION_JSON)
                .withData(createResourceProvisioningStatus(newTenantRequest, resourceName, resourcetype, status))
                .build();
        log.debugf("Emitting %s", event);
        log.infof("Emitting resouce provisioning event for %s/%s, with status %s to %s", resourceName, resourcetype, status,
                brokerUrl);
        eventNotifier.emit(event);
    }

    private CloudEventData createResourceProvisioningStatus(NewTenantRequest newTenantRequest,
            String resourceName, String resourcetype, ResourceProvisioningStatus.Status status) {
        ResourceProvisioningStatus resourceProvisioningStatus = ResourceProvisioningStatus.builder()
                .tenandId(newTenantRequest.getTenandId())
                .resourceName(resourceName).resourceType(resourcetype).status(status).build();
        return PojoCloudEventData.wrap(resourceProvisioningStatus, mapper::writeValueAsBytes);
    }
}
