package handler

import (
	"net/http"

	"github.com/azrilpramudia/himatif-uninus/internal/service"

	"github.com/gin-gonic/gin"
)

type GalleryHandler struct {
	service service.GalleryService
}

func NewGalleryHandler(service service.GalleryService) *GalleryHandler {
	return &GalleryHandler{service}
}

func (h *GalleryHandler) GetAll(c *gin.Context) {
	category := c.Query("category")

	if category != "" {
		galleries, err := h.service.GetByCategory(category)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"data": galleries})
		return
	}

	galleries, err := h.service.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": galleries})
}

func (h *GalleryHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	gallery, err := h.service.GetByID(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": gallery})
}

func (h *GalleryHandler) Create(c *gin.Context) {
	var input service.CreateGalleryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	gallery, err := h.service.Create(input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "gallery created successfully",
		"data":    gallery,
	})
}

func (h *GalleryHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var input service.UpdateGalleryInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	gallery, err := h.service.Update(id, input)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"message": "gallery updated successfully",
		"data":    gallery,
	})
}

func (h *GalleryHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(id); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "gallery deleted successfully"})
}