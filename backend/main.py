import os
import json
from typing import List, Dict, Any

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from dotenv import load_dotenv
from openai import OpenAI
import structlog

from chat.models import ChatCompletionRequest, Message
from chat.utils import format_message_to_openai, construct_payload, create_final_prompt


load_dotenv(".env.local")
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise EnvironmentError("OPENAI_API_KEY environment variable not set.")

logger = structlog.get_logger()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)

client = OpenAI(api_key=OPENAI_API_KEY)


def stream_response(model, messages: List[Message]):
    stream = client.chat.completions.create(
        messages = messages,
        model = model,
        stream = True,
    )
    
    for chunk in stream:
        for choice in chunk.choices:
            if choice.finish_reason == "stop":
                break
            else:
                yield f"{choice.delta.content}"


def stream_response_with_cot(payload: Dict[str, Any]):
    stream = client.chat.completions.create(
        **payload
    )
    
    for chunk in stream:
        for choice in chunk.choices:
            if choice.finish_reason == "stop":
                break
            else:
                yield f"{choice.delta.content}"


@app.post("/api/chat")
async def chat_completion(request: ChatCompletionRequest):
    model = request.model
    logger.info(f"Selected model: {model}")

    messages = request.messages
    openai_messages = format_message_to_openai(messages)

    response = StreamingResponse(stream_response(model, openai_messages))
    response.headers['x-vercel-ai-data-stream'] = 'v1'

    return response


@app.post("/api/chat-cot")
async def chat_completion_with_cot(request: ChatCompletionRequest):
    logger.info(f"Chain of thought called")
    logger.info(f"Selected model: {request.model}")
    logger.info(f"Messages Size: {len(request.messages)}")
    
    try:
        if not request.messages:
            logger.error(f"The 'messages' field cannot be empty.")
            raise HTTPException(status_code=400, detail="The 'messages' field cannot be empty.")

        user_content = request.messages[-1].content

        initial_prompt = (
            f"Assist in solving the user's request by generating a detailed step-by-step plan.\n"
            f"Think through the problem carefully, as if explaining it to yourself.\n"
            f"Do not address the user directly in this step.\n"
            f"Please provide your thought process enclosed within <THOUGHT> and </THOUGHT> tags.\n"
            f"Format your response as follows:\n"
            f"<THOUGHT>[Your detailed step-by-step plan]</THOUGHT>\n\n"
            f"Example:\n"
            f"<THOUGHT>[Step 1: Understand the user's request. Step 2: Identify key requirements. Step 3: Develop a solution approach... ]</THOUGHT>\n\n"
            f"User request: " + user_content
        )

        request.messages[-1].content = initial_prompt
        import pprint
        pprint.pp(request)

        if request.parameters == "default":
            logger.info(f"using default parameters")

            default_response_1 = client.chat.completions.create(
                messages = request.messages,
                model = request.model,
                stream = False,
            )

            thought_process = default_response_1.choices[0].message.content

            final_prompt = create_final_prompt(thought_process, user_content)

            default_response_1.choices[0].message.content = final_prompt
            default_response_1.choices[0].message.role = "user"
            request.messages[-1].content = default_response_1.choices[0].message.content
            request.messages[-1].role = default_response_1.choices[0].message.role
            request.stream = True

            openai_messages = format_message_to_openai(request.messages)

            pprint.pp(openai_messages)

            response = StreamingResponse(stream_response(request.model, openai_messages))
            response.headers['x-vercel-ai-data-stream'] = 'v1'

            return response

        elif request.parameters == "custom":
            logger.info(f"using custom parameters")

            custom_payload_1 = construct_payload(request = request)

            import pprint
            pprint.pp(custom_payload_1)

            custom_response_1 = client.chat.completions.create(**custom_payload_1)

            thought_process = custom_response_1.choices[0].message.content

            final_prompt = create_final_prompt(thought_process, user_content)

            custom_response_1.choices[0].message.content = final_prompt
            custom_response_1.choices[0].message.role = "user"
            request.messages[-1].content = custom_response_1.choices[0].message.content
            request.messages[-1].role = custom_response_1.choices[0].message.role
            request.stream = True

            custom_payload_2 = construct_payload(request = request)

            import pprint
            pprint.pp(custom_payload_2)

            response = StreamingResponse(stream_response_with_cot(payload = custom_payload_2))
            response.headers['x-vercel-ai-data-stream'] = 'v1'

            return response
        else:
            logger.error(f"Invalid parameters type specified.")
            raise HTTPException(status_code=400, detail="Invalid parameters type specified.")
        
    except ValidationError as ve:
        logger.error(f"Validation error: {ve}")
        raise HTTPException(status_code=400, detail="Request validation error. Please check your input.")

    except Exception as e:
        logger.exception("Unexpected error occurred.")
        raise HTTPException(status_code=500, detail="An internal error occurred. Please try again later.")
