from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError

# Setup
app = Flask(__name__)
CORS(app)
client = boto3.client("bedrock-runtime", region_name="us-east-1")
model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"


# Routes
@app.route("/api", methods=["POST"])
def getLLMResponse():
    try:
        data = request.get_json()  # Expecting JSON with a 'code' field
        user_message = data.get("code")  # Get the code or message input

        if not user_message:
            return (
                jsonify({"message": "No input provided"}),
                400,
            )

        prompt = """
            You are an assistant that reads website HTML, CSS, and JavaScript and provides specific accessibility suggestions based on WCAG 2.2 guidelines. 
            Return your results as a list. Respond as if you are talking to a website developer looking for guidance, and do not repeat the prompt in your answer.
            Only point out accessibility issues as a list. Do not provide any other information before or after the list.
            Next to each of your suggestions, add parentheses with the specifc WCAG 2.2 issue name.
            If the user does not provide website code, simply return "Sorry, I can't help with that"
            """

        conversation = [
            {
                "role": "user",
                "content": [{"text": user_message}],
            },
        ]

        # Send message to Bedrock
        response = client.converse(
            system=[{"text": prompt}],
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
