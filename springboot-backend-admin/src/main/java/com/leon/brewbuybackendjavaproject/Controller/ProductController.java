package com.leon.brewbuybackendjavaproject.Controller;

import org.springframework.web.bind.annotation.*;

import com.leon.brewbuybackendjavaproject.Model.Product;
import com.leon.brewbuybackendjavaproject.Repo.ProductRepository;

import java.util.List;


@RestController
@RequestMapping("/api/products")
@CrossOrigin("*") // allow Android access
public class ProductController {

    private final ProductRepository repo;

    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Product> getAll() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        return repo.save(product);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        Product existing = repo.findById(id).orElseThrow();
        existing.setName(product.getName());
        existing.setPrice(product.getPrice());
        existing.setQuantity(product.getQuantity());
        existing.setDescription(product.getDescription());
        return repo.save(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}

