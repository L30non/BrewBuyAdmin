package com.leon.brewbuybackendjavaproject.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.leon.brewbuybackendjavaproject.Model.Product;
import com.leon.brewbuybackendjavaproject.Service.ProductService;

import java.util.List;


@RestController
@RequestMapping("/api/products")
@CrossOrigin("*") // allow Android access
public class ProductController {

    @Autowired
    private ProductService productService;



    @GetMapping
    public List<Product> getAll() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getProductById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productService.deleteProduct(id);
    }
}

