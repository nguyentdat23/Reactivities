﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTO
{
    public class RegisterDto
    {
        public string DisplayName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]        
        public string Password { get; set; }
        [Required]       
        public string ConfirmPassword { get; set; }
        [Required]
        public string Username { get; set; }
    }
}
