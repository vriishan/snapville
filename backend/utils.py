from PIL import Image
import os
import datetime

def process_image(file_path):
    # Ensure the file exists
    if not os.path.exists(file_path):
        return "File does not exist."
    
    # Open the image file
    with Image.open(file_path) as img:
        # Get image size (in bytes)
        file_size = os.path.getsize(file_path)
        # Get image resolution
        resolution = f"{img.width}x{img.height}"
        # Get file modification time
        timestamp = datetime.datetime.fromtimestamp(os.path.getmtime(file_path))
        # Get file type (MIME type)
        file_type = img.format  # This gets the image format (JPEG, PNG, etc.). Use MIME types if necessary.
        # Get file name
        file_name = os.path.basename(file_path)
    
    # Format the file size into a human-readable format (optional)
    size_hr = f"{file_size / 1024:.2f}KB"  # Converts bytes to kilobytes

    return {
        "size": size_hr,
        "resolution": resolution,
        "timestamp": timestamp,
        "file_type": file_type,
        "file_name": file_name
    }

def create_thumbnail(input_path, output_path, size=(320, 240)):
    """
    Generates a thumbnail of an image.
    :param input_path: Path to the original image.
    :param output_path: Path where the thumbnail will be saved.
    :param size: A tuple specifying the maximum size of the thumbnail.
    """
    try:
        with Image.open(input_path) as img:
            img.thumbnail(size)
            img.save(output_path)
            print(f"Thumbnail created and saved to {output_path}")
    except IOError as e:
        print(f"Cannot create thumbnail for {input_path}: {e}")
