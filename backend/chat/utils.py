import json
import time
from typing import List, Dict, Any

from chat.models import Message, ChatCompletionRequest


def format_message_to_openai(messages: List[Message]):
    openai_messages = []

    for message in messages:
        parts = []
        parts.append({"type": "text", "text": message.content})

        if message.experimental_attachments:
            for file in message.experimental_attachments:
                if file.contentType.startswith('image'):
                    parts.append({"type": "image_url", "image_url": {"url": file.url}})
                elif file.contentType.startswith("text"):
                    parts.append({"type": "text", "text": file.url})

        openai_messages.append({"role": message.role, "content": parts})

    return openai_messages


def construct_payload(request: ChatCompletionRequest) -> Dict[str, Any]:

    payload = {
        "messages": request.messages,
        "model": request.model,
        "temperature": request.temperature,
        "max_tokens": request.max_tokens,
        "top_p": request.top_p,
        "logit_bias": request.logit_bias,
        "logprobs": request.logprobs,
        "top_logprobs": request.top_logprobs,
        "n": request.n,
        "response_format": request.response_format,
        "seed": request.seed,
        "service_tier": request.service_tier,
        "stop": request.stop,
        "stream_options": request.stream_options,
        "tools": request.tools,
        "tool_choice": request.tool_choice,
        "user": request.user,
        "stream": request.stream
    }

    return payload


def create_final_prompt(thought_process: str, user_content: str) -> str:
    return (
        f"Using your thought process, provide a clear and concise final answer to the user's request.\n\n"
        f"Your thought process:\n{thought_process}\n\n"
        f"Instructions:\n"
        f"1. Formulate a final answer that fully addresses the user's request.\n"
        f"2. Ensure the answer is accurate, helpful, and directly relevant.\n"
        f"3. Do not include any part of the thought process or mention it. Provide only the final answer.\n\n"
        f"The user's original request:\n{user_content}"
    )
