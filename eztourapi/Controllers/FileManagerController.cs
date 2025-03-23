using eztourapi.Dtos.Responses;
using Microsoft.AspNetCore.Mvc;

namespace eztourapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FileManagerController : ControllerBase
    {
        private readonly string _basePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        [HttpGet]
        public IActionResult GetFiles()
        {
            var folderStructure = GetFolderStructure(_basePath);
            return Ok(folderStructure);
        }

        private List<object> GetFolderStructure(string path)
        {
            var directories = Directory.GetDirectories(path);
            var files = Directory.GetFiles(path);

            var structure = new List<object>();

            // Add Folders
            foreach (var dir in directories)
            {
                structure.Add(new
                {
                    name = Path.GetFileName(dir),
                    type = "folder",
                    children = GetFolderStructure(dir) // Recursively get subfolders & files
                });
            }

            // Add Files
            foreach (var file in files)
            {
                // get filepath after wwwroot
                var filePath = file.Split("wwwroot\\")[1];

                structure.Add(new
                {
                    name = Path.GetFileName(file),
                    type = "file",
                    size = new FileInfo(file).Length,
                    url = filePath
                });
            }

            return structure;
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromQuery] string folderPath)
        {
            if (file == null || file.Length == 0)
            {
                return Ok(new BaseResponse()
                {
                    IsSucceeded = false,
                    Message = "Please choose a file to upload"
                });
            }

            // Ensure folderPath is valid
            if (string.IsNullOrWhiteSpace(folderPath))
            {
                return Ok(new BaseResponse()
                {
                    IsSucceeded = false,
                    Message = "Please choose a folder to upload"
                });
            }

            string targetFolderPath = Path.Combine(_basePath, folderPath);

            // Create the directory if it doesn’t exist
            if (!Directory.Exists(targetFolderPath))
            {
                return Ok(new BaseResponse()
                {
                    IsSucceeded = false,
                    Message = "Please choose a folder to upload"
                });
            }

            // Generate full file path
            string filePath = Path.Combine(targetFolderPath, file.FileName);

            // Check if file exsited
            if (System.IO.File.Exists(filePath))
            {
                return Ok(new BaseResponse()
                {
                    IsSucceeded = false,
                    Message = "File with same name exsited"
                });
            }

            // Save the file
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return Ok(new
            {
                IsSucceeded = true,
                Message = "File uploaded successfully.",
                Url = filePath.Split("wwwroot\\")[1]
            });
        }
    }
}
