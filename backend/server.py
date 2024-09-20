from flask import Flask
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError

# Setup
app = Flask(__name__)
CORS(app)
client = boto3.client("bedrock-runtime", region_name="us-east-1")
model_id = "amazon.titan-text-express-v1"


# Routes
@app.route("/api")
def get_info():
    user_message = "Describe the purpose of a 'hello world' program in one line."
    conversation = [
        {
            "role": "user",
            "content": [{"text": user_message}],
        }
    ]

    # Send message to Bedrock
    try:
        response = client.converse(
            modelId=model_id,
            messages=conversation,
            inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
        )

        response_text = response["output"]["message"]["content"][0]["text"]
        return {"message": response_text}
    except (ClientError, Exception) as e:
        print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
        return {"message": "Error getting Amazon Bedrock response"}
