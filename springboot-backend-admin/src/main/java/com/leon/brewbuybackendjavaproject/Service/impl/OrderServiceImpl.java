package com.leon.brewbuybackendjavaproject.Service.impl;

import com.leon.brewbuybackendjavaproject.Model.Order;
import com.leon.brewbuybackendjavaproject.Model.OrderItem;
import com.leon.brewbuybackendjavaproject.Repo.OrderRepository;
import com.leon.brewbuybackendjavaproject.Repo.OrderItemRepository;
import com.leon.brewbuybackendjavaproject.Service.OrderService;
import com.leon.brewbuybackendjavaproject.exception.OrderNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Override
    public Order createOrder(Long userId, List<OrderItem> orderItems) {
        // Calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (OrderItem item : orderItems) {
            totalAmount = totalAmount.add(item.getPrice().multiply(new BigDecimal(item.getQuantity())));
        }
        
        // Create order
        Order order = new Order(userId, totalAmount, "PENDING");
        Order savedOrder = orderRepository.save(order);
        
        // Save order items
        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
            orderItemRepository.save(item);
        }
        
        return savedOrder;
    }
    
    @Override
    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }
    
    @Override
    public Order getOrderByIdAndUserId(Long id, Long userId) {
        return orderRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new OrderNotFoundException(id));
    }
    
    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }
    
    @Override
    public Order updateOrderStatus(Long id, Long userId, String status) {
        // Verify the order belongs to the user
        Order order = getOrderByIdAndUserId(id, userId);
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    @Override
    public void deleteOrder(Long id, Long userId) {
        // Verify the order belongs to the user
        getOrderByIdAndUserId(id, userId);
        orderRepository.deleteById(id);
    }
}