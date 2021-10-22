using API.DTO;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserName == loginDto.UserName);
            if (user == null) return Unauthorized("The username or password you entered is incorrect.");
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (result.Succeeded)
            {
                return (GetUserDto(user));
            }
            return Unauthorized("The passsword you entered is incorrect.");
        }
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (registerDto.Password != registerDto.ConfirmPassword)
            {
                return BadRequest("Password and confirm password must match");
            }
            var user = new AppUser
            {
                Email = registerDto.Email,
                DisplayName = registerDto.DisplayName,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
            {
                string errors = "";
                foreach (var error in result.Errors)
                {
                    errors = errors + error.Description + "\r\n";
                }
                return BadRequest(errors.TrimEnd());
            }
            return Ok(GetUserDto(user));
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Email == User.FindFirstValue(ClaimTypes.Email));
            if (user == null)
            {
                return NotFound();
            }
            return Ok(GetUserDto(user));
        }
        private UserDto GetUserDto(AppUser appUser)
        {
            var userDto = new UserDto
            {
                DisplayName = appUser.DisplayName,
                Image = appUser.Photos?.FirstOrDefault(p => p.IsMain)?.Url,
                Token = _tokenService.CreateToken(appUser),
                Username = appUser.UserName
            };
            return userDto;
        }
    }
}
