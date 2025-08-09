package com.leon.brewbuybackendjavaproject.Repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.leon.brewbuybackendjavaproject.Model.Product;


public interface ProductRepository extends JpaRepository<Product, Long> {
}

