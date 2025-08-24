package com.leon.brewbuybackendjavaproject.Controller;

import com.leon.brewbuybackendjavaproject.Model.Product;
import com.leon.brewbuybackendjavaproject.Service.ProductService;
import com.leon.brewbuybackendjavaproject.dto.request.ProductRequest;
import com.leon.brewbuybackendjavaproject.dto.response.ProductResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*") // allow Android access
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<ProductResponse> getAll() {
        return productService.getAllProducts().stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ProductResponse getById(@PathVariable Long id) {
        Product product = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return new ProductResponse(product);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@RequestBody ProductRequest productRequest) {
        // Create a new product entity
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());
        
        // Handle image data if provided
        if (productRequest.getImageBase64() != null && !productRequest.getImageBase64().isEmpty()) {
            try {
                byte[] imageData = Base64.getDecoder().decode(productRequest.getImageBase64());
                product.setImageData(imageData);
                product.setImageType(productRequest.getImageType());
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }
        
        // Save the product
        Product savedProduct = productService.createProduct(product);
        ProductResponse response = new ProductResponse(savedProduct);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/batch")
    public List<ProductResponse> createMultiple(@RequestBody List<ProductRequest> productRequests) {
        List<Product> products = productRequests.stream().map(request -> {
            Product product = new Product();
            product.setName(request.getName());
            product.setDescription(request.getDescription());
            product.setPrice(request.getPrice());
            product.setQuantity(request.getQuantity());
            
            // Handle image data if provided
            if (request.getImageBase64() != null && !request.getImageBase64().isEmpty()) {
                try {
                    byte[] imageData = Base64.getDecoder().decode(request.getImageBase64());
                    product.setImageData(imageData);
                    product.setImageType(request.getImageType());
                } catch (Exception e) {
                    // If image processing fails, create product without image
                }
            }
            
            return product;
        }).collect(Collectors.toList());
        
        List<Product> savedProducts = productService.createProducts(products);
        return savedProducts.stream()
                .map(ProductResponse::new)
                .collect(Collectors.toList());
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @RequestBody ProductRequest productRequest) {
        Product product = productService.getProductById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setName(productRequest.getName());
        product.setDescription(productRequest.getDescription());
        product.setPrice(productRequest.getPrice());
        product.setQuantity(productRequest.getQuantity());
        
        // Handle image data if provided
        if (productRequest.getImageBase64() != null && !productRequest.getImageBase64().isEmpty()) {
            try {
                byte[] imageData = Base64.getDecoder().decode(productRequest.getImageBase64());
                product.setImageData(imageData);
                product.setImageType(productRequest.getImageType());
            } catch (Exception e) {
                // If image processing fails, continue with other updates
            }
        }
        
        Product updatedProduct = productService.updateProduct(id, product);
        return new ProductResponse(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}

