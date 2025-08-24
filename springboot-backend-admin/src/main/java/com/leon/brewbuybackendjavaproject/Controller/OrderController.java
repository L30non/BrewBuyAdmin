package com.leon.brewbuybackendjavaproject.Controller;

import com.leon.brewbuybackendjavaproject.Model.Order;
import com.leon.brewbuybackendjavaproject.Model.OrderItem;
import com.leon.brewbuybackendjavaproject.Model.User;
import com.leon.brewbuybackendjavaproject.Service.OrderService;
import com.leon.brewbuybackendjavaproject.Service.UserService;
import com.leon.brewbuybackendjavaproject.dto.request.CreateOrderRequest;
import com.leon.brewbuybackendjavaproject.dto.response.OrderResponse;
import com.leon.brewbuybackendjavaproject.security.SecurityUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private SecurityUtil securityUtil;
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        // Get the currently authenticated user
        String username = securityUtil.getCurrentUsername();
        if (username == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        // Get user by username
        Optional<User> userOptional = userService.getUserByUsername(username);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        Long userId = userOptional.get().getId();
        
        // Convert request items to OrderItems
        List<OrderItem> orderItems = request.getItems().stream()
            .map(item -> new OrderItem(null, item.getProductId(), item.getQuantity(), item.getPrice()))
            .collect(Collectors.toList());
        
        // Create order
        Order order = orderService.createOrder(userId, orderItems);
        
        // Convert to response
        OrderResponse response = new OrderResponse(order);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {
        // Get the currently authenticated user
        String username = securityUtil.getCurrentUsername();
        if (username == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        // Get user by username
        Optional<User> userOptional = userService.getUserByUsername(username);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        Long userId = userOptional.get().getId();
        
        // Get order and verify it belongs to the user
        try {
            Order order = orderService.getOrderByIdAndUserId(id, userId);
            OrderResponse response = new OrderResponse(order);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    
    @GetMapping("/user/me")
    public ResponseEntity<List<OrderResponse>> getMyOrders() {
        // Get the currently authenticated user
        String username = securityUtil.getCurrentUsername();
        if (username == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        // Get user by username
        Optional<User> userOptional = userService.getUserByUsername(username);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        Long userId = userOptional.get().getId();
        
        List<Order> orders = orderService.getOrdersByUserId(userId);
        List<OrderResponse> responses = orders.stream()
            .map(OrderResponse::new)
            .collect(Collectors.toList());
        return new ResponseEntity<>(responses, HttpStatus.OK);
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id, @RequestParam String status) {
        // Get the currently authenticated user
        String username = securityUtil.getCurrentUsername();
        if (username == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        // Get user by username
        Optional<User> userOptional = userService.getUserByUsername(username);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        Long userId = userOptional.get().getId();
        
        // Update order status
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, userId, status);
            OrderResponse response = new OrderResponse(updatedOrder);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        // Get the currently authenticated user
        String username = securityUtil.getCurrentUsername();
        if (username == null) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        // Get user by username
        Optional<User> userOptional = userService.getUserByUsername(username);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        
        Long userId = userOptional.get().getId();
        
        // Delete order
        try {
            orderService.deleteOrder(id, userId);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
    }
}