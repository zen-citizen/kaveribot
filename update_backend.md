## KaveriBot

A chatbot application that provides context-aware assistance.

### New Feature: Screen Capture for Contextual Assistance

We've implemented a new feature that allows users to capture their screen and send it along with their question. This helps the bot understand the user's context and provide more relevant answers.

#### Frontend Implementation

The frontend now includes:
- A camera button in the chat interface
- Screen capture functionality using the MediaDevices API
- Sending both text and image data to the backend

#### Backend API Update Required

The backend API needs to be updated to handle multipart/form-data requests containing both text and images. Here's how to update it:

##### If using Express.js:

1. Install multer for handling multipart/form-data:
```bash
npm install multer
```

2. Update your API endpoint:
```javascript
const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const app = express();

// Regular JSON parser for standard requests
app.use(express.json());

// Chat endpoint with image support
app.post('/api/chat', upload.single('image'), async (req, res) => {
  try {
    const message = req.body.message;
    let imageData = null;
    
    // If an image was uploaded, process it
    if (req.file) {
      imageData = req.file.buffer; // This is the raw image data
      // You can convert this to base64 if needed
      // const base64Image = req.file.buffer.toString('base64');
    }
    
    // Now you can send both the message and image to your AI model
    // Example with an OpenAI-like API:
    const response = await yourAIModel.process({
      message: message,
      image: imageData ? imageData : null
    });
    
    res.json({ reply: response });
  } catch (error) {
    console.error('Error processing chat request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});
```

##### If using Python with FastAPI:

1. Update your dependencies:
```bash
pip install fastapi python-multipart
```

2. Update your API endpoint:
```python
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import io
from PIL import Image

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/chat")
async def chat(
    message: str = Form(...),
    image: UploadFile = File(None)
):
    # Process the text message
    # e.g., response_text = your_ai_model.process_text(message)
    
    # If an image was uploaded, process it
    if image:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        
        # Process the image with your AI model
        # e.g., img_result = your_ai_model.process_image(img, message)
        
        # Combine results from text and image processing
        # final_response = combine_results(response_text, img_result)
        
        # For now, we'll just echo back a confirmation
        return {"reply": f"Received your message and screenshot. Let me analyze what I'm seeing..."}
    
    # If no image, just process the text
    return {"reply": f"Received your message: {message}"}
```

##### If using other frameworks:

The key requirements are:
1. Parse multipart/form-data requests
2. Extract both the text message and image file
3. Process them together to provide context-aware responses

### Testing

1. Ensure your backend is updated to handle multipart/form-data
2. Test the screen capture feature by clicking the camera icon
3. Verify that both the message and image are sent to the backend
4. Check the response from the backend to confirm proper processing