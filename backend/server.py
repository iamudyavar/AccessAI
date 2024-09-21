# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import boto3
# from botocore.exceptions import ClientError

# # Setup
# app = Flask(__name__)
# CORS(app)
# client = boto3.client("bedrock-runtime", region_name="us-east-1")
# model_id = "amazon.titan-text-express-v1"


# # Routes
# @app.route("/api", methods=["POST"])
# def get_info():
#     try:
#         data = request.get_json()  # Expecting JSON with a 'code' field
#         user_message = data.get("code")  # Get the code or message input

#         if not user_message:
#             return (
#                 jsonify({"message": "No input provided"}),
#                 400,
#             )

#         # Prepare conversation to send to Amazon Bedrock
#         conversation = [
#             {
#                 "role": "user",
#                 "content": [{"text": user_message}],
#             }
#         ]

#         # Send message to Bedrock
#         response = client.converse(
#             modelId=model_id,
#             messages=conversation,
#             inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
#         )

#         # Extract the LLM response from Bedrock
#         response_text = response["output"]["message"]["content"][0]["text"]

#         # Return the LLM response back to the frontend
#         return jsonify({"message": response_text})

#     except ClientError as e:
#         print(f"ERROR: Unable to invoke '{model_id}'. Reason: {e}")
#         return jsonify({"message": "Error invoking Amazon Bedrock"}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({"message": "An unexpected error occurred"}), 500


# # Run the application
# if __name__ == "__main__":
#     app.run(debug=True)


#----------------------- Working Code------------------

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import boto3
# from botocore.exceptions import ClientError
# import os

# # Setup
# app = Flask(__name__)
# CORS(app)
# client = boto3.client("bedrock-runtime", region_name="us-east-1")
# model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"

# # Ensure a temporary directory exists for file uploads
# UPLOAD_FOLDER = 'temp_uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Routes
# @app.route("/api", methods=["POST"])
# def get_info():
#     try:
#         user_message = ""
        
#         if 'file' in request.files:
#             file = request.files['file']
#             if file.filename != '':
#                 file_path = os.path.join(UPLOAD_FOLDER, file.filename)
#                 file.save(file_path)
#                 with open(file_path, 'r') as f:
#                     user_message = f.read()
#                 os.remove(file_path)  # Clean up the temporary file
#         else:
#             user_message = request.form.get("code", "")

#         if not user_message:
#             return jsonify({"message": "No input provided"}), 400

#         # Prepare conversation to send to Amazon Bedrock
#         conversation = [
#             {
#                 "role": "user",
#                 "content": [{"text": user_message}],
#             }
#         ]

#         # Send message to Bedrock
#         response = client.converse(
#             modelId=model_id,
#             messages=conversation,
#             inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
#         )

#         # Extract the LLM response from Bedrock
#         response_text = response["output"]["message"]["content"][0]["text"]

#         # Return the LLM response back to the frontend
#         return jsonify({"message": response_text})

#     except ClientError as e:
#         print(f"ERROR: Unable to invoke '{model_id}'. Reason: {e}")
#         return jsonify({"message": "Error invoking Amazon Bedrock"}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({"message": "An unexpected error occurred"}), 500

# # Run the application
# if __name__ == "__main__":
#     app.run(debug=True)

#--------------

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import boto3
# from botocore.exceptions import ClientError
# import os
# import base64
# import mimetypes

# # Setup
# app = Flask(__name__)
# CORS(app)
# client = boto3.client("bedrock-runtime", region_name="us-east-1")
# model_id = "anthropic.claude-3-sonnet-20240616-v1:0"

# # Ensure a temporary directory exists for file uploads
# UPLOAD_FOLDER = 'temp_uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Allowed file extensions
# ALLOWED_EXTENSIONS = {'txt', 'py', 'js', 'html', 'css', 'png', 'jpg', 'jpeg', 'gif'}

# def allowed_file(filename):
#     return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# # Routes
# @app.route("/api", methods=["POST"])
# def get_info():
#     try:
#         user_message = ""
#         image_content = None
        
#         if 'file' in request.files:
#             file = request.files['file']
#             if file.filename != '' and allowed_file(file.filename):
#                 file_path = os.path.join(UPLOAD_FOLDER, file.filename)
#                 file.save(file_path)
                
#                 if file.filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif'}:
#                     with open(file_path, 'rb') as image_file:
#                         image_content = base64.b64encode(image_file.read()).decode('utf-8')
#                     mime_type = mimetypes.guess_type(file_path)[0]
#                 else:
#                     with open(file_path, 'r') as f:
#                         user_message = f.read()
                
#                 os.remove(file_path)  # Clean up the temporary file
#         else:
#             user_message = request.form.get("code", "")

#         if not user_message and not image_content:
#             return jsonify({"message": "No input provided"}), 400

