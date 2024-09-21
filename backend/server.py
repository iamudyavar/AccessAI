from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError
import instructor
from anthropic import AnthropicBedrock
from pydantic import BaseModel

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
            Provide the specific line of code that needs to be changed for each list element, if a change is necessary.
            Next to each of your suggestions, add parentheses with the specifc WCAG 2.2 issue name and section number.
            If the user does not provide website code, simply return "Sorry, I can't help with that."
            """

        structured_response = getStructuredResponse(user_message, prompt)

        # Creating the dictionary
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

        # # Augment the response with the knowledge base
        # augmented_prompt = """
        # You will read the response from an assistant which provides accessibility suggestions for a website.
        # You will return a prompt that will be used to search for specific accessibility improvement techniques.
        # For example, if the response is "The website should have aria-labels", return a query relating to  "Using aria-label to provide labels for objects".
        # Write a prompt that will be sent to an embedding model to retrieve specific accessibility improvement techniques.
        # Do not include the words "accessibility improvement techniques", or anything general. It must be specific.
        # """

        # conversation = [
        #     {
        #         "role": "user",
        #         "content": [{"text": response_text}],
        #     },
        # ]

        # response = client.converse(
        #     system=[{"text": augmented_prompt}],
        #     modelId=model_id,
        #     messages=conversation,
        #     inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
        # )

        # prompt_for_knowledge_base = response["output"]["message"]["content"][0]["text"]
        # print(prompt_for_knowledge_base)

        # augmented_info = bedrock_agent_runtime_client.retrieve_and_generate(
        #     input={"text": prompt_for_knowledge_base},
        #     retrieveAndGenerateConfiguration={
        #         "type": "KNOWLEDGE_BASE",
        #         "knowledgeBaseConfiguration": {
        #             "knowledgeBaseId": kb_id,
        #             "modelArn": model_arn,
        #         },
        #     },
        # )

    except ClientError as e:
        print(f"ERROR: Unable to invoke '{model_id}'. Reason: {e}")
        return jsonify({"message": "Error invoking Amazon Bedrock"}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"message": "An unexpected error occurred"}), 500


# Helper function to get structured response
def getStructuredResponse(user_message, prompt):
    client = instructor.from_anthropic(AnthropicBedrock())

    resp = client.messages.create(
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
