package com.leon.brewbuybackendjavaproject.Service;

import com.leon.brewbuybackendjavaproject.Model.Order;
import com.leon.brewbuybackendjavaproject.Model.OrderItem;
import java.util.List;

public interface OrderService {
    Order createOrder(Long userId, List<OrderItem> orderItems);
    Order getOrderById(Long id);
    Order getOrderByIdAndUserId(Long id, Long userId);
    List<Order> getOrdersByUserId(Long userId);
    Order updateOrderStatus(Long id, Long userId, String status);
    void deleteOrder(Long id, Long userId);
}