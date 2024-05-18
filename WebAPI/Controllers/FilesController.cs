
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace webapi.Controllers
{

    [Route("Files")]
    [ApiController]
    public class FilesController : ControllerBase
    {
        [HttpGet("Image")]
        public async Task<IActionResult> GetImage([FromQuery] string fileName)
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "Avatars", fileName);

            if (System.IO.File.Exists(filePath))
            {
                // Leer el archivo de imagen en bytes
                byte[] image = await System.IO.File.ReadAllBytesAsync(filePath);
                // Convertir la imagen en una cadena base64
                string base64String = Convert.ToBase64String(image);
                // Obtener la extensión del archivo
                string extension = Path.GetExtension(filePath);
                string contentType;

                // Asignar el tipo de contenido según la extensión del archivo
                switch (extension.ToLower())
                {
                    case ".jpg":
                    case ".jpeg":
                        contentType = "data:image/jpeg;base64,";
                        break;
                    case ".png":
                        contentType = "data:image/png;base64,";
                        break;
                    default:
                        contentType = "data:image/jpeg;base64,"; // Tipo de contenido predeterminado para archivos desconocidos
                        break;
                }

                // Devolver la imagen con el tipo de contenido adecuado
                return Ok(new { img = contentType + base64String });
            }
            else
            {
                return BadRequest("La imagen no existe");
            }
        }

        [HttpGet("ImageReceta")]
        public async Task<IActionResult> GetImageReceta([FromQuery] string fileName)
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "ArchivoRecetas", fileName);

            if (System.IO.File.Exists(filePath))
            {
                // Leer el archivo de imagen en bytes
                byte[] image = await System.IO.File.ReadAllBytesAsync(filePath);
                // Convertir la imagen en una cadena base64
                string base64String = Convert.ToBase64String(image);
                // Obtener la extensión del archivo
                string extension = Path.GetExtension(filePath);
                string contentType;

                // Asignar el tipo de contenido según la extensión del archivo
                switch (extension.ToLower())
                {
                    case ".jpg":
                    case ".jpeg":
                        contentType = "data:image/jpeg;base64,";
                        break;
                    case ".png":
                        contentType = "data:image/png;base64,";
                        break;
                    default:
                        contentType = "data:image/jpeg;base64,"; // Tipo de contenido predeterminado para archivos desconocidos
                        break;
                }

                // Devolver la imagen con el tipo de contenido adecuado
                return Ok(new { img = contentType + base64String });
            }
            else
            {
                return BadRequest("La imagen no existe");
            }
        }

        [HttpGet("ImageExamen")]
        public async Task<IActionResult> GetImageExamen([FromQuery] string fileName)
        {
            string filePath = Path.Combine(Directory.GetCurrentDirectory(), "ArchivoExamenes", fileName);

            if (System.IO.File.Exists(filePath))
            {
                // Leer el archivo de imagen en bytes
                byte[] image = await System.IO.File.ReadAllBytesAsync(filePath);
                // Convertir la imagen en una cadena base64
                string base64String = Convert.ToBase64String(image);
                // Obtener la extensión del archivo
                string extension = Path.GetExtension(filePath);
                string contentType;

                // Asignar el tipo de contenido según la extensión del archivo
                switch (extension.ToLower())
                {
                    case ".jpg":
                    case ".jpeg":
                        contentType = "data:image/jpeg;base64,";
                        break;
                    case ".png":
                        contentType = "data:image/png;base64,";
                        break;
                    default:
                        contentType = "data:image/jpeg;base64,"; // Tipo de contenido predeterminado para archivos desconocidos
                        break;
                }

                // Devolver la imagen con el tipo de contenido adecuado
                return Ok(new { img = contentType + base64String });
            }
            else
            {
                return BadRequest("La imagen no existe");
            }
        }



        [HttpPost("ImageReceta")]
        public async Task<IActionResult> UploadImageReceta([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No se ha proporcionado ningún archivo o el archivo está vacío.");
            }

            // Obtener la ruta de destino donde se guardará la imagen en el servidor
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "ArchivoRecetas");
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }


            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadPath, fileName);

            // Guardar la imagen en el servidor
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new
            {
                status = 200,
                message = "Imagen subida correctamente",
                fileName = fileName // Devuelve el nombre del archivo para referencia futura
            });
        }

        [HttpPost("Image")]
        public async Task<IActionResult> UploadImage([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No se ha proporcionado ningún archivo o el archivo está vacío.");
            }

            // Obtener la ruta de destino donde se guardará la imagen en el servidor
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "Avatars");
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }


            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadPath, fileName);

            // Guardar la imagen en el servidor
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new
            {
                status = 200,
                message = "Imagen subida correctamente",
                fileName = fileName // Devuelve el nombre del archivo para referencia futura
            });
        }

        [HttpPost("ImageExamen")]
        public async Task<IActionResult> UploadImageExamen([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No se ha proporcionado ningún archivo o el archivo está vacío.");
            }

            // Obtener la ruta de destino donde se guardará la imagen en el servidor
            var uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "ArchivoExamenes");
            if (!Directory.Exists(uploadPath))
            {
                Directory.CreateDirectory(uploadPath);
            }


            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadPath, fileName);

            // Guardar la imagen en el servidor
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new
            {
                status = 200,
                message = "Imagen subida correctamente",
                fileName = fileName // Devuelve el nombre del archivo para referencia futura
            });
        }

    }

}
