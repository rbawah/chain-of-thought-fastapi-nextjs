from typing import List, Optional, Dict, Union, Any
from pydantic import BaseModel


class FileAttachment(BaseModel):
    name: str
    contentType: str
    url: str


class Message(BaseModel):
    role: str
    content: str
    experimental_attachments: Optional[List[FileAttachment]] = None


# class RequestModel(BaseModel):
#     messages: List[Message]
#     model: str


class ChatCompletionRequest(BaseModel):
    parameters: str
    model: str
    messages: List[Message]
    # feel free to provide your own custom parameters
    # below to study the model's behavior.
    logit_bias: Optional[Dict[str, float]] = None
    logprobs: Optional[bool] = False
    top_logprobs: Optional[int] = None
    n: Optional[int] = 1
    response_format: Optional[Dict[str, Any]] = None
    seed: Optional[int] = None
    service_tier: Optional[str] = None
    stop: Optional[Union[str, List[str]]] = None
    stream: Optional[bool] = False
    stream_options: Optional[Dict[str, Any]] = None
    temperature: Optional[float] = 1.0
    top_p: Optional[float] = 1.0
    tools: Optional[List[Dict[str, Any]]] = None
    tool_choice: Optional[Union[str, Dict[str, Any]]] = None
    user: Optional[str] = None
    max_tokens: Optional[int] = 4096
