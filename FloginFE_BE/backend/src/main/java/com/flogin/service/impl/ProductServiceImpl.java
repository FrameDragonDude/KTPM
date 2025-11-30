package com.flogin.service.impl;

import com.flogin.dto.ProductDTO;
import com.flogin.model.Product;
import com.flogin.repository.ProductRepository;
import com.flogin.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation của ProductService interface
 * Chứa business logic xử lý các operations liên quan đến Product
 * 
 * @Service: Đánh dấu đây là Spring service bean
 */
@Service
public class ProductServiceImpl implements ProductService {

    /**
     * Repository để tương tác với database
     * Inject qua constructor (recommended practice)
     */
    private final ProductRepository productRepository;

    /**
     * Constructor injection cho ProductRepository
     * Spring tự động inject ProductRepository bean
     */
    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Tạo sản phẩm mới
     * @Transactional: Đảm bảo operation này chạy trong transaction
     * 
     * @param dto ProductDTO chứa thông tin sản phẩm
     * @return ProductDTO của sản phẩm vừa tạo (có ID)
     */
    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO dto) {
        // Chuyển DTO thành Entity
        Product product = Product.builder()
            .name(dto.getName())
            .description(dto.getDescription())
            .price(dto.getPrice())
            .quantity(dto.getQuantity())
            .category(dto.getCategory())
            .build();
        // Save vào database và chuyển kết quả thành DTO
        return toDTO(productRepository.save(product));
    }

    /**
     * Lấy danh sách tất cả sản phẩm
     * 
     * @return List<ProductDTO> chứa tất cả products
     */
    @Override
    public List<ProductDTO> getAllProducts() {
        // Lấy tất cả products từ DB, convert mỗi Product thành ProductDTO
        return productRepository.findAll()
                .stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Lấy thông tin chi tiết 1 sản phẩm theo ID
     * 
     * @param id ID của sản phẩm cần lấy
     * @return ProductDTO của sản phẩm
     * @throws RuntimeException nếu không tìm thấy product
     */
    @Override
    public ProductDTO getProductById(int id) {
        // findById trả về Optional<Product>
        // orElseThrow: throw exception nếu không tìm thấy
        Product p = productRepository.findById(id)
            .orElseThrow(() -> new com.flogin.exception.ResourceNotFoundException("Product not found with id: " + id));
        return toDTO(p);
    }

    /**
     * Cập nhật thông tin sản phẩm
     * @Transactional: Đảm bảo update chạy trong transaction
     * 
     * @param id ID của sản phẩm cần update
     * @param dto ProductDTO chứa thông tin mới
     * @return ProductDTO đã được update
     * @throws RuntimeException nếu không tìm thấy product
     */
    @Override
    @Transactional
    public ProductDTO updateProduct(int id, ProductDTO dto) {
        // Tìm product theo ID
        Product p = productRepository.findById(id)
            .orElseThrow(() -> new com.flogin.exception.ResourceNotFoundException("Product not found with id: " + id));
        // Update các fields
        p.setName(dto.getName());
        p.setDescription(dto.getDescription());
        p.setPrice(dto.getPrice());
        p.setQuantity(dto.getQuantity());
        p.setCategory(dto.getCategory());
        // Save và return DTO
        return toDTO(productRepository.save(p));
    }

    /**
     * Xóa sản phẩm theo ID
     * @Transactional: Đảm bảo delete chạy trong transaction
     * 
     * @param id ID của sản phẩm cần xóa
     * @throws RuntimeException nếu không tìm thấy product
     */
    @Override
    @Transactional
    public void deleteProduct(int id) {
        // Kiểm tra product có tồn tại không
        if (!productRepository.existsById(id)) {
            throw new com.flogin.exception.ResourceNotFoundException("Product not found with id: " + id);
        }
        // Xóa product
        productRepository.deleteById(id);
    }

    /**
     * Helper method: Convert Product entity thành ProductDTO
     * Sử dụng Builder pattern để tạo DTO
     * 
     * @param p Product entity
     * @return ProductDTO
     */
    private ProductDTO toDTO(Product p) {
        return ProductDTO.builder()
            .id(p.getId())
            .name(p.getName())
            .description(p.getDescription())
            .price(p.getPrice())
            .quantity(p.getQuantity())
            .category(p.getCategory())
            .build();
    }
}
