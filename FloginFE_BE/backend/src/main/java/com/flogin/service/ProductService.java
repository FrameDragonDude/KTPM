package com.flogin.service;

import com.flogin.dto.ProductDTO;
import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductDTO dto);
    List<ProductDTO> getAllProducts();
    ProductDTO getProductById(int id);
    ProductDTO updateProduct(int id, ProductDTO dto);
    void deleteProduct(int id);
}
