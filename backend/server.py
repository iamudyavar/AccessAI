from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError
import instructor
from anthropic import AnthropicBedrock
from pydantic import BaseModel
import base64
import json

# Setup
app = Flask(__name__)
CORS(app)
client = boto3.client("bedrock-runtime", region_name="us-east-1")
bedrock_agent_runtime_client = boto3.client(
    "bedrock-agent-runtime", region_name="us-east-1"
)
model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
kb_id = "MOIU1QHB3M"
model_arn = "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-5-sonnet-20240620-v1:0"


# Structured suggestion setup
class Suggestion(BaseModel):
    suggestionTitle: str
    suggestion: str


class MultipleSuggestions(BaseModel):
    suggestions: list[Suggestion]


# Routes
@app.route("/api", methods=["POST"])
def getLLMResponse():
    try:
        data = request.form  # For handling form-data (which includes files and text)
        user_message = data.get("code")  # Get the code input

        # Check for file in the request
        file = request.files.get("file")
        image = request.files.get("image")

        # Scenario 1: User provides an image
        if image:
            return process_image(image)

        # Scenario 2: User provides a file
        if file:
            file_contents = file.read().decode("utf-8")
            # If code is also provided, append file content to the code
            if user_message:
                user_message += "\n" + file_contents
            else:
                # Use file content alone if no code is provided
                user_message = file_contents

        # Scenario 3: No code or file provided
        if not user_message:
            return jsonify({"message": "No input provided"}), 400

        prompt = """
            You are an assistant that reads website HTML, CSS, and JavaScript and provides specific accessibility suggestions based on WCAG 2.2 guidelines. 
            Return your results as a list. Respond as if you are talking to a website developer looking for guidance, and do not repeat the prompt in your answer.
            Only point out accessibility issues as a list. Do not provide any other information before or after the list.
            Provide the specific line of code that needs to be changed for each list element, if a change is necessary.
            Next to each of your suggestions, add parentheses with the specific WCAG 2.2 issue name and section number.
            If the user does not provide website code, simply return "Sorry, I can't help with that."
            """

        # Get the structured response from the model
        structured_response = getStructuredResponse(user_message, prompt)

        # Creating the dictionary to hold suggestions
        result = {"suggestions": []}

        # Iterating over the array and populating the dictionary
        for suggestion_obj in structured_response:
            result["suggestions"].append(
                {
                    "suggestionTitle": suggestion_obj.suggestionTitle,
                    "suggestion": suggestion_obj.suggestion,
                }
            )

        return result

    except ClientError as e:
        print(f"ERROR: Unable to invoke '{model_id}'. Reason: {e}")
        return jsonify({"message": "Error invoking Amazon Bedrock"}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"message": "An unexpected error occurred"}), 500


# Function to handle image input
def process_image(file):
    prompt = """
        You are an assistant that reads a website screenshot and provides specific accessibility suggestions based on WCAG 2.2 guidelines.
        Consider things like contrast, color, and layout. Think about how the website is looks for users with disabilities.
        Respond as if you are talking to a website developer looking for guidance, and do not repeat the prompt in your answer or mention the word WCAG.
        If the image is not a website screenshot, simply return "Sorry, I can't help with that."
        Return your answer in a paragraph format, not in a list. It should be concise and simple.
    """

    # Read and encode the image
    image_data = file.read()
    encoded_image = base64.b64encode(image_data).decode("utf-8")

    # Prepare the request body
    body = json.dumps(
        {
            "anthropic_version": "",
            "max_tokens": 1000,
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/jpeg",
                                "data": encoded_image,
                            },
                        },
                        {
                            "type": "text",
                            "text": prompt,
                        },
                    ],
                }
            ],
        }
    )

    # Invoke the Claude model
    response = client.invoke_model(modelId=model_id, body=body)

    # Process the response
    response_body = json.loads(response.get("body").read())

    # Extract suggestions from response
    suggestions = []
    if "content" in response_body:
        for item in response_body["content"]:
            if "text" in item:
                suggestions.append(item["text"])

    # Return the suggestions in the required format
    return {
        "suggestions": [
            {"suggestionTitle": "Visual Insights", "suggestion": suggestion}
            for suggestion in suggestions
        ]
    }


# Helper function to get structured response
def getStructuredResponse(user_message, prompt):
    structured_client = instructor.from_anthropic(AnthropicBedrock())

    resp = structured_client.messages.create(
        model="anthropic.claude-3-5-sonnet-20240620-v1:0",
        max_tokens=1024,
        messages=[
            {
                "role": "system",
                "content": prompt,
            },
            {
                "role": "user",
                "content": user_message,
            },
        ],
        response_model=MultipleSuggestions,
    )

    assert isinstance(resp, MultipleSuggestions)
    return resp.suggestions


# Run the application
if __name__ == "__main__":
    app.run(debug=True)
