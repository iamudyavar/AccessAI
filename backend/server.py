from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError

# Setup
app = Flask(__name__)
CORS(app)
client = boto3.client("bedrock-runtime", region_name="us-east-1")
model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"  # Same model for text, image, and code file inputs

# Function to handle text input
def process_text(user_message):
    conversation = [
        {
            "role": "user",
            "content": [{"text": user_message}],  # Text input
        }
    ]

    # Send message to Bedrock
    response = client.converse(
        modelId=model_id,
        messages=conversation,
        inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
    )

    return response["output"]["message"]["content"][0]["text"]

# Function to handle file input (HTML, CSS, etc.)
def process_file(file):
    file_data = file.read().decode("utf-8")  # Read and decode file contents

    # Send file contents (code) to Bedrock model as text input
    conversation = [
        {
            "role": "user",
            "content": [{"text": file_data}],  # Treat file contents as text input
        }
    ]

    response = client.converse(
        modelId=model_id,
        messages=conversation,
        inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
    )

    return response["output"]["message"]["content"][0]["text"]

# Function to handle image input
def process_image(file):
    image_data = file.read()  # Read the image as bytes

    # Send image to Bedrock model
    response = client.converse(
        modelId=model_id,
        messages=[
            {
                "role": "user",
                "content": [{"image": image_data}],  # Assuming model accepts image in this format
            }
        ],
        inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
    )

    return response["output"]["message"]["content"][0]["text"]

# Combined route for processing text, file, and image input
@app.route("/api", methods=["POST"])
def get_info():
    try:
        # Check for text input in JSON
        if request.is_json and 'code' in request.get_json():
            data = request.get_json()
            user_message = data.get("code")

            if not user_message:
                return jsonify({"message": "No input provided"}), 400

            # Process text input
            response_text = process_text(user_message)
        
        # Check for image input in form data
        elif 'image' in request.files:
            file = request.files['image']
            response_text = process_image(file)  # Process the image input

        # Check for file input (HTML, CSS, etc.)
        elif 'file' in request.files:
            file = request.files['file']
            response_text = process_file(file)  # Process the file input (code)

        else:
            return jsonify({"message": "No valid input provided"}), 400

        # Return the response back to the frontend
        return jsonify({"message": response_text})

    except ClientError as e:
        print(f"ERROR: Unable to invoke '{model_id}'. Reason: {e}")
        return jsonify({"message": "Error invoking Amazon Bedrock"}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"message": "An unexpected error occurred"}), 500

# Run the application
if __name__ == "__main__":
    app.run(debug=True)