#         # Prepare conversation to send to Amazon Bedrock
#         conversation = [
#             {
#                 "role": "user",
#                 "content": []
#             }
#         ]

#         if user_message:
#             conversation[0]["content"].append({"type": "text", "text": user_message})

#         if image_content:
#             conversation[0]["content"].append({
#                 "type": "image",
#                 "source": {
#                     "type": "base64",
#                     "media_type": mime_type,
#                     "data": image_content
#                 }
#             })

#         # Send message to Bedrock
#         response = client.invoke_model(
#             modelId=model_id,
#             body=json.dumps({
#                 "anthropic_version": "bedrock-2023-05-31",
#                 "max_tokens": 1024,
#                 "messages": conversation
#             })
#         )

#         # Extract the LLM response from Bedrock
#         response_body = json.loads(response['body'].read())
#         response_text = response_body['content'][0]['text']

#         # Return the LLM response back to the frontend
#         return jsonify({"message": response_text})

#     except ClientError as e:
#         print(f"ERROR: Unable to invoke '{model_id}'. Reason: {e}")
#         return jsonify({"message": "Error invoking Amazon Bedrock"}), 500
#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({"message": "An unexpected error occurred"}), 500

# # Run the application
# if __name__ == "__main__":
#     app.run(debug=True)





#------------

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import boto3
# from botocore.exceptions import ClientError
# import os

# # Setup
# app = Flask(__name__)
# CORS(app)
# client = boto3.client("bedrock-runtime", region_name="us-east-1")
# model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"

# # Ensure a temporary directory exists for file uploads
# UPLOAD_FOLDER = 'temp_uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# # Routes
# @app.route("/api", methods=["POST"])
# def get_info():
#     try:
#         user_message = ""
#         file_content = None

#         # Handle file input if provided
#         if 'file' in request.files and request.files['file'].filename != '':
#             file = request.files['file']
#             file_path = os.path.join(UPLOAD_FOLDER, file.filename)
#             file.save(file_path)
#             with open(file_path, 'rb') as f:
#                 file_content = f.read()
#             os.remove(file_path)  # Clean up the temporary file

#         # Handle text input if provided
#         if 'code' in request.form:
#             user_message = request.form.get("code", "")

#         # Ensure at least one input is provided (text or file)
#         if not user_message and not file_content:
#             return jsonify({"message": "No input provided"}), 400

#         # Prepare the conversation to send to Amazon Bedrock
#         conversation = []
        
#         # Add user text message to the conversation if it exists
#         if user_message:
#             conversation.append({
#                 "role": "user",
#                 "content": [{"text": user_message}],
#             })

#         # Add file content to the conversation if it exists
#         if file_content:
#             conversation.append({
#                 "role": "user",
#                 "content": [{"file": file_content}],  # Assuming file input is supported in this manner
#             })

#         # Send the message to Bedrock
#         response = client.converse(
#             modelId=model_id,
#             messages=conversation,
#             inferenceConfig={"maxTokens": 512, "temperature": 0.5, "topP": 0.9},
#         )

#         # Extract the LLM response from Bedrock
#         response_text = response["output"]["message"]["content"][0]["text"]

#         # Return the LLM response back to the frontend
#         return jsonify({"message": response_text})

#     except ClientError as e:
#         print(f"ERROR: Unable to invoke '{model_id}'. Reason: {e}")
#         return jsonify({"message": "Error invoking Amazon Bedrock"}), 500

#     except Exception as e:
#         print(f"Unexpected error: {e}")
#         return jsonify({"message": "An unexpected error occurred"}), 500

# # Run the application
# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import boto3
from botocore.exceptions import ClientError
import os

# Setup
app = Flask(__name__)
CORS(app)
client = boto3.client("bedrock-runtime", region_name="us-east-1")
model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"

# Ensure a temporary directory exists for file uploads
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Routes
@app.route("/api", methods=["POST"])
def get_info():
    try:
        user_message = ""
        file_content = None

        # Handle file input if provided
        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
            with open(file_path, 'r', encoding="utf-8") as f:  # Reading as text document
                file_content = f.read()
            os.remove(file_path)  # Clean up the temporary file

        # Handle text input if provided
        if 'code' in request.form:
            user_message = request.form.get("code", "")

        # Ensure at least one input is provided (text or file)
        if not user_message and not file_content:
            return jsonify({"message": "No input provided"}), 400

        # Prepare the conversation to send to Amazon Bedrock
        conversation = []

        # Add user text message to the conversation if it exists
        if user_message:
            conversation.append({
                "role": "user",
                "content": [{"text": user_message}],
            })

        # Add file content as a document to the conversation if it exists
        if file_content:
            conversation.append({
                "role": "user",
                "content": [{"document": file_content}],  # Use "document" for file input
            })

        # Send the message to Bedrock
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

