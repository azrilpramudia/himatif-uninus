package handler

import (
	"net/http"

	"github.com/azrilpramudia/himatif-uninus/internal/service"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service service.AuthService
}

func NewAuthService(service service.AuthService) *AuthHandler {
	return &AuthHandler{service}
}

type LoginInput struct {
	Email string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type RegisterInput struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

func (h *AuthHandler) Login(c *gin.Context) {
	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	token, err := h.service.Login(input.Email, input.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "login successfull",
		"token":	token,
	})
}

func (h *AuthHandler) Register(c *gin.Context) {
	var input RegisterInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := h.service.Register(input.Name, input.Email, input.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "register successful",
		"data":	user,
	})
}