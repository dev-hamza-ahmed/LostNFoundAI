import io
import cloudinary
import cloudinary.uploader
from config import CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
)


def upload_image(image_bytes: bytes, folder: str = "campusfind") -> str:
    result = cloudinary.uploader.upload(io.BytesIO(image_bytes), folder=folder)
    return result["secure_url"]