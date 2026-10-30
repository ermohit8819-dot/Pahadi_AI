from typing import Dict, Any

class TelephonyAdapter:
    """
    Unified Telephony Adapter compatible with Exotel and Twilio IVR flows.
    """
    @staticmethod
    def build_twilio_twiml(message: str, gather_action: str = "/api/telephony/process-speech") -> str:
        return f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say language="hi-IN" voice="Polly.Aditi">{message}</Say>
    <Gather input="speech dtmf" timeout="5" numDigits="1" action="{gather_action}" method="POST">
        <Say language="hi-IN">अपनी सेवा का नाम बोलें अथवा मुख्य सूची हेतु 0 दबाएं।</Say>
    </Gather>
</Response>"""

    @staticmethod
    def build_exotel_ncco(message: str) -> Dict[str, Any]:
        """
        Exotel Applet / Call flow JSON configuration
        """
        return {
            "action": "play_and_gather",
            "say": message,
            "voice": "hi-IN-standard",
            "max_digits": 1,
            "timeout": 5000,
            "callback_url": "/api/telephony/process-speech"
        }
