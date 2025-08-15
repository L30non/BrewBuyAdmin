package com.leon.brewbuybackendjavaproject.Service;

import com.leon.brewbuybackendjavaproject.Model.Product;
import java.util.List;
import java.util.Optional;

public interface ProductService {
    List<Product> getAllProducts();
    Optional<Product> getProductById(Long id);
    Product createProduct(Product product);
    List<Product> createProducts(List<Product> products);
    Product updateProduct(Long id, Product product);
    void deleteProduct(Long id);
}
