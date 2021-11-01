using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Photo;
using Infrastructure.Security;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationExtensions(this IServiceCollection services, IConfiguration config)
        {
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
            });
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseSqlite(config.GetConnectionString("DefaultConnection"));

            });
            services.AddCors(c =>
            {
                c.AddPolicy("CorsPolicy", p =>
                {
                    p.AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials()
                    .WithOrigins("https://localhost:3000", "http://localhost:3000");
                });
            });
            services.AddMediatR(typeof(ListActivities.Query).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.Configure<CloudinarySetting>(config.GetSection("Cloudinary"));
            services.AddSignalR();
            return services;
        }
    }
}
