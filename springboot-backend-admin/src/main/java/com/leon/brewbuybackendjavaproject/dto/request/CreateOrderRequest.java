package com.leon.brewbuybackendjavaproject.dto.request;

import java.util.List;

public class CreateOrderRequest {
    private Long userId;
    private List<OrderItemRequest> items;
    
    // Constructors
    public CreateOrderRequest() {}
    
    public CreateOrderRequest(Long userId, List<OrderItemRequest> items) {
        this.userId = userId;
        this.items = items;
    }
    
    // Getters and Setters
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public List<OrderItemRequest> getItems() {
        return items;
    }
    
    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}