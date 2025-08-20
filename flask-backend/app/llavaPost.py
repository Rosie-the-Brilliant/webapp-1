import requests

class llavaPost:
    """
    LLM interface that can play the game using either text-based prompts or image data.
    Uses Ollama API for free multimodal capabilities.
    """
    
    def __init__(self, model_name="llava"):
        self.model_name = model_name.lower()
        if(model_name == "llava"):
            self.llm_url = "http://localhost:11434"
        elif(model_name == "gemini"):
            self.llm_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

        
        # Test connection to Ollama
        self._test_connection()
        
    
    def _test_connection(self):
        """Test if Ollama is running and accessible"""
        try:
            response = requests.get(f"{self.llm_url}/api/tags") 
            if response.status_code != 200:
                print(f"Warning: API not accessible at {self.llm_url}")
                print("Please install and run Ollama: https://ollama.ai/")
                print("For multimodal support, pull llava: ollama pull llava")
        except requests.exceptions.ConnectionError:
            print(f"Warning: Cannot connect to Ollama at {self.llm_url}")
            print("Please install and run Ollama: https://ollama.ai/")
    
    def _call_ollama_api(self, prompt):
        """Call Ollama API and get response"""
        try:
            payload = {
                "model": self.model_name, 
                "messages": [
                    {"role": "user", "content": prompt},
                ],
                "stream": False,
                "options": {
                    "num_predict": 100,
                }
            }
            
            response = requests.post(
                f"{self.llm_url}/api/chat",
                json=payload,
                timeout=100
            )

            if response.status_code == 200:
                result = response.json()
                response_text = result.get("message", {}).get("content", "").strip()
                return response_text
            else:
                print(f"❌ Error calling LLM API: {response.status_code}")
                print(f"Response text: {response.text}")
                return None
                
        except requests.exceptions.ConnectionError as e:
            print(f"❌ Connection error: Cannot connect to LLM at {self.llm_url}")
            return None
        except requests.exceptions.Timeout as e:
            print(f"❌ Timeout error: LLM took too long to respond")
            print("💡 Try using a smaller model or restart Ollama")
            return None
        except Exception as e:
            print(f"❌ Error calling LLM API: {e}")
            print(f"💡 Check if LLM is running and the model '{self.model_name}' is available")
            return None
    
        # Get LLM response
    def get_model_response(self, prompt):
        
        if not prompt:
            print("❌ No prompt provided")
            return "UNKNOWN"
        
        response = self._call_ollama_api(prompt)

        print("response", response)

        if response is None:
            print("❌ LLM API call failed or returned no response.")
            return "UNKNOWN"
        
        return response