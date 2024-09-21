from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError

# Setup
app = Flask(__name__)
CORS(app)
client = boto3.client("bedrock-runtime", region_name="us-east-1")
model_id = "amazon.titan-text-express-v1"


# Routes
@app.route("/api", methods=["POST"])
def get_info():
    try:
        data = request.get_json()  # Expecting JSON with a 'code' field
        user_message = data.get("code")  # Get the code or message input

        if not user_message:
            return (
                jsonify({"message": "No input provided"}),
                400,
            )

        # Prepare conversation to send to Amazon Bedrock
        conversation = [
            {
                "role": "user",
                "content": [{"text": user_message}],
            }
        ]

        # Send message to Bedrock
        response = client.converse(
            modelId=model_id,
            messages=conversation,
            inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
        )

        # Extract the LLM response from Bedrock
        response_text = response["output"]["message"]["content"][0]["text"]

        # Return the LLM response back to the frontend
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
