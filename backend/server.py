from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError

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
            Next to each of your suggestions, add parentheses with the specifc WCAG 2.2 issue name.
            If the user does not provide website code, simply return "Sorry, I can't help with that."
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

        # Return the LLM response back to the frontend
        return (
            jsonify(
                {
                    "message": response_text
                    # + "\n\nWCGAG Information:\n\n"
                    # + augmented_info["output"]["text"]
                }
            ),
            200,
        )

    except ClientError as e:
        print(f"ERROR: Unable to invoke '{model_id}'. Reason: {e}")
        return jsonify({"message": "Error invoking Amazon Bedrock"}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"message": "An unexpected error occurred"}), 500


# Run the application
if __name__ == "__main__":
    app.run(debug=True)
