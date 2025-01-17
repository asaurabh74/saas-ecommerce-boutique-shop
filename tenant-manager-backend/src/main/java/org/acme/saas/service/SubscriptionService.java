package org.acme.saas.service;

import io.quarkus.hibernate.reactive.panache.common.runtime.ReactiveTransactional;
import io.smallrye.mutiny.Uni;
import org.acme.saas.model.Request;
import org.acme.saas.model.Subscription;
import org.acme.saas.model.data.SubscriptionSummaryData;
import org.acme.saas.model.draft.RequestDraft;
import org.acme.saas.model.draft.SubscriptionDraft;
import org.acme.saas.model.draft.TenantDraft;
import org.acme.saas.model.mappers.SubscriptionMapper;
import org.jboss.logging.Logger;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.InternalServerErrorException;
import java.util.List;
import java.util.function.Function;

@ApplicationScoped
public class SubscriptionService {
    private Logger log = Logger.getLogger(SubscriptionService.class);

    @Inject
    RequestService requestService;
    @Inject
    ProvisionService provisionService;

    @ReactiveTransactional
    public Uni<Subscription> findFirstByTenantKey(String tenantKey) {
        return Subscription.findFirstByTenantKey(tenantKey);
    }

    @ReactiveTransactional
    public Uni<List<Subscription>> findAllByTenantKey(String tenantKey) {
        return Subscription.findAllByTenantKey(tenantKey);
    }

    public double calculatePrice(String tier, int avgConcurrentShoppers) {
        return switch (tier) {
            case "Silver" -> (avgConcurrentShoppers / 100.0) * 10;
            case "Gold" -> (avgConcurrentShoppers / 100.0) * 20;
            case "Premium" -> (avgConcurrentShoppers / 100.0) * 40;
            default -> 0.0;
        };
    }

    public int[] calculateInstanceCount(int avgConcurrentShoppers, int peakConcurrentShoppers) {
        int min = avgConcurrentShoppers / 50;
        int max = peakConcurrentShoppers / 50;

        return new int[]{min, max};
    }

    @ReactiveTransactional
    public Uni<Subscription> createNewSubscription(TenantDraft tenantDraft, SubscriptionDraft subscriptionDraft,
                                                   RequestDraft requestDraft) {

        Uni<Request> requestUni = requestService.createNewRequest(requestDraft);
        Uni<String> serviceUrlUni = provisionService.onNewSubscription(tenantDraft, requestDraft);

        return Uni.combine().all().unis(requestUni, serviceUrlUni).combinedWith(
                        (request, serviceUrl) -> {
                            Subscription subscription = SubscriptionMapper.INSTANCE
                                    .subscriptionDraftToSubscription(subscriptionDraft);

                            subscription.request = request;
                            subscription.url = serviceUrl;
                            return subscription.<Subscription>persist();
                        }
                )
                .onItem().ifNull().failWith(InternalServerErrorException::new)
                .flatMap(Function.identity());
    }


    public Uni<List<SubscriptionSummaryData>> getSubscriptionSummary() {
        return Subscription.getSubscriptionSummary();
    }
}
